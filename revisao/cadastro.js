document.addEventListener('DOMContentLoaded', (ev) => {
    document.getElementById("btnCadastrar")?.addEventListener('click', async (ev) => {
        var form = new FormData(document.getElementById("formCadastro"));
        if (validaCampos(form)) {
            //console.log("Antes await");
            cadastrarProduto(form);
            //console.log(produto);
            //console.log("Depois do depois await");
        }
        ev.preventDefault();
    });
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

        // Verifica se o campo é obrigatório e está vazio
        if (!valor) {
            erros.push(`Campo ${campo} é obrigatório.`);
            return;
        }

        // Verifica limites de caracteres
        if (regras[campo].min && valor.length < regras[campo].min) {
            erros.push(regras[campo].mensagem);
        }

        if (regras[campo].max && valor.length > regras[campo].max) {
            erros.push(regras[campo].mensagem);
        }

        // Validação específica para preço (deve ser número e dentro do limite)
        if (campo === "preco" && (isNaN(valor) || parseFloat(valor) > regras.preco.max)) {
            erros.push(regras.preco.mensagem);
        }
    });

    if (erros.length) alert(erros.join("\n"));

    return erros.length === 0;
}



async function cadastrarProduto(produto) {
    try {
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(produto)),
        });

        if (!response.ok) {
            throw new Error(`Erro ao cadastrar produto: ${response.statusText}`);
        }

        const data = await response.json();
        //setTimeout(()=>{}, 2000);
        console.log("Dentro da funcao async");
        alert('Produto cadastrado com sucesso');
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
}
