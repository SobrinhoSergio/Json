document.addEventListener('DOMContentLoaded', async () => {
    const campoMarca = document.getElementById("marca") as HTMLSelectElement;
    const campoModelo = document.getElementById("modelo") as HTMLSelectElement;
    const campoCor = document.getElementById("cor") as HTMLSelectElement;
    const campoValorVenda = document.getElementById("valorVenda") as HTMLInputElement;

    await carregaMarcas(campoMarca);

    campoMarca.addEventListener('change', () => {
        const marcaSelecionada = campoMarca.value;
        carregaModelos(campoModelo, marcaSelecionada);
    });

    campoModelo.addEventListener('change', () => {
        const modeloSelecionado = campoModelo.value;
        carregaCores(campoCor, modeloSelecionado, campoMarca.value);
    });

    const btnCadastrar = document.getElementById("btnCadastrar") as HTMLButtonElement | null;
    btnCadastrar?.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const form = document.getElementById("formCadastro") as HTMLFormElement;
        const campoId = document.getElementById("idProduto") as HTMLInputElement;

        const formData = new FormData(form);
        if (validaCampos(form)) {
            if (campoId.value !== "") {
                await cadastrarEditarVenda(formData, "editar");
            } else {
                await cadastrarEditarVenda(formData, "cadastrar");
            }
        }
    });
});

async function carregaMarcas(select: HTMLSelectElement): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/modelosCarros');
        if (!response.ok) {
            throw new Error(`Erro ao carregar veículos: ${response.statusText}`);
        }
        const data: { marca: string }[] = await response.json();
        data.forEach((veiculo) => {
            const option = document.createElement("option");
            option.value = veiculo.marca;
            option.textContent = veiculo.marca;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

async function carregaModelos(select: HTMLSelectElement, marcaSelecionada: string): Promise<void> {
    try {
        const response = await fetch(`http://localhost:3000/modelosCarros?marca=${marcaSelecionada}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar modelos: ${response.statusText}`);
        }
        const data: { modelo: string }[] = await response.json();
        select.innerHTML = ""; // Limpa as opções anteriores
        data.forEach((veiculo) => {
            const option = document.createElement("option");
            option.value = veiculo.modelo;
            option.textContent = veiculo.modelo;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
    }
}

async function carregaCores(select: HTMLSelectElement, modeloSelecionado: string, marcaSelecionada: string): Promise<void> {
    try {
        const response = await fetch(`http://localhost:3000/modelosCarros?modelo=${modeloSelecionado}&marca=${marcaSelecionada}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar cores: ${response.statusText}`);
        }
        const data: { cores_disponiveis: string[] }[] = await response.json();
        select.innerHTML = ""; // Limpa as opções anteriores
        data.forEach((veiculo) => {
            veiculo.cores_disponiveis.forEach((cor) => {
                const option = document.createElement("option");
                option.value = cor;
                option.textContent = cor;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Erro ao carregar cores:', error);
    }
}

function validaCampos(formElement: HTMLFormElement): boolean {
    const campos = ["nome", "marca", "modelo", "cor"];
    let valido = true;
    let informacoes = "";

    const formData = new FormData(formElement);

    campos.forEach((campo) => {
        if (!formData.has(campo) || (formData.get(campo)?.toString().trim() === "")) {
            valido = false;
            informacoes += `Campo ${campo} não foi preenchido\n`;
        }
    });

    if (informacoes !== "") {
        alert(informacoes);
    }

    return valido;
}

async function cadastrarEditarVenda(venda: FormData, operacao: "cadastrar" | "editar"): Promise<void> {
    try {
        const vendaObj: Record<string, any> = Object.fromEntries(venda.entries());

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

function gerarIdVenda(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

async function recuperaDadosVenda(idVenda: string): Promise<void> {
    try {
        const response = await fetch(`http://localhost:3000/vendas/${idVenda}`);
        if (!response.ok) {
            throw new Error(`Erro ao recuperar venda: ${response.statusText}`);
        }
        const dadosVenda: Record<string, any> = await response.json();
        carregaDadosEditarNoFormulario(dadosVenda);
    } catch (error) {
        console.error('Erro ao recuperar venda:', error);
    }
}

function carregaDadosEditarNoFormulario(venda: Record<string, any>): void {
    const form = document.getElementById("formCadastro") as HTMLFormElement;

    form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select").forEach((campo) => {
        if (venda[campo.name]) {
            campo.value = venda[campo.name];
        }
    });
}

function salvarVendaNoLocalStorage(venda: Record<string, any>): void {
    const vendas: Record<string, any>[] = JSON.parse(localStorage.getItem("vendasTeste") || "[]");
    vendas.push(venda);
    localStorage.setItem("vendasTeste", JSON.stringify(vendas));
}

function carregarVendasDoLocalStorage(): void {
    const vendas: Record<string, any>[] = JSON.parse(localStorage.getItem("vendasTeste") || "[]");
    vendas.forEach(venda => {
        console.log("Venda carregada do LocalStorage:", venda);
    });
}
