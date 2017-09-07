var nome, cpf, telefone, email, curso, valores, enderecoBolsa, mensagem, detalhes, grau, turno, modalidade;
var guia = "Alefe";


function getBasicData(){
            nomeCompleto = document.getElementsByClassName('name-normal')[0].textContent;
            nome = nomeCompleto.match(/\S\w*\S?\w*/g);      
            cpf = document.getElementsByClassName('color-steel')[0].textContent;
            telefone = document.getElementsByClassName('color-steel')[1].textContent;
            email =  document.getElementsByClassName('links-gray')[0].textContent;
            curso = document.getElementsByClassName('order-header-title')[0].textContent;
            valores = document.getElementsByClassName('col-xs-6 order-details-extended')[0].textContent;
            enderecoBolsa = document.getElementsByClassName('user-form-modal-popover-menu-text')[0].textContent
            taxaPMatricula = valores.match(/Preço da pré-matrícula:\s\S*\d/g);
            mensalidadeDesconto = valores.match(/Mensalidade do curso com o desconto:\s\S*\d/g);
    		detalhes =  document.getElementsByClassName('col-xs-6 order-details')[0].innerHTML
            grau = detalhes.match(/Grau: \S\w*\S?\w*[^<br>-]/g);
            turno = detalhes.match(/Turno: \S\w*\S?\w*[^<br>]/g);      
            modalidade = detalhes.match(/Modalidade: \S\w*\S?\w*[^<br>]/g);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        
        
         getBasicData();
        
         if (request.greeting == "createContact"){
			
             sendResponse({nome: nomeCompleto, cpf: cpf, telefone: telefone, email: email});
             
        }else if (request.greeting == "details"){
            mensagem=`${nome[0]}, esses são os detalhes da sua bolsa:

${curso}
 ${grau}
 ${modalidade}
 ${turno}
 ${taxaPMatricula}
 ${mensalidadeDesconto}
 Endereço da faculdade: ${enderecoBolsa}`
            
            sendResponse({mensagem: mensagem});
            
            
        }
		 
    });
