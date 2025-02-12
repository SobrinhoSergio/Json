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

// Função para cadastrar ou editar uma informação
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const nascimento = document.getElementById("nascimento").value;
  const sexo = document.getElementById("sexo").value;
  const endereco = document.getElementById("endereco").value;

  if (!nome) {
    alert("Selecione um nome!");
    return;
  }

  const data = { nome, cpf, nascimento, sexo, endereco };

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

  form.reset();
});

// Inicializa o select de nomes e carrega as informações
fetchNomes();
fetchInfoForEdit();
