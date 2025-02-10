document.addEventListener('DOMContentLoaded', async () => {
    await listarVendas();
    document.getElementById('aplicarFiltros').addEventListener('click', aplicarFiltros);
});

async function listarVendas() {
    try {
        const response = await fetch('http://localhost:3000/vendas');
        if (!response.ok) {
            throw new Error(`Erro ao carregar vendas: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach(venda => {
            adicionaVendaTabela2(venda);
        });
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function aplicarFiltros() {
    const nomeFiltro = document.getElementById('filtroNome').value.toLowerCase();
    
    const corpoTabela = document.getElementById('tabelaVendasLista').querySelector('tbody');
    corpoTabela.innerHTML = ''; 

    try {
        const response = await fetch('http://localhost:3000/vendas');
        if (!response.ok) {
            throw new Error(`Erro ao carregar vendas: ${response.statusText}`);
        }
        const data = await response.json();

        const vendasFiltradas = data.filter(venda => 
            venda.comprador.toLowerCase().includes(nomeFiltro)
        );

        if (vendasFiltradas.length === 0) {
            const linhaVazia = document.createElement("tr");
            const colunaVazia = document.createElement("td");
            colunaVazia.colSpan = 6;
            colunaVazia.textContent = "Nenhuma venda encontrada com esse nome.";
            linhaVazia.appendChild(colunaVazia);
            corpoTabela.appendChild(linhaVazia);
        } else {
            vendasFiltradas.forEach(venda => {
                adicionaVendaTabela2(venda);
            });
        }
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
}

async function removerVenda(venda, idLinhaARemover) {
    const confirmacao = confirm("Tem certeza que deseja excluir esta venda?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`http://localhost:3000/vendas/${venda.id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        alert("Venda excluída com sucesso!");
        document.getElementById(idLinhaARemover)?.remove();
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
    }
}

async function editarVenda(venda) {
    try {
        const formulario = document.getElementById("formEditar");
        const campoIdProduto = document.getElementById("idProduto");
        campoIdProduto.setAttribute("value", produto.id);
        formulario.submit();
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}



function adicionaVendaTabela2(venda) {
    const corpoTabela = document.getElementById("tabelaVendasLista").querySelector("tbody");
    const linha = document.createElement("tr");
    linha.id = "linhaTabelaVenda" + venda.id;


    const colunaComprador = document.createElement("td");
    colunaComprador.textContent = venda.nome; 

    const colunaModelo = document.createElement("td");
    colunaModelo.textContent = venda.modelo;

    const colunaValor = document.createElement("td");
    colunaValor.textContent = venda.valorVenda; 

    const colunaData = document.createElement("td");
    colunaData.textContent = venda.dataVenda; 


    const colunaRemover = document.createElement("td");
    const linkRemover = document.createElement("a");
    linkRemover.addEventListener('click', () => removerVenda(venda, linha.id));
    linkRemover.textContent = "Remover";
    linkRemover.href = "#";
    colunaRemover.appendChild(linkRemover);


    const colunaEditar = document.createElement("td");
    const linkEditar = document.createElement("a");
    linkEditar.addEventListener('click', () => editarVenda(venda));
    linkEditar.textContent = "Editar";
    linkEditar.href = "#";
    colunaEditar.appendChild(linkEditar);


    linha.appendChild(colunaComprador);
    linha.appendChild(colunaModelo);
    linha.appendChild(colunaValor);
    linha.appendChild(colunaData);
    linha.appendChild(colunaRemover);
    linha.appendChild(colunaEditar);

    corpoTabela.appendChild(linha);
}
