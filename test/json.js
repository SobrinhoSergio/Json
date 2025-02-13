const dataTable = document.getElementById("dataTable");
const fetchFromServer = document.getElementById("fetchFromServer");

// Função para carregar os dados do LocalStorage e exibir na tabela
function loadFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("data")) || [];
  dataTable.innerHTML = ""; // Limpa a tabela antes de renderizar
  storedData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.name}</td><td>${item.age}</td>`;
    dataTable.appendChild(row);
  });
}

// Função para buscar os dados do JSON Server
fetchFromServer.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/data");
    if (response.ok) {
      const data = await response.json();

      // Salvar os dados no LocalStorage
      localStorage.setItem("data", JSON.stringify(data));

      // Atualizar a tabela com os dados do LocalStorage
      loadFromLocalStorage();

      alert("Dados buscados do JSON Server e salvos no LocalStorage com sucesso!");
    } else {
      alert("Erro ao buscar dados do JSON Server.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor.");
  }
});

// Inicializar a tabela com os dados do LocalStorage
loadFromLocalStorage();
