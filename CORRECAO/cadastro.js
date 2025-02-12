document.addEventListener("DOMContentLoaded", async () => {
    await carregaMarcas();
  
    const marcaEl = document.getElementById("marca");
    const modeloEl = document.getElementById("modelo");
    const btnCadastrarEl = document.getElementById("btnCadastrar");
  
    if (marcaEl) {
      marcaEl.addEventListener("change", async () => {
        carregaModelos(marcaEl.value);
      });
    }
  
    if (modeloEl) {
      modeloEl.addEventListener("change", async () => {
        carregaCoresEValor(modeloEl.value);
      });
    }
  
    if (window.location.search.includes("idVenda=")) {
      const idVenda = new URLSearchParams(window.location.search).get("idVenda");
      if (idVenda) {
        await recuperaDadosVenda(idVenda);
        const campoId = document.getElementById("idVenda");
        if (campoId && campoId.value !== "") {
          btnCadastrarEl.textContent = "Alterar Venda";
        }
      }
    }
  
    if (btnCadastrarEl) {
      btnCadastrarEl.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const form = new FormData(document.getElementById("formCadastro"));
        const campoId = document.getElementById("idVenda");
  
        if (validaCamposForm(form)) {
          const operacao = campoId && campoId.value !== "" ? "editar" : "cadastrar";
          await cadastrarEditarVenda(form, operacao);
        }
      });
    }
  });
  
  // Funções Auxiliares
  async function carregaMarcas() {
    const campo = document.getElementById("marca");
    const marcas = await fetchDados('http://localhost:3000/modelosCarros/', (dados) => {
      return [...new Set(dados.map((modelo) => modelo.marca))]; // Filtrar marcas únicas
    });
    populaSelect(campo, marcas);
  }
  
  async function carregaModelos(marca) {
    if (!marca) return;
    const campo = document.getElementById("modelo");
    const modelos = await fetchDados(`http://localhost:3000/modelosCarros/?marca=${marca}`, (dados) => {
      return dados.map((modelo) => modelo.modelo);
    });
    populaSelect(campo, modelos);
  }
  
  async function carregaCoresEValor(modelo) {
    if (!modelo) return;
  
    const campoCor = document.getElementById("cor");
    const campoValor = document.getElementById("valor");
  
    const modelos = await fetchDados(`http://localhost:3000/modelosCarros/?modelo=${modelo}`, (dados) => dados);
  
    limpaSelect(campoCor);
    modelos.forEach((modelo) => {
      if (campoValor) {
        campoValor.value = formataMoeda(modelo.valor);
      }
      populaSelect(campoCor, modelo.cores_disponiveis);
    });
  }
  
  // Função genérica para requisições
  async function fetchDados(url, transformFn) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
      const dados = await response.json();
      return transformFn(dados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return [];
    }
  }
  
  function limpaSelect(campo) {
    if (campo) {
      campo.innerHTML = "<option value=''>Selecione</option>";
    }
  }
  
  function populaSelect(campo, opcoes) {
    limpaSelect(campo);
    opcoes.forEach((opcao) => {
      const option = document.createElement("option");
      option.value = opcao;
      option.text = opcao;
      campo.appendChild(option);
    });
  }
  
  // Validação de formulário
  function validaCamposForm(form) {
    const camposObrigatorios = ["nome", "marca", "modelo", "cor"];
    const informacoes = [];
  
    camposObrigatorios.forEach((campo) => {
      if (!form.has(campo) || form.get(campo)?.trim() === "") {
        informacoes.push(`Campo ${campo} não foi preenchido`);
      }
    });
  
    if (informacoes.length > 0) {
      alert(informacoes.join("\n"));
      return false;
    }
    return true;
  }
  
  async function cadastrarEditarVenda(venda, operacao) {
    try {
      venda.set("dataVenda", new Date().toISOString());
      venda.set("valorVenda", document.getElementById("valor").value);
  
      if (!venda.get("id")) venda.delete("id");
  
      const url = `http://localhost:3000/vendas${operacao === "editar" ? `/${venda.get("id")}` : ""}`;
      const response = await fetch(url, {
        method: operacao === "cadastrar" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(venda)),
      });
  
      if (!response.ok) throw new Error(`Erro ao ${operacao} venda: ${response.statusText}`);
  
      alert(`Venda ${operacao === "cadastrar" ? "cadastrada" : "alterada"} com sucesso!`);
    } catch (error) {
      console.error(`Erro ao ${operacao} venda:`, error);
    }
  }
  