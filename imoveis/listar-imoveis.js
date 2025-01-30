async function consultarImoveis() {
    try {
        const response = await fetch('http://localhost:3000/imoveis');
        const imoveis = await tratarResposta(response);
        popularFiltros(imoveis);
        tratarImoveis(imoveis);
    } catch (erro) {
        console.error('Erro:', erro.message);
    }
}

function tratarResposta(response) {
    if (!response.ok) {
        throw new Error('Erro ao consultar os imóveis.');
    }
    return response.json();
}

function tratarImoveis(imoveis) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de renderizar

    imoveis.forEach((imovel) => {
        const tr = document.createElement('tr'); // Cria a linha da tabela

        // Cria as células da tabela
        const tdIndex = document.createElement('td');
        tdIndex.textContent = imovel.id; // Exibe o ID do imóvel

        const tdEndereco = document.createElement('td');
        tdEndereco.textContent = imovel.endereco;

        const tdCorretor = document.createElement('td');
        tdCorretor.textContent = imovel.corretor_responsavel;

        const tdProprietario = document.createElement('td');
        tdProprietario.textContent = imovel.proprietario;

        const tdValor = document.createElement('td');
        tdValor.textContent = imovel.valor_do_imovel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const tdAcao = document.createElement('td');
        const buttonRemover = document.createElement('button');
        buttonRemover.textContent = 'Remover';
        buttonRemover.onclick = () => removerImovel(imovel.id); // Passando o id para a função remover
        tdAcao.appendChild(buttonRemover);

        // Adiciona as células à linha
        tr.appendChild(tdIndex);
        tr.appendChild(tdEndereco);
        tr.appendChild(tdCorretor);
        tr.appendChild(tdProprietario);
        tr.appendChild(tdValor);
        tr.appendChild(tdAcao);

        // Adiciona a linha ao corpo da tabela
        tbody.appendChild(tr);
    });
}



function popularFiltros(imoveis) {
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');

    const estados = [...new Set(imoveis.map(imovel => imovel.estado))];
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    });

    estadoSelect.addEventListener('change', () => {
        cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
        cidadeSelect.disabled = true;

        const estadoSelecionado = estadoSelect.value;
        if (estadoSelecionado) {
            const cidades = [...new Set(imoveis
                .filter(imovel => imovel.estado === estadoSelecionado)
                .map(imovel => imovel.cidade))];

            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade;
                option.textContent = cidade;
                cidadeSelect.appendChild(option);
            });

            cidadeSelect.disabled = false;
        }
    });

    cidadeSelect.addEventListener('change', () => {
        const cidadeSelecionada = cidadeSelect.value;
        const estadoSelecionado = estadoSelect.value;

        const imoveisFiltrados = imoveis.filter(imovel =>
            imovel.estado === estadoSelecionado && imovel.cidade === cidadeSelecionada
        );
        tratarImoveis(imoveisFiltrados);
    });
}

function removerImovel(idImovel) {
    // Recupera os imóveis do localStorage
    let imoveis = JSON.parse(localStorage.getItem('imoveis')) || [];

    // Encontra o índice do imóvel a ser removido com base no ID
    const index = imoveis.findIndex(imovel => imovel.id === idImovel);

    // Verifica se o índice é válido
    if (index < 0 || index >= imoveis.length) {
        console.error('Índice inválido.');
        return;
    }

    // Remove o imóvel do array local
    imoveis.splice(index, 1);

    // Atualiza o localStorage
    localStorage.setItem('imoveis', JSON.stringify(imoveis));

    // Faz a chamada para a API para remover o imóvel
    fetch(`http://localhost:3000/imoveis/${idImovel}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                console.log(`Imóvel de ID ${idImovel} removido com sucesso na API.`);
            } else {
                console.error('Erro ao remover imóvel na API.');
            }
        })
        .catch(error => {
            console.error('Erro na comunicação com a API:', error);
        });

    // Atualiza a tabela no frontend
    tratarImoveis(imoveis);
}

// Inicia o carregamento dos imóveis ao carregar a página
document.addEventListener('DOMContentLoaded', consultarImoveis);
