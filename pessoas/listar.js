async function consultarPessoas() {
    try {
        const response = await fetch('http://localhost:3000/pessoas');
        const pessoas = await tratarResposta(response);
        popularFiltros(pessoas);
        tratarPessoas(pessoas);
    } catch (erro) {
        console.error('Erro:', erro.message);
    }
}

function tratarResposta(response) {
    if (!response.ok) {
        throw new Error('Erro ao consultar as pessoas.');
    }
    return response.json();
}

function tratarPessoas(pessoas) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    
    pessoas.forEach((pessoa) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pessoa.nome}</td>
            <td>${pessoa.telefone}</td>
            <td>${pessoa.cidade}</td>
            <td>${pessoa.estado}</td>
        `;
        tbody.appendChild(tr);
    });
}

function popularFiltros(pessoas) {
    const estadoSelect = document.getElementById('estado');
    const estados = [...new Set(pessoas.map(pessoa => pessoa.estado))];
    
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado;
        estadoSelect.appendChild(option);
    });

    estadoSelect.addEventListener('change', () => {
        const estadoSelecionado = estadoSelect.value;
        const pessoasFiltradas = estadoSelecionado ? 
            pessoas.filter(pessoa => pessoa.estado === estadoSelecionado) : 
            pessoas;
        tratarPessoas(pessoasFiltradas);
    });
}

document.addEventListener('DOMContentLoaded', consultarPessoas);