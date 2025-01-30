document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        const produtos = await response.json();
        console.log(produtos); // Apenas para verificar os produtos carregados
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

document.getElementById('formCadastro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const fabricante = document.getElementById('fabricante').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const tipo = document.getElementById('tipo').value;

    const novoProduto = { nome, fabricante, preco, tipo };

    try {
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto)
        });

        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            carregarProdutos(); // Recarregar a lista após o cadastro
        } else {
            alert('Erro ao cadastrar produto.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
});
