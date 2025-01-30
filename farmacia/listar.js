async function consultarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        const produtos = await tratarResposta(response);
        popularFiltros(produtos);
        tratarProdutos(produtos);
    } catch (erro) {
        console.error('Erro:', erro.message);
    }
}

function tratarResposta(response) {
    if (!response.ok) {
        throw new Error('Erro ao consultar os produtos.');
    }
    return response.json();
}

function tratarProdutos(produtos) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    produtos.forEach((produto) => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = produto.id;

        const tdNome = document.createElement('td');
        tdNome.textContent = produto.nome;

        const tdFabricante = document.createElement('td');
        tdFabricante.textContent = produto.fabricante;

        const tdPreco = document.createElement('td');
        tdPreco.textContent = `R$ ${produto.preco.toFixed(2)}`;

        const tdTipo = document.createElement('td');
        tdTipo.textContent = produto.tipo;

        const tdAcao = document.createElement('td');
        const btnDeletar = document.createElement('button');
        btnDeletar.textContent = 'Deletar';
        btnDeletar.addEventListener('click', () => deletarProduto(produto.id));
        tdAcao.appendChild(btnDeletar);

        tr.append(tdId, tdNome, tdFabricante, tdPreco, tdTipo, tdAcao);
        tbody.appendChild(tr);
    });

    atualizarEstatisticas(produtos);
}

function popularFiltros(produtos) {
    const fabricanteSelect = document.getElementById('fabricante');
    fabricanteSelect.innerHTML = '';

    const optionTodos = document.createElement('option');
    optionTodos.value = '';
    optionTodos.textContent = 'Todos';
    fabricanteSelect.appendChild(optionTodos);

    const fabricantes = [...new Set(produtos.map(produto => produto.fabricante))];

    fabricantes.forEach(fabricante => {
        const option = document.createElement('option');
        option.value = fabricante;
        option.textContent = fabricante;
        fabricanteSelect.appendChild(option);
    });

    fabricanteSelect.addEventListener('change', () => {
        const fabricanteSelecionado = fabricanteSelect.value;
        const produtosFiltrados = fabricanteSelecionado ? 
            produtos.filter(produto => produto.fabricante === fabricanteSelecionado) : 
            produtos;
        tratarProdutos(produtosFiltrados);
    });
}

function atualizarEstatisticas(produtos) {
    const tfoot = document.querySelector('tfoot');
    tfoot.innerHTML = '';

    if (produtos.length === 0) {
        return;
    }

    const precos = produtos.map(p => p.preco);
    const total = precos.reduce((acc, val) => acc + val, 0);
    const media = total / precos.length;
    const maisCaro = Math.max(...precos);
    const maisBarato = Math.min(...precos);
a
    const tr = document.createElement('tr');

    const tdLabel = document.createElement('td');
    tdLabel.setAttribute('colspan', '3');
    tdLabel.innerHTML = '<strong>Estatísticas:</strong>';

    const tdMaisCaro = document.createElement('td');
    tdMaisCaro.innerHTML = `<strong>Mais Caro:</strong> R$ ${maisCaro.toFixed(2)}`;

    const tdMaisBarato = document.createElement('td');
    tdMaisBarato.innerHTML = `<strong>Mais Barato:</strong> R$ ${maisBarato.toFixed(2)}`;

    const tdSoma = document.createElement('td');
    tdSoma.innerHTML = `<strong>Soma:</strong> R$ ${total.toFixed(2)}`;

    const tdMedia = document.createElement('td');
    tdMedia.innerHTML = `<strong>Média:</strong> R$ ${media.toFixed(2)}`;

    tr.append(tdLabel, tdMaisCaro, tdMaisBarato, tdSoma, tdMedia);
    tfoot.appendChild(tr);
}

function deletarProduto(id) {
    fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar produto.');
            }
            return consultarProdutos();
        })
        .catch(erro => console.error('Erro:', erro.message));
}

document.addEventListener('DOMContentLoaded', consultarProdutos);
