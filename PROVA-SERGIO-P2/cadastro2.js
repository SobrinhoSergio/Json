document.addEventListener('DOMContentLoaded', async () => {

    if (window.location.search.includes("idProduto=")) {
        const idProduto = new URLSearchParams(window.location.search).get("idProduto");
        if (idProduto) recuperaDadosVenda(idProduto);
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

        let opcoesAdicionadas = new Set(); // Para evitar valores repetidos

        if (tipo === 'marca' || tipo === 'modelo') {
            data.forEach(item => {
                if (!opcoesAdicionadas.has(item[tipo])) { // Evita adicionar repetidos
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
                console.log(item.valor);
                campoValor.value = item.valor || '';
            });
        }
    } catch (error) {
        console.error(`Erro ao carregar ${tipo}:`, error);
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
        vendaObj.id = vendaObj.id || gerarIdVenda(); 

        if (operacao === "cadastrar") {
            salvarVendaNoLocalStorage(vendaObj);
        }

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
    } catch (error) {
        console.error(`Erro ao ${operacao} venda:`, error);
    }
}


function gerarIdVenda() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

async function recuperaDadosVenda(idVenda) {
    try {
        const response = await fetch(`http://localhost:3000/vendas/${idVenda}`);
        if (!response.ok) {
            throw new Error(`Erro ao recuperar venda: ${response.statusText}`);
        }
        const dadosVenda = await response.json();
        carregaDadosEditarNoFormulario(dadosVenda);
    } catch (error) {
        console.error('Erro ao recuperar venda:', error);
    }
}

function carregaDadosEditarNoFormulario(venda) {
    var form = document.getElementById("formCadastro");
    
    form.querySelectorAll("input, select").forEach((campo) => {
        if (venda[campo.name]) {
            campo.value = venda[campo.name];
        }
    });
}



function salvarVendaNoLocalStorage(venda) {
    let vendas = JSON.parse(localStorage.getItem("vendasTeste")) || [];
    vendas.push(venda);
    localStorage.setItem("vendasTeste", JSON.stringify(vendas));
}

function carregarVendasDoLocalStorage() {
    let vendas = JSON.parse(localStorage.getItem("vendasTeste")) || [];
    vendas.forEach(venda => {
        console.log("Venda carregada do LocalStorage:", venda);
    });
}
