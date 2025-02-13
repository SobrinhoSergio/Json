const form = document.getElementById("dataForm");
const dataTable = document.getElementById("dataTable");
const sendToServer = document.getElementById("sendToServer");

// Função para carregar os dados do LocalStorage
function loadFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("data")) || [];
  dataTable.innerHTML = "";
  storedData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.name}</td><td>${item.age}</td>`;
    dataTable.appendChild(row);
  });
}

// Salvar os dados no LocalStorage
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;

  // Adicionar ao LocalStorage
  const storedData = JSON.parse(localStorage.getItem("data")) || [];
  storedData.push({ name, age });
  localStorage.setItem("data", JSON.stringify(storedData));

  // Atualizar tabela
  loadFromLocalStorage();

  // Limpar o formulário
  form.reset();
});

// Enviar os dados do LocalStorage para o JSON Server
sendToServer.addEventListener("click", async () => {
  const storedData = JSON.parse(localStorage.getItem("data")) || [];

  if (storedData.length === 0) {
    alert("Nenhum dado encontrado no LocalStorage para enviar.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storedData),
    });

    if (response.ok) {
      alert("Dados enviados com sucesso!");
      localStorage.removeItem("data"); // Limpar LocalStorage após envio
      loadFromLocalStorage(); // Atualizar tabela
    } else {
      alert("Erro ao enviar os dados para o servidor.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor.");
  }
});

// Inicializar a tabela com os dados do LocalStorage
loadFromLocalStorage();
