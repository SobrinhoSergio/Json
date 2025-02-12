document.addEventListener('DOMContentLoaded', async (ev)=>{ 
    document.getElementById("btnFiltrar")?.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        const nome = (document.getElementById("nome") as HTMLInputElement).value;
        await listarVendas(nome);
    });
});
async function listarVendas(nome: string) {
    try {
        const response = await fetch(`http://localhost:3000/vendas?nome_like=${nome}`);
        limparTabelaVendad(document.getElementById("tabelaVendasLista") as HTMLTableElement);
        if (!response.ok) {
            throw new Error(`Erro ao carregar vendas: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((venda: any) => {
            console.log(venda);
            adicionaVendaTabela2(venda);
        });
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function removerVenda(venda:any, idLinhaARemover:string) {
    try {
        const response = await fetch('http://localhost:3000/vendas/'+venda.id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        alert("Venda excluído com sucesso!");
        document.getElementById(idLinhaARemover)?.remove();
        //limparTabelaVendad(document.getElementById("tabelaVendasLista") as HTMLTableElement);
        //const nome = (document.getElementById("nome") as HTMLInputElement).value;
        //listarVendas(nome);
    } catch (error) {
        console.error('Erro ao excluir venda:', error);
    }
}

async function editarVenda(venda:any) {
    try {
        const formulario = document.getElementById("formEditar") as HTMLFormElement;
        const campoIdVenda = document.getElementById("idVenda") as HTMLInputElement;
        campoIdVenda.setAttribute("value", venda.id);
        formulario.submit();
        //limparTabelaVendad(document.getElementById("tabelaVendasLista") as HTMLTableElement);
        //listarVendas();
    } catch (error) {
        console.error('Erro ao buscar venda:', error);
    }
}


function limparTabelaVendad(tabela: HTMLTableElement){
    tabela.querySelectorAll("tbody").forEach((corpoTabela) => {
        corpoTabela.innerHTML = "";
    });
}
async function adicionaVendaTabela2(venda: any) {
    document.getElementById("tabelaVendasLista")?.querySelectorAll("tbody").forEach((corpoTabela) => {
        var linha = document.createElement("tr");
        linha.id = "linhaTabelaVenda"+venda.id;
        var colunaNome = document.createElement("td");
        colunaNome.textContent = venda.nome;
        var colunaModelo = document.createElement("td");
        colunaModelo.textContent = venda.modelo;
        var colunaValor = document.createElement("td");
        colunaValor.textContent = venda.valorVenda;
        var colunaDataVenda = document.createElement("td");
        colunaDataVenda.textContent = new Date(venda.dataVenda).toLocaleDateString("pt-BR");
        var colunaRemover = document.createElement("td");
        var link = document.createElement("a");
        link.addEventListener('click', (ev) => {removerVenda(venda, "linhaTabelaVenda"+venda.id);});
        link.textContent = "Remover";
        link.href = "#";
        colunaRemover.appendChild(link);

        var colunaEditar = document.createElement("td");
        var linkEd = document.createElement("a");
        linkEd.addEventListener('click', (ev) => {editarVenda(venda);});
        linkEd.textContent = "Editar";
        linkEd.href = "#";
        colunaEditar.appendChild(linkEd);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaModelo);
        linha.appendChild(colunaValor);
        linha.appendChild(colunaDataVenda);
        linha.appendChild(colunaRemover);
        linha.appendChild(colunaEditar);
        corpoTabela.appendChild(linha);      
    });   
}