document.addEventListener('DOMContentLoaded', (ev) => {
    document.getElementById("btnCadastrar")?.addEventListener('click', async (ev) => {
        ev.preventDefault();

        var form = new FormData(document.getElementById("formCadastro"));
        if (validaCampos(form)) {
            await cadastrarProduto(form);
        }
    });

    carregarProdutosDoLocalStorage();
});

function validaCampos(form) {
    let erros = [];

    const regras = {
        nome: { min: 3, max: 80, obrigatorio: true, mensagem: "Nome deve ter entre 3 e 80 caracteres." },
        preco: { max: 9999.99, obrigatorio: true, mensagem: "Preço deve ser um número válido até 9999.99." },
        fabricante: { min: 2, max: 50, obrigatorio: true, mensagem: "Fabricante deve ter entre 2 e 50 caracteres." },
        tipoUnidade: { obrigatorio: true, mensagem: "Tipo de unidade deve ser preenchido." }
    };

    Object.keys(regras).forEach(campo => {
        let valor = form.get(campo)?.toString().trim();

        if (!valor) {
            erros.push(`Campo ${campo} é obrigatório.`);
            return;
        }

        if (regras[campo].min && valor.length < regras[campo].min) {
            erros.push(regras[campo].mensagem);
        }

        if (regras[campo].max && valor.length > regras[campo].max) {
            erros.push(regras[campo].mensagem);
        }

        if (campo === "preco" && (isNaN(valor) || parseFloat(valor) > regras.preco.max)) {
            erros.push(regras.preco.mensagem);
        }
    });

    if (erros.length) alert(erros.join("\n"));

    return erros.length === 0;
}

async function cadastrarProduto(produto) {
    try {
        const produtoObj = Object.fromEntries(produto);
        salvarProdutoNoLocalStorage(produtoObj);

        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(produtoObj),
        });

        if (!response.ok) {
            throw new Error(`Erro ao cadastrar produto: ${response.statusText}`);
        }

        alert('Produto cadastrado com sucesso');
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
}

function salvarProdutoNoLocalStorage(produto) {
    let produtos = JSON.parse(localStorage.getItem("produtosTeste")) || [];
    produtos.push(produto);
    localStorage.setItem("produtosTeste", JSON.stringify(produtos));
}

function carregarProdutosDoLocalStorage() {
    let produtos = JSON.parse(localStorage.getItem("produtosTeste")) || [];
    produtos.forEach(produto => {
        console.log("Produto carregado do LocalStorage:", produto);
    });
}
