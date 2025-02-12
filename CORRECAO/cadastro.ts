
document.addEventListener('DOMContentLoaded',  async (ev)=>{
    await carregaMarcas();
    document.getElementById("marca")?.addEventListener('change', async (ev)=>{
        carregaModelos((document.getElementById("marca") as HTMLSelectElement).value);
    });
    document.getElementById("modelo")?.addEventListener('change', async (ev)=>{
        carregaCoresEValor((document.getElementById("modelo") as HTMLSelectElement).value);
    });
    
    if(window.location.search != "" && window.location.search.includes("idVenda=")){
  
      const idVenda = window.location.search.split("=")[1].split("&")[0];

      await recuperaDadosVenda(idVenda);
      const campoId: HTMLInputElement = document.getElementById("idVenda") as HTMLInputElement;
      if(campoId.value != ""){
               
        (document.getElementById("btnCadastrar") as HTMLButtonElement).textContent = "Alterar Venda";
      }
    }

    document.getElementById("btnCadastrar")?.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        var form: FormData = new FormData(document.getElementById("formCadastro") as HTMLFormElement);
        const campoId: HTMLInputElement = document.getElementById("idVenda") as HTMLInputElement;
        if(validaCamposForm(form)){
            if(campoId.value != ""){
                cadastrarEditarVenda(form, "editar");
            }
            else {
                cadastrarEditarVenda(form, "cadastrar");
            }
        }
    });
});

async function carregaMarcas(){
    let marcas: any[] =[];
    try {
        const response = await fetch('http://localhost:3000/modelosCarros/', {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        const modelosCarros = await response.json();
        modelosCarros.forEach((modelo: any)=>{
            if(!marcas.includes(modelo.marca)){
                marcas.push(modelo.marca);
            }
        });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
    const campo: HTMLSelectElement = document.getElementById("marca") as HTMLSelectElement;
    limpaSelect(campo);
    marcas.forEach((marca)=>{
        let option: HTMLOptionElement = document.createElement("option");
        option.value = marca;
        option.text = marca;
        campo.appendChild(option);
    });
}	


async function carregaModelos(marca: string){
    if(marca == ""){
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/modelosCarros/?marca='+marca, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        const modelosCarros = await response.json();
        const campo: HTMLSelectElement = document.getElementById("modelo") as HTMLSelectElement;
        limpaSelect(campo);
        modelosCarros.forEach((modelo: any)=>{
            let option: HTMLOptionElement = document.createElement("option");
            option.value = modelo.modelo;
            option.text = modelo.modelo;
            campo.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
    
}	
function limpaSelect(campo: HTMLSelectElement){
    campo.querySelectorAll("option").forEach((opcao)=>{
        if(opcao.value != ""){
            campo.removeChild(opcao);
        }
    });
}
const formataMoeda = (valor: number) => { 
    return valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}	

async function carregaCoresEValor(modelo: string){
    if(modelo == ""){
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/modelosCarros/?modelo='+modelo, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        const modelosCarros = await response.json();
        const campo: HTMLSelectElement = document.getElementById("cor") as HTMLSelectElement;
        limpaSelect(campo);
        modelosCarros.forEach((modelo: any)=>{
            const campoValor: HTMLInputElement = document.getElementById("valor") as HTMLInputElement;
            campoValor.value = formataMoeda(modelo.valor);
            modelo.cores_disponiveis.forEach((cor: string)=>{
                let option: HTMLOptionElement = document.createElement("option");
                option.value = cor;
                option.text = cor;
                campo.appendChild(option);
            });
            
        });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
    
}	

function validaCamposForm(form: FormData): boolean{
    let campos: string[] = ["nome", "marca", "modelo", "cor"];
    let valido: boolean = true;
    let informacoes: string = "";
    campos.forEach((campo)=>{
        if(!form.has(campo) || form.get(campo)?.toString().trim() == ""){
            valido = false;
            informacoes += `Campo ${campo} não foi preenchido\n`;
        }
    });
    if(informacoes != ""){
        alert(informacoes);
    }
    return valido;
}
async function cadastrarEditarVenda(venda: FormData, op: string){
    try {
      venda.set("dataVenda", new Date().toISOString());
      venda.set("valorVenda", (document.getElementById("valor") as HTMLInputElement).value);
      if(venda.has("id") && venda.get("id") == ""){
        venda.delete("id");
      }
      const url: string = 'http://localhost:3000/vendas'+ (op=="cadastrar"?'':'/'+venda.get("id"));
      const response = await fetch(url, {
        method: op=="cadastrar"?'POST':'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(venda)),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao cadastrar venda: ${response.statusText}`);
      }
  
      const data = await response.json();
      op=="cadastrar"?alert('Venda cadastrada com sucesso'):alert('Venda alterada com sucesso');
    } catch (error) {
      console.error('Erro ao cadastrar venda:', error);
    }
}

async function  recuperaDadosVenda(idVenda: string) {
    try {
        console.log(idVenda)
        const response = await fetch(`http://localhost:3000/vendas/${idVenda}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
        const dadosVenda = await response.json();
        await carregaModelos(dadosVenda.marca);
        await carregaCoresEValor(dadosVenda.modelo);
        carregaDadosEditarNoForm(dadosVenda)
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
    }
}

function carregaDadosEditarNoForm(produto: any){
    var form: HTMLFormElement = document.getElementById("formCadastro") as HTMLFormElement;

    form.querySelectorAll("input").forEach((input)=>{
        console.log(input.name+" - "+produto[input.name]);
            input.setAttribute("value", produto[input.name]);
            if(input.name == "valor"){
                input.setAttribute("value", formataMoeda(produto["valorVenda"]));
            }
    });
    form.querySelectorAll("select").forEach((select)=>{
        marcaSelectCampo(select, produto[select.name]);
  });
}

function marcaSelectCampo(campo: HTMLSelectElement, valor: string){
  campo.querySelectorAll("option").forEach((opcao)=>{
    if(opcao.value == valor){
      opcao.setAttribute("selected", "selected");
    }
  });

}