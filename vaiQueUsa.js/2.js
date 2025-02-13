// Função para cadastrar ou editar uma informação
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validaCampos(form)) {
        return; // Para a execução se a validação falhar
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Salvar no LocalStorage primeiro
    salvarLocalStorage(data);

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
    } catch (error) {
        console.error("Erro ao enviar os dados para o servidor:", error);
        alert("Erro ao salvar no servidor. Os dados foram armazenados localmente.");
    }

    form.reset();
});
