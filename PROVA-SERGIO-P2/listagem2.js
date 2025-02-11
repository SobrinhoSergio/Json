document.addEventListener('DOMContentLoaded', async (ev) => {
    let campoNome = document.getElementById("nome");
    let campoModelo = document.getElementById("modelo");
    const tabela = document.getElementById("tabelaVendas");

    await carregarModelos();

    document.getElementById("btnFiltrar")?.addEventListener('click', async (ev) => {
        limparTabela(tabela);
        carregaDadosTabela(campoNome.value, campoModelo.value);
        ev.preventDefault();
    });
});

async function carregarModelos() {
    try {
        const response = await fetch('http://localhost:3000/vendas');
        if (!response.ok) {
            throw new Error(`Erro ao carregar modelos: ${response.statusText}`);
        }
        const data = await response.json();
        const modelosUnicos = [...new Set(data.map(venda => venda.modelo))];
        
        const selectModelo = document.getElementById("modelo");
        modelosUnicos.forEach(modelo => {
            let option = document.createElement("option");
            option.value = modelo;
            option.textContent = modelo;
            selectModelo.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
    }
}

async function carregaDadosTabela(produtoParam, modeloParam) {
    try {
        let url = 'http://localhost:3000/vendas?';
        if (produtoParam) url += `nome_like=${produtoParam}&`;
        if (modeloParam) url += `modelo_like=${modeloParam}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((venda) => {
            adicionaVenda(venda);
        });
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function adicionaVenda(venda) {
    document.getElementById("tabelaVendas")?.querySelectorAll("tbody").forEach((corpoTabela) => {
        var linha = document.createElement("tr");
        var colunaVendedor = document.createElement("td");
        colunaVendedor.textContent = venda.nome;
        var colunaQuantidade = document.createElement("td");
        colunaQuantidade.textContent = venda.modelo;
        var colunaSubTotal = document.createElement("td");
        colunaSubTotal.textContent = venda.valorVenda;
        
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

        // Remove o produto do localStorage
        let vendas = JSON.parse(localStorage.getItem("vendasTeste")) || [];
        vendas = vendas.filter(v => v.id !== produto.id); // Remove o produto pelo ID
        localStorage.setItem("vendasTeste", JSON.stringify(vendas));

        const response = await fetch('http://localhost:3000/vendas/' + produto.id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }

        alert("Produto excluído com sucesso!");
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
