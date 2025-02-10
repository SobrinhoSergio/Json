document.addEventListener('DOMContentLoaded', (ev) => {
    if (window.location.search.includes("idVenda=")) {
        const idVenda = new URLSearchParams(window.location.search).get("idVenda");
        if (idVenda) recuperaDadosVenda(idVenda);
    }

    document.getElementById("marca")?.addEventListener('change', async (ev) => {
        const marca = ev.target.value;
        await atualizarModelosEcores(marca);
    });

    document.getElementById("btnCadastrar")?.addEventListener('click', async (ev) => {
        ev.preventDefault();

        var form = new FormData(document.getElementById("formCadastro"));
        const campoId = document.getElementById("idVenda");

        if (validaCampos(form)) {
            if (campoId?.value) {
                cadastrarEditarVenda(form, "editar");
            } else {
                cadastrarEditarVenda(form, "cadastrar");
            }
        }
    });

    carregarVendasDoLocalStorage();
});

async function atualizarModelosEcores(marca) {
    const modelos = {
        Toyota: [{ modelo: "Corolla", preco: 120000, cores: ["Branco", "Preto", "Prata"] }],
        Honda: [{ modelo: "Civic", preco: 110000, cores: ["Azul", "Preto", "Prata"] }],
        Ford: [{ modelo: "Fusion", preco: 130000, cores: ["Vermelho", "Preto", "Cinza"] }]
    };

    const modeloSelect = document.getElementById("modelo");
    const corSelect = document.getElementById("cor");
    const precoInput = document.getElementById("preco");

    modeloSelect.innerHTML = "<option value=''>Selecione um modelo</option>";
    corSelect.innerHTML = "<option value=''>Selecione uma cor</option>";
    precoInput.value = "";

    if (modelos[marca]) {
        modelos[marca].forEach(opcao => {
            const option = document.createElement("option");
            option.value = opcao.modelo;
            option.textContent = opcao.modelo;
            modeloSelect.appendChild(option);
        });

        modeloSelect.addEventListener('change', (ev) => {
            const modeloSelecionado = ev.target.value;
            const modeloInfo = modelos[marca].find(item => item.modelo === modeloSelecionado);

            if (modeloInfo) {
                corSelect.innerHTML = "<option value=''>Selecione uma cor</option>";
                modeloInfo.cores.forEach(cor => {
                    const option = document.createElement("option");
                    option.value = cor;
                    option.textContent = cor;
                    corSelect.appendChild(option);
                });

                precoInput.value = modeloInfo.preco;
            }
        });
    }
}


function handleModeloChange(event, modelosDaMarca) {
    const modeloSelecionado = event.target.value;
    const modeloInfo = modelosDaMarca.find(item => item.modelo === modeloSelecionado);
    
    const corSelect = document.getElementById("cor");
    const precoInput = document.getElementById("preco");

    if (modeloInfo) {
        corSelect.innerHTML = "<option value=''>Selecione uma cor</option>";
        modeloInfo.cores.forEach(cor => {
            const option = document.createElement("option");
            option.value = cor;
            option.textContent = cor;
            corSelect.appendChild(option);
        });

        precoInput.value = modeloInfo.preco;
    }
}




function validaCampos(form) {
    let campos = ["nome", "marca", "modelo", "cor"];
    let valido = true;
    let informacoes = "";
    
    campos.forEach((campo) => {
        if (!form.has(campo) || form.get(campo)?.toString().trim() === "") {
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

        
        vendaObj.valorVenda = `R$ ${parseFloat(vendaObj.preco).toFixed(2).replace('.', ',')}`;
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
