document.addEventListener('DOMContentLoaded', async () => { 
    await listarProdutos();
});

async function listarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        if (!response.ok) throw new Error(`Erro ao carregar produtos: ${response.statusText}`);

        const produtos = await response.json();
        let precos = produtos.map(produto => parseFloat(produto.preco) || 0);

        // Adiciona produtos na tabela
        produtos.forEach(adicionaProdutoTabela);

        // Atualiza estatísticas
        atualizarEstatisticas(precos);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar produtos.");
    }
}

async function removerProduto(id) {
    try {
        const response = await fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Erro ao excluir: ${response.statusText}`);

        alert("Produto excluído com sucesso!");
        document.getElementById(`linhaProduto${id}`)?.remove();
        atualizarEstatisticas(); // Recalcula estatísticas
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir produto.");
    }
}

function adicionaProdutoTabela(produto) {
    const tbody = document.querySelector("#tabelaProdutosLista tbody");
    if (!tbody) return;

    const linha = document.createElement("tr");
    linha.id = `linhaProduto${produto.id}`;

    const colunaNome = document.createElement("td");
    colunaNome.textContent = produto.nome;

    const colunaPreco = document.createElement("td");
    colunaPreco.textContent = produto.preco;

    const colunaFabricante = document.createElement("td");
    colunaFabricante.textContent = produto.fabricante;

    const colunaRemover = document.createElement("td");
    const linkRemover = document.createElement("a");
    linkRemover.textContent = "Remover";
    linkRemover.href = "#";
    linkRemover.addEventListener("click", () => removerProduto(produto.id));
    colunaRemover.appendChild(linkRemover);

    linha.appendChild(colunaNome);
    linha.appendChild(colunaPreco);
    linha.appendChild(colunaFabricante);
    linha.appendChild(colunaRemover);

    tbody.appendChild(linha);
    atualizarEstatisticas(); // Atualiza estatísticas ao adicionar produto
}

function atualizarEstatisticas(precos = []) {
    if (precos.length === 0) {
        precos = [...document.querySelectorAll("#tabelaProdutosLista tbody tr")]
            .map(linha => parseFloat(linha.children[1].textContent) || 0);
    }

    const total = precos.reduce((acc, val) => acc + val, 0);
    const maior = Math.max(...precos, 0);
    const menor = Math.min(...precos, Infinity);
    const media = precos.length > 0 ? total / precos.length : 0;

    // Atualiza valores na tela
    atualizarElemento("totalProdutos", total);
    atualizarElemento("maiorPreco", maior);
    atualizarElemento("menorPreco", menor);
    atualizarElemento("mediaPreco", media);
}

function atualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor.toFixed(2);
}
