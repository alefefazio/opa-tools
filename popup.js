var nome, cpf, telefone, email, resource, userMail;

$("#btn-details").click(getDetails);
$("#btn-contact").click(getStudentData);

function getDetails(){  

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "details"}, function(response) {
              copyToClipboard(response.mensagem);
  
    });
});
    

}

function getStudentData(){  

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "createContact"}, function(response) {
              nome = response.nome;
              cpf = response.cpf
              telefone = response.telefone;
              email = response.email;
        getAuthTokenInteractive();
  
    });
});
    

}

function copyToClipboard(text) {
    window.prompt("Para copiar: Ctrl+C, Enter", text);
  }

function getAuthToken(options) {
    chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}

function getAuthTokenInteractive() {
    getAuthToken({
        'interactive': true,
        'callback': getAuthTokenInteractiveCallback,
    });
}

function getAuthTokenInteractiveCallback(token) {
    // Catch chrome error if user is not authorized.
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    } else {
        getGoogleEmail(token);
    }
}


function getGoogleEmail(token) {
   $.ajax({
          url: 'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + token + '&alt=json&v=3.0',
          dataType: 'jsonp',
          data: token,
             
        }).done(function(data) {
             userMail = data.email
             createAtom(userMail);
             createContact(token);
       
          });
}





function success(){
    $('<div><h5><strong>Adicionado!</strong></h5></div>').insertAfter('#btn-contact').delay(2500).fadeOut(function() {
   $(this).remove(); 
});
}




function createAtom(userMail){
       resource = `<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gd="http://schemas.google.com/g/2005">
  <atom:title>${nome}</atom:title>
<atom:content type="text">CPF: ${cpf}</atom:content>

  <gd:name>
    <gd:fullName>${nome}</gd:fullName>
  </gd:name>
  <gd:email address="${email}" rel="http://schemas.google.com/g/2005#home"/>
<gd:phoneNumber rel="http://schemas.google.com/g/2005#home">
                ${telefone}
              </gd:phoneNumber>
<gContact:groupMembershipInfo href='http://www.google.com/m8/feeds/groups/${userMail}/base/6' deleted='false' />
</atom:entry>`
      
}


function createContact(token){
    
     $.ajax({   
           
                     url: "https://www.googleapis.com/m8/feeds/contacts/default/full?access_token=" + token + "&alt=json&v=3.0",
                     type: 'POST',
                     data: resource,
                     headers: {
                         'Content-Type': 'application/atom+xml',
                        'GData-Version': '3.0'
                        
                    },
                    success: success,
                    error: function (xhr, textStatus, errorThrown) {
                         chrome.identity.removeCachedAuthToken({ token: token }, getToken());
                         
                    }
        
            });
    
}