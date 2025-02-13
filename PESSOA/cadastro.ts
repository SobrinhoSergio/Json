const nomesUrl: string = "http://localhost:3000/NOMES";
const infoUrl: string = "http://localhost:3000/INFO";
const form: HTMLFormElement | null = document.getElementById("cadastroForm") as HTMLFormElement;
const nomeSelect: HTMLSelectElement | null = document.getElementById("nome") as HTMLSelectElement;

const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
const id: string | null = urlParams.get("id");

// Função para carregar os nomes no select
async function fetchNomes(): Promise<void> {
  try {
    const response = await fetch(nomesUrl);
    const data: { nome: string }[] = await response.json();
    renderNomes(data);
  } catch (error) {
    console.error("Erro ao buscar nomes:", error);
  }
}

// Renderiza os nomes no <select>
function renderNomes(data: { nome: string }[]): void {
  if (!nomeSelect) return;
  nomeSelect.innerHTML = `<option value="">Selecione um nome</option>`;
  data.forEach((item) => {
    const option: HTMLOptionElement = document.createElement("option");
    option.value = item.nome;
    option.textContent = item.nome;
    nomeSelect.appendChild(option);
  });
}

// Função para carregar as informações no formulário para edição
async function fetchInfoForEdit(): Promise<void> {
  if (id) {
    try {
      const response = await fetch(`${infoUrl}/${id}`);
      const data: {
        nome: string;
        cpf: string;
        nascimento: string;
        sexo: string;
        endereco: string;
      } = await response.json();

      if (nomeSelect) nomeSelect.value = data.nome;
      const cpfInput = document.getElementById("cpf") as HTMLInputElement;
      const nascimentoInput = document.getElementById("nascimento") as HTMLInputElement;
      const sexoInput = document.getElementById("sexo") as HTMLInputElement;
      const enderecoInput = document.getElementById("endereco") as HTMLInputElement;

      if (cpfInput) cpfInput.value = data.cpf;
      if (nascimentoInput) nascimentoInput.value = data.nascimento;
      if (sexoInput) sexoInput.value = data.sexo;
      if (enderecoInput) enderecoInput.value = data.endereco;
    } catch (error) {
      console.error("Erro ao buscar informações para edição:", error);
    }
  }
}

function validaCampos(formElement: HTMLFormElement): boolean {
  const campos: string[] = ["nome", "cpf", "nascimento", "sexo", "endereco"];
  let valido: boolean = true;
  let informacoes: string = "";

  const formData = new FormData(formElement);

  // Validação básica dos campos
  campos.forEach((campo) => {
    if (!formData.has(campo) || formData.get(campo)?.toString().trim() === "") {
      valido = false;
      informacoes += `Campo ${campo} não foi preenchido\n`;
    }
  });

  // Validação do CPF
  const cpf: string | undefined = formData.get("cpf")?.toString().trim();
  if (cpf && !validarCPF(cpf)) {
    valido = false;
    informacoes += "CPF inválido\n";
  }

  // Validação da data de nascimento
  const nascimento: string | undefined = formData.get("nascimento")?.toString().trim();
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
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\\d)\1+$/.test(cpf)) return false; // Tamanho ou padrão inválido
  return true; // Aqui é apenas uma validação básica
}

// Função para validar data de nascimento
function validarNascimento(nascimento: string): boolean {
  const dataAtual = new Date();
  const dataMinima = new Date("1988-01-01");
  const dataNascimento = new Date(nascimento);

  return dataNascimento >= dataMinima && dataNascimento <= dataAtual;
}

function salvarLocalStorage(data: Record<string, string>): void {
  const pessoas: Record<string, string>[] = JSON.parse(localStorage.getItem("pessoaTeste") || "[]");
  pessoas.push(data);
  localStorage.setItem("pessoaTeste", JSON.stringify(pessoas));
}

function carregarVendasDoLocalStorage(): void {
  const pessoas: Record<string, string>[] = JSON.parse(localStorage.getItem("pessoaTeste") || "[]");
  pessoas.forEach((pessoa) => {
    console.log("Venda carregada do LocalStorage:", pessoa);
  });
}

// Função para cadastrar ou editar uma informação
form?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  if (!validaCampos(form)) {
    return; // Para a execução se a validação falhar
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
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
  } catch (error) {
    console.error("Erro ao salvar informações:", error);
  }
});

// Inicializa o select de nomes e carrega as informações
fetchNomes();
fetchInfoForEdit();
