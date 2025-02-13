const nomesUrl: string = "http://localhost:3000/NOMES";
const infoUrl: string = "http://localhost:3000/INFO";
const filtroNome = document.getElementById("filtroNome") as HTMLSelectElement;
const filtroCpf = document.getElementById("filtroCpf") as HTMLInputElement;
const filtrarBtn = document.getElementById("filtrarBtn") as HTMLButtonElement;
const tabelaBody = document.getElementById("tabelaBody") as HTMLTableSectionElement;
const tabelaFooter = document.getElementById("tabelaFooter") as HTMLTableSectionElement;

interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  nascimento: string;
  sexo: string;
  endereco: string;
}

// Função para carregar os nomes no filtro
async function fetchNomes(): Promise<void> {
  const response = await fetch(nomesUrl);
  const data: Pessoa[] = await response.json();
  renderNomesFiltro(data);
}

// Renderiza os nomes no select de filtro
function renderNomesFiltro(data: Pessoa[]): void {
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
async function fetchInfo(): Promise<void> {
  const nomeFiltro: string = filtroNome.value;
  const cpfFiltro: string = filtroCpf.value;

  const response = await fetch(infoUrl);
  const data: Pessoa[] = await response.json();

  const filtrado = data.filter((item) => {
    const nomeMatch = nomeFiltro ? item.nome === nomeFiltro : true;
    const cpfMatch = cpfFiltro ? item.cpf.includes(cpfFiltro) : true;
    return nomeMatch && cpfMatch;
  });

  renderTabela(filtrado);
  calcularIdades(filtrado);
}

// Renderiza as informações na tabela
function renderTabela(data: Pessoa[]): void {
  tabelaBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

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

    const editarBtn = document.createElement("button");
    editarBtn.classList.add("editarBtn");
    editarBtn.textContent = "Editar";
    editarBtn.dataset.id = item.id.toString();
    editarBtn.addEventListener("click", editarItem);

    const excluirBtn = document.createElement("button");
    excluirBtn.classList.add("excluirBtn");
    excluirBtn.textContent = "Excluir";
    excluirBtn.dataset.id = item.id.toString();
    excluirBtn.addEventListener("click", excluirItem);

    acoesCell.appendChild(editarBtn);
    acoesCell.appendChild(excluirBtn);

    row.appendChild(nomeCell);
    row.appendChild(cpfCell);
    row.appendChild(nascimentoCell);
    row.appendChild(sexoCell);
    row.appendChild(enderecoCell);
    row.appendChild(acoesCell);

    tabelaBody.appendChild(row);
  });
}

// Função para formatar a data no padrão brasileiro (dd/mm/yyyy)
function formatarData(data: string): string {
  const date = new Date(data);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Função para calcular e exibir idades no tfoot
function calcularIdades(data: Pessoa[]): void {
  const idades = data.map((item) => calcularIdade(item.nascimento));

  if (idades.length > 0) {
    const maiorIdade = Math.max(...idades);
    const menorIdade = Math.min(...idades);
    const mediaIdade = idades.reduce((a, b) => a + b, 0) / idades.length;

    const row = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.setAttribute("colspan", "2");
    cell1.textContent = `Maior Idade: ${maiorIdade} anos`;
    row.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.setAttribute("colspan", "2");
    cell2.textContent = `Menor Idade: ${menorIdade} anos`;
    row.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.setAttribute("colspan", "2");
    cell3.textContent = `Média de Idade: ${mediaIdade.toFixed(2)} anos`;
    row.appendChild(cell3);

    tabelaFooter.innerHTML = "";
    tabelaFooter.appendChild(row);
  }
}

// Função para calcular a idade a partir da data de nascimento
function calcularIdade(nascimento: string): number {
  const nascimentoDate = new Date(nascimento);
  const idade = new Date().getFullYear() - nascimentoDate.getFullYear();
  const mes = new Date().getMonth() - nascimentoDate.getMonth();
  if (mes < 0 || (mes === 0 && new Date().getDate() < nascimentoDate.getDate())) {
    return idade - 1;
  }
  return idade;
}

// Função para excluir um item
async function excluirItem(event: Event): Promise<void> {
  const id = (event.target as HTMLButtonElement).dataset.id;

  if (id && confirm("Tem certeza que deseja excluir este registro?")) {
    await fetch(`${infoUrl}/${id}`, {
      method: "DELETE",
    });

    const pessoas: Pessoa[] = JSON.parse(localStorage.getItem("pessoaTeste") || "[]");
    const atualizadas = pessoas.filter((p) => p.id !== parseInt(id));
    localStorage.setItem("pessoaTeste", JSON.stringify(atualizadas));

    fetchInfo();
  }
}

// Função para editar um item
function editarItem(event: Event): void {
  const id = (event.target as HTMLButtonElement).dataset.id;
  if (id) {
    window.location.href = `cadastro.html?id=${id}`;
  }
}

// Event listener para o botão de filtrar
filtrarBtn.addEventListener("click", fetchInfo);

// Inicializa o filtro e a tabela ao carregar a página
fetchNomes();
fetchInfo();
