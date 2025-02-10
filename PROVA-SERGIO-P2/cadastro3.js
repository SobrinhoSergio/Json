document.addEventListener('DOMContentLoaded', async () => {
    const campoMarca = document.getElementById("marca");
    const campoModelo = document.getElementById("modelo");
    const campoCor = document.getElementById("cor");
    const campoValorVenda = document.getElementById("valorVenda");
    await carregaMarcas(campoMarca);

    campoMarca.addEventListener('change', () => {
        let marcaSelecionada = campoMarca.value;
        carregaModelos(campoModelo, marcaSelecionada);
    });

    campoModelo.addEventListener('change', () => {
        let modeloSelecionado = campoModelo.value;
        carregaCores(campoCor, modeloSelecionado, campoMarca.value);
    });

    document.getElementById("btnCadastrar")?.addEventListener('click', async (ev) => {
        var form = new FormData(document.getElementById("formCadastro"));
        const campoId = document.getElementById("idProduto");
        if (validaCampos(form)) {
            if (campoId.value !== "") {
                cadastrarEditarVenda(form, "editar");
            } else {
                cadastrarEditarVenda(form, "cadastrar");
            }
        }
        ev.preventDefault();
    });
});

async function carregaMarcas(select) {
    try {
        const response = await fetch('http://localhost:3000/modelosCarros');
        if (!response.ok) {
            throw new Error(`Erro ao carregar veiculos: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((veiculo) => {
            var option = document.createElement("option");
            option.value = veiculo.marca;
            option.textContent = veiculo.marca;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar veiculos:', error);
    }
}

async function carregaModelos(select, marcaSelecionada) {
    try {
        const response = await fetch('http://localhost:3000/modelosCarros?marca=' + marcaSelecionada);
        if (!response.ok) {
            throw new Error(`Erro ao carregar veiculos: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((veiculo) => {
            var option = document.createElement("option");
            option.value = veiculo.modelo;
            option.textContent = veiculo.modelo;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar veiculos:', error);
    }
}

async function carregaCores(select, modeloSelecionado, marcaSelecionada) {
    try {
        const response = await fetch(`http://localhost:3000/modelosCarros?modelo=${modeloSelecionado}&marca=${marcaSelecionada}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar veiculos: ${response.statusText}`);
        }
        const data = await response.json();
        data.forEach((veiculo) => {
            veiculo.cores_disponiveis.forEach((cor) => {
                var option = document.createElement("option");
                option.value = cor;
                option.textContent = cor;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Erro ao carregar veiculos:', error);
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