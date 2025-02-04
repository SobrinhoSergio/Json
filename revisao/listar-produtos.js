document.addEventListener('DOMContentLoaded', async (ev) => { 
    await listarProdutos();
});

async function listarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        let total = 0;
        let maior = -Infinity;
        let menor = Infinity;
        
        data.forEach((produto) => {
            adicionaProdutoTabela2(produto);
            let preco = parseFloat(produto.preco);
            total += preco;
            if (preco > maior) maior = preco;
            if (preco < menor) menor = preco;
        });

        let media = data.length > 0 ? total / data.length : 0;
        atualizarEstatisticas(total, maior, menor, media);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function removerProduto(produto, idLinhaARemover) {
    try {
        const response = await fetch('http://localhost:3000/produtos/' + produto.id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        alert("Produto excluído com sucesso!");
        document.getElementById(idLinhaARemover)?.remove();
        atualizarEstatisticas(); // Atualiza estatísticas após remoção
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
}

async function adicionaProdutoTabela2(produto) {
    document.getElementById("tabelaProdutosLista")?.querySelectorAll("tbody").forEach((corpoTabela) => {
        var linha = document.createElement("tr");
        linha.id = "linhaTabelaProduto" + produto.id;
        var colunaNome = document.createElement("td");
        colunaNome.textContent = produto.nome;
        var colunaPreco = document.createElement("td");
        colunaPreco.textContent = produto.preco;
        var colunaFabricante = document.createElement("td");
        colunaFabricante.textContent = produto.fabricante;
        var colunaRemover = document.createElement("td");
        var link = document.createElement("a");
        link.addEventListener('click', (ev) => {
            removerProduto(produto, "linhaTabelaProduto" + produto.id);
        });
        link.textContent = "Remover";
        link.href = "#";
        colunaRemover.appendChild(link);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaPreco);
        linha.appendChild(colunaFabricante);
        linha.appendChild(colunaRemover);
        corpoTabela.appendChild(linha);
    });

    atualizarEstatisticas(); // Atualiza estatísticas após adicionar produto
}

function atualizarEstatisticas(total = 0, maior = 0, menor = 0, media = 0) {
    let precos = [];
    document.querySelectorAll("#tabelaProdutosLista tbody tr").forEach((linha) => {
        let preco = parseFloat(linha.children[1].textContent) || 0;
        precos.push(preco);
    });

    if (precos.length > 0) {
        total = precos.reduce((acc, val) => acc + val, 0);
        maior = Math.max(...precos);
        menor = Math.min(...precos);
        media = total / precos.length;
    }

    document.getElementById("totalProdutos").textContent = total.toFixed(2);
    document.getElementById("maiorPreco").textContent = maior.toFixed(2);
    document.getElementById("menorPreco").textContent = menor.toFixed(2);
    document.getElementById("mediaPreco").textContent = media.toFixed(2);
}
