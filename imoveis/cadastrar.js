document.addEventListener('DOMContentLoaded', () => {
    // Preencher as cidades com base no estado selecionado
    const cidades = {
        "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Campos dos Goytacazes", "Duque de Caxias", "São Gonçalo"],
        // Adicione outras cidades conforme necessário
    };

    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');

    estadoSelect.addEventListener('change', () => {
        const estadoSelecionado = estadoSelect.value;
        
        // Limpa as opções de cidade, mas garante que a opção inicial seja criada com createElement
        cidadeSelect.innerHTML = ''; // Limpa todas as opções anteriores
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Selecione a Cidade';
        cidadeSelect.appendChild(optionDefault); // Adiciona a opção padrão
    
        if (estadoSelecionado && cidades[estadoSelecionado]) {
            // Para cada cidade no estado selecionado, cria uma nova opção
            cidades[estadoSelecionado].forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade;
                option.textContent = cidade;
                cidadeSelect.appendChild(option);
            });
        }
    });
    

    // Lógica de envio do formulário
    const form = document.getElementById('form-cadastro');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Validação do formulário
        const endereco = document.getElementById('endereco').value;
        const estado = estadoSelect.value;
        const cidade = cidadeSelect.value;
        const corretor = document.getElementById('corretor').value;
        const proprietario = document.getElementById('proprietario').value;
        const valor = document.getElementById('valor').value;

        if (!endereco || !estado || !cidade || !corretor || !proprietario || !valor) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        const imovel = {
            endereco,
            estado,
            cidade,
            corretor_responsavel: corretor,
            proprietario,
            valor_do_imovel: parseFloat(valor),
        };

        // Salvar no localStorage
        let imoveis = JSON.parse(localStorage.getItem('imoveis')) || [];
        imoveis.push(imovel);
        localStorage.setItem('imoveis', JSON.stringify(imoveis));

        // Salvar no JSON (se necessário)
        salvarNoJSON(imovel);

        alert('Imóvel cadastrado com sucesso!');
        form.reset();
    });

    // Função para simular o cadastro no JSON
    async function salvarNoJSON(imovel) {
        try {
            const response = await fetch('http://localhost:3000/imoveis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(imovel),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar no JSON');
            }

            console.log('Imóvel salvo no JSON');
        } catch (error) {
            console.error('Erro:', error);
        }
    }
});
