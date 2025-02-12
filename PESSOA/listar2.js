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
  // Remover as opções antigas antes de adicionar novas
  filtroNome.innerHTML = "";
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "Todos os nomes";
  filtroNome.appendChild(optionDefault);

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
  calcularIdades(filtrado);
}

// Renderiza as informações na tabela
function renderTabela(data) {
  tabelaBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    // Criação de células (td) para cada coluna
    const nomeCell = document.createElement("td");
    nomeCell.textContent = item.nome;

    const cpfCell = document.createElement("td");
    cpfCell.textContent = item.cpf;

    const nascimentoCell = document.createElement("td");
    nascimentoCell.textContent = formatarData(item.nascimento);

    const sexoCell = document.createElement("td");
    sexoCell.textContent = item.sexo;

    const enderecoCell = document.createElement("td");
    enderecoCell.textContent = item.endereco;

    const acoesCell = document.createElement("td");

    // Botão de editar
    const editarBtn = document.createElement("button");
    editarBtn.classList.add("editarBtn");
    editarBtn.textContent = "Editar";
    editarBtn.dataset.id = item.id;
    editarBtn.addEventListener("click", editarItem);

    // Botão de excluir
    const excluirBtn = document.createElement("button");
    excluirBtn.classList.add("excluirBtn");
    excluirBtn.textContent = "Excluir";
    excluirBtn.dataset.id = item.id;
    excluirBtn.addEventListener("click", excluirItem);

    // Adiciona os botões à célula de ações
    acoesCell.appendChild(editarBtn);
    acoesCell.appendChild(excluirBtn);

    // Adicionando as células à linha
    row.appendChild(nomeCell);
    row.appendChild(cpfCell);
    row.appendChild(nascimentoCell);
    row.appendChild(sexoCell);
    row.appendChild(enderecoCell);
    row.appendChild(acoesCell);

    // Adicionando a linha ao corpo da tabela
    tabelaBody.appendChild(row);
  });
}



// Função para formatar a data no padrão brasileiro (dd/mm/yyyy)
function formatarData(data) {
  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Função para calcular e exibir idades no tfoot
function calcularIdades(data) {
    const idades = data.map(item => calcularIdade(item.nascimento));
  
    if (idades.length > 0) {
      const maiorIdade = Math.max(...idades);
      const menorIdade = Math.min(...idades);
      const mediaIdade = idades.reduce((a, b) => a + b, 0) / idades.length;
  
      // Criação de uma linha para o tfoot
      const row = document.createElement("tr");
  
      // Criação da célula para Maior Idade
      const cell1 = document.createElement("td");
      cell1.setAttribute("colspan", "2");
      cell1.textContent = `Maior Idade: ${maiorIdade} anos`;
      row.appendChild(cell1);
  
      // Criação da célula para Menor Idade
      const cell2 = document.createElement("td");
      cell2.setAttribute("colspan", "2");
      cell2.textContent = `Menor Idade: ${menorIdade} anos`;
      row.appendChild(cell2);
  
      // Criação da célula para Média de Idade
      const cell3 = document.createElement("td");
      cell3.setAttribute("colspan", "2");
      cell3.textContent = `Média de Idade: ${mediaIdade.toFixed(2)} anos`;
      row.appendChild(cell3);
  
      // Criação da célula para Total de Registros
      /*const cell4 = document.createElement("td");
      cell4.setAttribute("colspan", "3");
      cell4.textContent = `Total de Registros: ${data.length}`;
      row.appendChild(cell4);*/
  
      
      tabelaFooter.innerHTML = ""; 
      tabelaFooter.appendChild(row);
    }
  }
  
// Função para calcular a idade a partir da data de nascimento
function calcularIdade(nascimento) {
    const nascimentoDate = new Date(nascimento);
    const idade = new Date().getFullYear() - nascimentoDate.getFullYear();
    const mes = new Date().getMonth() - nascimentoDate.getMonth();
    if (mes < 0 || (mes === 0 && new Date().getDate() < nascimentoDate.getDate())) {
      return idade - 1;
    }
    return idade;
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
