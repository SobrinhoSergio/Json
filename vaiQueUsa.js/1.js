// Função para salvar no LocalStorage
function salvarLocalStorage(data) {
    let pessoas = JSON.parse(localStorage.getItem("pessoaTeste")) || [];
    pessoas.push({ ...data, sincronizado: false }); // Marca como não sincronizado
    localStorage.setItem("pessoaTeste", JSON.stringify(pessoas));
}

// Função para sincronizar os dados do LocalStorage com o servidor
async function sincronizarComServidor() {
    let pessoas = JSON.parse(localStorage.getItem("pessoaTeste")) || [];

    for (let pessoa of pessoas) {
        if (!pessoa.sincronizado) {
            try {
                // Envia os dados para o servidor
                const response = await fetch(infoUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pessoa),
                });

                if (response.ok) {
                    // Marca como sincronizado após o sucesso
                    pessoa.sincronizado = true;
                } else {
                    console.error("Erro ao sincronizar:", await response.text());
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
            }
        }
    }

    // Atualiza o LocalStorage para manter o status atualizado
    localStorage.setItem("pessoaTeste", JSON.stringify(pessoas));
}

// Função chamada ao submeter o formulário
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validaCampos(form)) {
        return; // Para a execução se a validação falhar
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Salvar no LocalStorage
    salvarLocalStorage(data);

    // Limpa o formulário
    form.reset();

    // Opcional: Sincronizar imediatamente após salvar
    sincronizarComServidor();
});

// Sincroniza os dados ao carregar a página
window.addEventListener("load", () => {
    sincronizarComServidor();
});
