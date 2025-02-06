document.addEventListener('DOMContentLoaded', async () => {
    await listarProdutos();
    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltros);
});

async function listarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        preencherFabricantes(data);
        data.forEach(produto => {
            adicionaProdutoTabela(produto);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function preencherFabricantes(produtos) {
    const selectFabricante = document.getElementById('filtroFabricante');
    const fabricantes = Array.from(new Set(produtos.map(produto => produto.fabricante)));
    fabricantes.forEach(fabricante => {
        const option = document.createElement('option');
        option.value = fabricante;
        option.textContent = fabricante;
        selectFabricante.appendChild(option);
    });
}

async function aplicarFiltros() {
    const nomeFiltro = document.getElementById('filtroNome').value.toLowerCase();
    const fabricanteFiltro = document.getElementById('filtroFabricante').value;

    // Limpar a tabela
    const corpoTabela = document.getElementById('tabelaProdutosLista').querySelector('tbody');
    corpoTabela.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/produtos');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();

        // Filtrando os produtos
        const produtosFiltrados = data.filter(produto => {
            const nomeMatch = produto.nome.toLowerCase().includes(nomeFiltro);
            const fabricanteMatch = fabricanteFiltro ? produto.fabricante === fabricanteFiltro : true;
            return nomeMatch && fabricanteMatch;
        });

        // Adicionando os produtos filtrados à tabela
        produtosFiltrados.forEach(produto => {
            adicionaProdutoTabela(produto);
        });
        atualizarEstatisticas();
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
}

async function removerProduto(produto, idLinhaARemover) {
    try {
        const response = await fetch(`http://localhost:3000/produtos/${produto.id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        alert("Produto excluído com sucesso!");
        document.getElementById(idLinhaARemover)?.remove();
        atualizarEstatisticas();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
}

async function editarProduto(produto) {
    try {
        const formulario = document.getElementById("formEditar");
        const campoIdProduto = document.getElementById("idProduto");
        campoIdProduto.setAttribute("value", produto.id);
        formulario.submit();
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}

function adicionaProdutoTabela(produto) {
    document.getElementById("tabelaProdutosLista")?.querySelectorAll("tbody").forEach(corpoTabela => {
        var linha = document.createElement("tr");
        linha.id = "linhaTabelaProduto" + produto.id;

        var colunaNome = document.createElement("td");
        colunaNome.textContent = produto.nome;

        var colunaPreco = document.createElement("td");
        colunaPreco.textContent = produto.preco;

        var colunaFabricante = document.createElement("td");
        colunaFabricante.textContent = produto.fabricante;

        var colunaRemover = document.createElement("td");
        var linkRemover = document.createElement("a");
        linkRemover.addEventListener('click', () => removerProduto(produto, linha.id));
        linkRemover.textContent = "Remover";
        linkRemover.href = "#";
        colunaRemover.appendChild(linkRemover);

        var colunaEditar = document.createElement("td");
        var linkEditar = document.createElement("a");
        linkEditar.addEventListener('click', () => editarProduto(produto));
        linkEditar.textContent = "Editar";
        linkEditar.href = "#";
        colunaEditar.appendChild(linkEditar);

        linha.appendChild(colunaNome);
        linha.appendChild(colunaPreco);
        linha.appendChild(colunaFabricante);
        linha.appendChild(colunaRemover);
        linha.appendChild(colunaEditar);

        corpoTabela.appendChild(linha);
    });

    atualizarEstatisticas();
}

function atualizarEstatisticas() {
    let precos = [...document.querySelectorAll("#tabelaProdutosLista tbody tr")]
        .map(linha => parseFloat(linha.children[1].textContent) || 0);

    const total = precos.reduce((acc, val) => acc + val, 0);
    const maior = Math.max(...precos, 0);
    const menor = Math.min(...precos, Infinity);
    const media = precos.length > 0 ? total / precos.length : 0;

    atualizarElemento("totalProdutos", total);
    atualizarElemento("maiorPreco", maior);
    atualizarElemento("menorPreco", menor);
    atualizarElemento("mediaPreco", media);
}

function atualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor.toFixed(2);
}
