const nomesUrl = "http://localhost:3000/NOMES";
const infoUrl = "http://localhost:3000/INFO";
const form = document.getElementById("cadastroForm");
const nomeSelect = document.getElementById("nome");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Função para carregar os nomes no select
async function fetchNomes() {
  const response = await fetch(nomesUrl);
  const data = await response.json();
  renderNomes(data);
}

// Renderiza os nomes no <select>
function renderNomes(data) {
  nomeSelect.innerHTML = `<option value="">Selecione um nome</option>`;
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.nome;
    option.textContent = item.nome;
    nomeSelect.appendChild(option);
  });
}

// Função para carregar as informações no formulário para edição
async function fetchInfoForEdit() {
  if (id) {
    const response = await fetch(`${infoUrl}/${id}`);
    const data = await response.json();

    document.getElementById("nome").value = data.nome;
    document.getElementById("cpf").value = data.cpf;
    document.getElementById("nascimento").value = data.nascimento;
    document.getElementById("sexo").value = data.sexo;
    document.getElementById("endereco").value = data.endereco;
  }
}

function validaCampos(formElement) {
    let campos = ["nome", "cpf", "nascimento", "sexo", "endereco"];
    let valido = true;
    let informacoes = "";

    let formData = new FormData(formElement);

    // Validação básica dos campos
    campos.forEach((campo) => {
        if (!formData.has(campo) || formData.get(campo)?.toString().trim() === "") {
            valido = false;
            informacoes += `Campo ${campo} não foi preenchido\n`;
        }
    });

    // Validação do CPF
    const cpf = formData.get("cpf")?.toString().trim();
    if (cpf && !validarCPF(cpf)) {
        valido = false;
        informacoes += "CPF inválido\n";
    }

    // Validação da data de nascimento
    const nascimento = formData.get("nascimento")?.toString().trim();
    if (nascimento && !validarNascimento(nascimento)) {
        valido = false;
        informacoes += "Data de nascimento inválida. Deve ser entre 1988 e a data atual\n";
    }

    if (informacoes !== "") {
        alert(informacoes);
    }

    return valido;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Tamanho ou padrão inválido
    return true; // Aqui é apenas uma validação básica
}

// Função para validar data de nascimento
function validarNascimento(nascimento) {
    const dataAtual = new Date();
    const dataMinima = new Date("1988-01-01");
    const dataNascimento = new Date(nascimento);

    return dataNascimento >= dataMinima && dataNascimento <= dataAtual;
}

function salvarLocalStorage(data) {
    let pessoas = JSON.parse(localStorage.getItem("pessoaTeste")) || [];
    pessoas.push(data);
    localStorage.setItem("pessoaTeste", JSON.stringify(pessoas));
}

function carregarVendasDoLocalStorage() {
    let pessoas = JSON.parse(localStorage.getItem("pessoaTeste")) || [];
    pessoas.forEach(pessoa => {
        console.log("Venda carregada do LocalStorage:", pessoa);
    });
}

// Função para cadastrar ou editar uma informação
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validaCampos(form)) {
        return; // Para a execução se a validação falhar
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (id) {
        // Editar registro existente
        await fetch(`${infoUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } else {
        // Criar novo registro
        await fetch(infoUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }

    // Salvar no localStorage após a edição ou criação
    salvarLocalStorage(data);

    form.reset();
});


// Inicializa o select de nomes e carrega as informações
fetchNomes();
fetchInfoForEdit();
