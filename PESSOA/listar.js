const nomesUrl = "http://localhost:3000/NOMES";
const infoUrl = "http://localhost:3000/INFO";
const filtroNome = document.getElementById("filtroNome");
const filtroCpf = document.getElementById("filtroCpf");
const filtrarBtn = document.getElementById("filtrarBtn");
const tabelaBody = document.getElementById("tabelaBody");

// Função para carregar os nomes no filtro
async function fetchNomes() {
  const response = await fetch(nomesUrl);
  const data = await response.json();
  renderNomesFiltro(data);
}

// Renderiza os nomes no select de filtro
function renderNomesFiltro(data) {
  filtroNome.innerHTML = `<option value="">Todos os nomes</option>`;
  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.nome;
    option.textContent = item.nome;
    filtroNome.appendChild(option);
  });
}

// Função para listar informações com base no filtro
async function fetchInfo() {
  const nomeFiltro = filtroNome.value;
  const cpfFiltro = filtroCpf.value;

  const response = await fetch(infoUrl);
  const data = await response.json();

  // Filtragem por nome e CPF
  const filtrado = data.filter((item) => {
    const nomeMatch = nomeFiltro ? item.nome === nomeFiltro : true;
    const cpfMatch = cpfFiltro ? item.cpf.includes(cpfFiltro) : true;
    return nomeMatch && cpfMatch;
  });

  renderTabela(filtrado);
}

// Renderiza as informações na tabela
function renderTabela(data) {
  tabelaBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.cpf}</td>
      <td>${item.nascimento}</td>
      <td>${item.sexo}</td>
      <td>${item.endereco}</td>
      <td>
        <button class="editarBtn" data-id="${item.id}">Editar</button>
        <button class="excluirBtn" data-id="${item.id}">Excluir</button>
      </td>
    `;

    tabelaBody.appendChild(row);
  });

  // Adiciona eventos aos botões
  document.querySelectorAll(".editarBtn").forEach((btn) =>
    btn.addEventListener("click", editarItem)
  );

  document.querySelectorAll(".excluirBtn").forEach((btn) =>
    btn.addEventListener("click", excluirItem)
  );
}

// Função para excluir um item
async function excluirItem(event) {
  const id = event.target.dataset.id;

  if (confirm("Tem certeza que deseja excluir este registro?")) {
    await fetch(`${infoUrl}/${id}`, {
      method: "DELETE",
    });

    fetchInfo(); // Atualiza a tabela após exclusão
  }
}


// Função para editar um item - redireciona ao cadastro.html com o ID na URL
function editarItem(event) {
    const id = event.target.dataset.id;
    window.location.href = `cadastro.html?id=${id}`;
  }
  

// Event listener para o botão de filtrar
filtrarBtn.addEventListener("click", fetchInfo);

// Inicializa o filtro e a tabela ao carregar a página
fetchNomes();
fetchInfo();
