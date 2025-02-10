document.addEventListener('DOMContentLoaded', async (ev) => {
    let campoNome = document.getElementById("nome");
    const tabela = document.getElementById("tabelaVendas");

    document.getElementById("btnFiltrar")?.addEventListener('click', async (ev) => {
        limparTabela(tabela);
        carregaDadosTabela(campoNome.value);
        ev.preventDefault();
    });

    // Exemplo de como pegar a data de hoje no formato ISO
    let dataHoje = new Date().toISOString();
    console.log("Data de hoje (ISO):", dataHoje);

    // Exemplo de como transformar uma data ISO para o formato DD/MM/AAAA
    let dataFormatada = new Date(dataHoje).toLocaleDateString("pt-BR");
    console.log("Data de hoje formatada:", dataFormatada);
});

async function carregaDadosTabela(produtoParam) {
    console.log(produtoParam);
    try {
        const response = await fetch('http://localhost:3000/vendas' + (produtoParam !== '' ? '?nome_like=' + produtoParam : ''));
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        data.forEach((venda) => {
            console.log(venda.nome);
            adicionaVenda(venda, produtoParam);
        });
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function adicionaVenda(venda, produtoParam) {
    document.getElementById("tabelaVendas")?.querySelectorAll("tbody").forEach((corpoTabela) => {
        var linha = document.createElement("tr");
        var colunaVendedor = document.createElement("td");
        colunaVendedor.textContent = venda.nome;
        var colunaQuantidade = document.createElement("td");
        colunaQuantidade.textContent = venda.modelo;
        var colunaSubTotal = document.createElement("td");
        colunaSubTotal.textContent = venda.valorVenda;
        
        // Formatar a data no formato DD/MM/AAAA
        var colunaDataVenda = document.createElement("td");
        var dataFormatada = new Date(venda.dataVenda).toLocaleDateString("pt-BR");
        colunaDataVenda.textContent = dataFormatada;

        var colunaEditar = document.createElement("td");
        var linkEd = document.createElement("a");
        linkEd.addEventListener('click', () => { editarProduto(venda); });
        linkEd.textContent = "Editar";
        linkEd.href = "#";
        colunaEditar.appendChild(linkEd);

        var colunaRemover = document.createElement("td");
        var link = document.createElement("a");
        link.addEventListener('click', () => { removerProduto(venda, "linhaTabelaProduto" + venda.id); linha.remove(); });
        link.textContent = "Remover";
        link.href = "#";
        colunaRemover.appendChild(link);

        linha.appendChild(colunaVendedor);
        linha.appendChild(colunaQuantidade);
        linha.appendChild(colunaSubTotal);
        linha.appendChild(colunaDataVenda);
        linha.appendChild(colunaEditar);
        linha.appendChild(colunaRemover);
        corpoTabela.appendChild(linha);
    });
}

function limparTabela(tabela) {
    tabela.querySelectorAll("tbody").forEach((corpoTabela) => {
        corpoTabela.innerHTML = "";
    });
}

async function removerProduto(produto, idLinhaARemover) {
    try {
        // Remover o item do localStorage
        localStorage.removeItem('venda_' + produto.id);

        // Realizar a exclusão via API
        const response = await fetch('http://localhost:3000/vendas/' + produto.id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }

        alert("Produto excluído com sucesso!");

        // Remover a linha da tabela
        document.getElementById(idLinhaARemover)?.remove();
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
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
