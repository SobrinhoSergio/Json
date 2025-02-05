document.getElementById('formCadastro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const fabricante = document.getElementById('fabricante').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;

    // Validação de campos
    if (!nome || nome.length < 3 || nome.length > 50) {
        alert('O nome deve ter entre 3 e 50 caracteres!');
        return;
    }

    if (!fabricante || fabricante.length < 3 || fabricante.length > 50) {
        alert('O fabricante deve ter entre 3 e 50 caracteres!');
        return;
    }

    if (isNaN(preco) || preco < 10 || preco > 10000) {
        alert('O preço deve ser um número válido entre R$ 10,00 e R$ 10.000,00!');
        return;
    }

    if (!tipo) {
        alert('O tipo do produto é obrigatório!');
        return;
    }

    // Caso passe por todas as validações
    const novoProduto = { nome, fabricante, preco, tipo };

    try {
        // Cadastrar no servidor
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });

        if (response.ok) {
            // Cadastrar no localStorage
            let produtosNoLocalStorage = JSON.parse(localStorage.getItem('produtos')) || [];
            produtosNoLocalStorage.push(novoProduto); // Adiciona o novo produto
            localStorage.setItem('produtos', JSON.stringify(produtosNoLocalStorage)); // Salva no localStorage

            alert('Produto cadastrado com sucesso!');
            carregarProdutos(); // Recarregar a lista após o cadastro
        } else {
            alert('Erro ao cadastrar produto.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
});
