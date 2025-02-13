document.addEventListener('DOMContentLoaded', async () => {
    const campoNome = document.getElementById("nome") as HTMLInputElement;
    const campoModelo = document.getElementById("modelo") as HTMLSelectElement;
    const tabela = document.getElementById("tabelaVendas") as HTMLTableElement;

    await carregarModelos();

    document.getElementById("btnFiltrar")?.addEventListener('click', async (ev: Event) => {
        ev.preventDefault();
        limparTabela(tabela);
        await carregaDadosTabela(campoNome.value, campoModelo.value);
    });
});

async function carregarModelos(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/vendas');
        if (!response.ok) {
            throw new Error(`Erro ao carregar modelos: ${response.statusText}`);
        }
        const data: { modelo: string }[] = await response.json();
        const modelosUnicos = [...new Set(data.map(venda => venda.modelo))];

        const selectModelo = document.getElementById("modelo") as HTMLSelectElement;
        modelosUnicos.forEach(modelo => {
            const option = document.createElement("option");
            option.value = modelo;
            option.textContent = modelo;
            selectModelo.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
    }
}

async function carregaDadosTabela(produtoParam: string, modeloParam: string): Promise<void> {
    try {
        let url = 'http://localhost:3000/vendas?';
        if (produtoParam) url += `nome_like=${produtoParam}&`;
        if (modeloParam) url += `modelo_like=${modeloParam}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.statusText}`);
        }
        const data: Venda[] = await response.json();
        data.forEach((venda) => {
            adicionaVenda(venda);
        });
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

async function adicionaVenda(venda: Venda): Promise<void> {
    const tabela = document.getElementById("tabelaVendas") as HTMLTableElement;
    tabela.querySelectorAll("tbody").forEach((corpoTabela) => {
        const linha = document.createElement("tr");

        const colunaVendedor = document.createElement("td");
        colunaVendedor.textContent = venda.nome;

        const colunaQuantidade = document.createElement("td");
        colunaQuantidade.textContent = venda.modelo;

        const colunaSubTotal = document.createElement("td");
        colunaSubTotal.textContent = venda.valorVenda.toString();

        const colunaDataVenda = document.createElement("td");
        const dataFormatada = new Date(venda.dataVenda).toLocaleDateString("pt-BR");
        colunaDataVenda.textContent = dataFormatada;

        const colunaEditar = document.createElement("td");
        const linkEd = document.createElement("a");
        linkEd.addEventListener('click', () => editarProduto(venda));
        linkEd.textContent = "Editar";
        linkEd.href = "#";
        colunaEditar.appendChild(linkEd);

        const colunaRemover = document.createElement("td");
        const link = document.createElement("a");
        link.addEventListener('click', () => {
            removerProduto(venda, "linhaTabelaProduto" + venda.id);
            linha.remove();
        });
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

function limparTabela(tabela: HTMLTableElement): void {
    tabela.querySelectorAll("tbody").forEach((corpoTabela) => {
        corpoTabela.innerHTML = "";
    });
}

async function removerProduto(produto: Venda, idLinhaARemover: string): Promise<void> {
    try {
        let vendas: Venda[] = JSON.parse(localStorage.getItem("vendasTeste") || "[]");
        vendas = vendas.filter(v => v.id !== produto.id);
        localStorage.setItem("vendasTeste", JSON.stringify(vendas));

        const response = await fetch(`http://localhost:3000/vendas/${produto.id}`, {
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

async function editarProduto(produto: Venda): Promise<void> {
    try {
        const formulario = document.getElementById("formEditar") as HTMLFormElement;
        const campoIdProduto = document.getElementById("idProduto") as HTMLInputElement;
        campoIdProduto.setAttribute("value", produto.id.toString());
        formulario.submit();
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
    }
}

interface Venda {
    id: number;
    nome: string;
    modelo: string;
    valorVenda: number;
    dataVenda: string;
}
