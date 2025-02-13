document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.search.includes("idProduto=")) {
        const idProduto = new URLSearchParams(window.location.search).get("idProduto");
        if (idProduto) await recuperaDadosVenda(idProduto);
    }

    const campoMarca = document.getElementById("marca");
    const campoModelo = document.getElementById("modelo");
    const campoCor = document.getElementById("cor");
    const campoValorVenda = document.getElementById("valorVenda");
    const btnCadastrar = document.getElementById("btnCadastrar");
    const formCadastro = document.getElementById("formCadastro");

    await carregarOpcoes('marca', campoMarca);

    campoMarca.addEventListener('change', async () => {
        await carregarOpcoes('modelo', campoModelo, { marca: campoMarca.value });
    });

    campoModelo.addEventListener('change', async () => {
        await carregarOpcoes('cor', campoCor, { modelo: campoModelo.value, marca: campoMarca.value }, campoValorVenda);
    });

    btnCadastrar?.addEventListener('click', async (ev) => {
        ev.preventDefault();
        if (!validaCampos(formCadastro)) return;
        const campoId = document.getElementById("idVenda");
        await cadastrarEditarVenda(new FormData(formCadastro), campoId?.value ? "editar" : "cadastrar");
    });

    carregarVendasDoLocalStorage();
});

async function carregarOpcoes(tipo, select, filtros = {}, campoValor = null) {
    try {
        let url = new URL('http://localhost:3000/modelosCarros');
        Object.keys(filtros).forEach(key => url.searchParams.append(key, filtros[key]));

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao carregar ${tipo}: ${response.statusText}`);

        const data = await response.json();

        select.innerHTML = '';
        let optionInicial = new Option(`Selecione um ${tipo}`, "");
        select.add(optionInicial);

        let opcoesAdicionadas = new Set();

        if (tipo === 'marca' || tipo === 'modelo') {
            data.forEach(item => {
                if (!opcoesAdicionadas.has(item[tipo])) {
                    let option = new Option(item[tipo], item[tipo]);
                    select.add(option);
                    opcoesAdicionadas.add(item[tipo]);
                }
            });
        } else if (tipo === 'cor' && campoValor) {
            data.forEach(item => {
                item.cores_disponiveis.forEach(cor => {
                    if (!opcoesAdicionadas.has(cor)) {
                        let option = new Option(cor, cor);
                        select.add(option);
                        opcoesAdicionadas.add(cor);
                    }
                });
                campoValor.value = item.valor || '';
            });
        }
    } catch (error) {
        console.error(`Erro ao carregar ${tipo}:`, error);
    }
}

async function recuperaDadosVenda(idProduto) {
    try {
        const response = await fetch(`http://localhost:3000/vendas/${idProduto}`);
        if (!response.ok) throw new Error('Erro ao buscar dados da venda.');

        const venda = await response.json();

        // Preencher os campos do formulário com os dados da venda
        document.getElementById("idVenda").value = venda.id;
        document.getElementById("nome").value = venda.nome || '';
        document.getElementById("marca").value = venda.marca || '';
        document.getElementById("modelo").value = venda.modelo || '';
        document.getElementById("cor").value = venda.cor || '';
        document.getElementById("valorVenda").value = venda.valorVenda || '';
    } catch (error) {
        console.error('Erro ao recuperar dados da venda:', error);
    }
}

function validaCampos(formElement) {
    let campos = ["nome", "marca", "modelo", "cor"];
    let valido = true;
    let informacoes = "";

    let formData = new FormData(formElement);

    campos.forEach((campo) => {
        if (!formData.has(campo) || formData.get(campo)?.toString().trim() === "") {
            valido = false;
            informacoes += `Campo ${campo} não foi preenchido\n`;
        }
    });

    if (informacoes !== "") {
        alert(informacoes);
    }

    return valido;
}

async function cadastrarEditarVenda(venda, operacao) {
    try {
        const vendaObj = Object.fromEntries(venda);

        if (vendaObj.valorVenda) {
            vendaObj.valorVenda = `R$ ${parseFloat(vendaObj.valorVenda).toFixed(2).replace('.', ',')}`;
        } else {
            vendaObj.valorVenda = "R$ 0,00";
        }

        vendaObj.dataVenda = new Date().toISOString();

        const url = `http://localhost:3000/vendas${operacao === "editar" ? '/' + vendaObj.id : ''}`;
        const method = operacao === "editar" ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendaObj),
        });

        if (!response.ok) {
            throw new Error(`Erro ao ${operacao} venda: ${response.statusText}`);
        }

        alert(`Venda ${operacao === "editar" ? "editada" : "cadastrada"} com sucesso!`);
        window.location.reload();
    } catch (error) {
        console.error(`Erro ao ${operacao} venda:`, error);
    }
}

function carregarVendasDoLocalStorage() {
    const vendas = JSON.parse(localStorage.getItem("vendasTeste")) || [];
    vendas.forEach((venda) => {
        adicionaVendaNaTabela(venda);
    });
}

function adicionaVendaNaTabela(venda) {
    const tabela = document.getElementById("tabelaVendas").querySelector("tbody");
    const linha = document.createElement("tr");

    linha.innerHTML = `
        <td>${venda.nome}</td>
        <td>${venda.marca}</td>
        <td>${venda.modelo}</td>
        <td>${venda.cor}</td>
        <td>${venda.valorVenda}</td>
        <td>
            <a href="?idProduto=${venda.id}">Editar</a>
        </td>
        <td>
            <a href="#" onclick="removerProduto('${venda.id}', this)">Remover</a>
        </td>
    `;

    tabela.appendChild(linha);
}

async function removerProduto(idProduto, elemento) {
    try {
        const response = await fetch(`http://localhost:3000/vendas/${idProduto}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao remover produto.');

        alert('Produto removido com sucesso!');
        elemento.closest('tr').remove();
    } catch (error) {
        console.error('Erro ao remover produto:', error);
    }
}
