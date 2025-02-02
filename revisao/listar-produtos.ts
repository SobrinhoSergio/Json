document.addEventListener('DOMContentLoaded', async (ev)=>{ 
    await listarProdutos();
});
async function listarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((produto: any) => {
            console.log(produto);
            adicionaProdutoTabela2(produto);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function removerProduto(produto:any, idLinhaARemover:string) {
    try {
        const response = await fetch('http://localhost:3000/produtos/'+produto.id, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        alert("Produto excluído com sucesso!");
        document.getElementById(idLinhaARemover)?.remove();
        //limparTabelaProdutod(document.getElementById("tabelaProdutosLista") as HTMLTableElement);
        //listarProdutos();
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
}
function limparTabelaProdutod(tabela: HTMLTableElement){
    tabela.querySelectorAll("tbody").forEach((corpoTabela) => {
        corpoTabela.innerHTML = "";
    });
}
async function adicionaProdutoTabela2(produto: any) {
    document.getElementById("tabelaProdutosLista")?.querySelectorAll("tbody").forEach((corpoTabela) => {
        var linha = document.createElement("tr");
        linha.id = "linhaTabelaProduto"+produto.id;
        var colunaNome = document.createElement("td");
        colunaNome.textContent = produto.nome;
        var colunaPreco = document.createElement("td");
        colunaPreco.textContent = produto.preco;
        var colunaFabricante = document.createElement("td");
        colunaFabricante.textContent = produto.fabricante;
        var colunaRemover = document.createElement("td");
        var link = document.createElement("a");
        link.addEventListener('click', (ev) => {removerProduto(produto, "linhaTabelaProduto"+produto.id);});
        link.textContent = "Remover";
        link.href = "#";
        colunaRemover.appendChild(link);
        linha.appendChild(colunaNome);
        linha.appendChild(colunaPreco);
        linha.appendChild(colunaFabricante);
        linha.appendChild(colunaRemover);
        corpoTabela.appendChild(linha);      
    });   
}