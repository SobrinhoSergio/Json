
document.addEventListener('DOMContentLoaded',  (ev)=>{
    document.getElementById("btnCadastrar")?.addEventListener('click', async (ev)=>{
        var form: FormData = new FormData(document.getElementById("formCadastro") as HTMLFormElement);
        if(validaCampos(form)){
            //console.log("Antes await");
            cadastrarProduto(form);
            //console.log(produto);
            //console.log("Depois do depois await");
        }
        ev.preventDefault();
    });
});


function validaCampos(form: FormData): boolean{
    let campos: string[] = ["nome", "preco", "fabricante", "tipoUnidade"];
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
async function cadastrarProduto(produto: FormData) {
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