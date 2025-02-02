document.addEventListener('DOMContentLoaded', (ev)=>{
    let campoProduto = document.getElementById("produto") as HTMLSelectElement;
    carregaProdutosRelatorio(campoProduto);
    campoProduto?.addEventListener('change',(ev2)=>{
        const vlVendedor: string = campoProduto.value;
        limparTabela(document.getElementById("tabelaVendasProduto") as HTMLTableElement);
        carregaDadosTabela(vlVendedor);
        ev.preventDefault();
    });
});
async function carregaProdutosRelatorio(select: HTMLSelectElement) {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((produto: any) => {
            var option = document.createElement("option");
            option.value = JSON.stringify(produto);
            option.textContent = produto.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

let totalVenda = 0;
async function carregaDadosTabela(produtoParam:string) {
    try {
        const response = await fetch('http://localhost:3000/vendas');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data = await response.json();
        let totalVenda = 0;
        data.filter((venda: any)=>{
            return venda.produtos.filter((produto:any)=>{
                return produto.idProduto == JSON.parse(produtoParam).id;
            }).length > 0;
        }).forEach((venda: any) => {
            console.log(venda);
            adicionaProduto(venda, produtoParam);
            totalVenda++;
        });
        const totalCompraElement = document.getElementById("presentesEmVendas");
        if (totalCompraElement) {
            totalCompraElement.textContent = totalVenda.toString();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}


async function adicionaProduto(venda: any, produtoParam:string) {
    document.getElementById("tabelaVendasProduto")?.querySelectorAll("tbody").forEach((corpoTabela) => {
        var linha = document.createElement("tr");
        var produto = venda.produtos.filter((produto:any)=>{
            return produto.idProduto == JSON.parse(produtoParam).id;
        }).pop();
        var colunaVendedor = document.createElement("td");
        colunaVendedor.textContent = venda.vendedor;
        var colunaQuantidade = document.createElement("td");
        colunaQuantidade.textContent = produto.quantidade;
        var colunaSubTotal = document.createElement("td");
        colunaSubTotal.textContent = produto.subTotal;
        var colunaDataVenda = document.createElement("td");
        colunaDataVenda.textContent = venda.dataVenda;
        linha.appendChild(colunaVendedor);
        linha.appendChild(colunaQuantidade);
        linha.appendChild(colunaSubTotal);
        linha.appendChild(colunaDataVenda);
        corpoTabela.appendChild(linha);

      
    });   
}

function limparTabela(tabela: HTMLTableElement){
    tabela.querySelectorAll("tbody").forEach((corpoTabela) => {
        corpoTabela.innerHTML = "";
    });
}