var resource, config;

$("#btn-details").click(getScholarshipDetails);

$("#btn-details-simple").click(getScholarshipSearchDetails);

$("#btn-sendContact").click(createCallToAction);

$("#btn-contact").click(createGoogleContact);

function createGoogleContact(){
  getResponseContact("createGoogleContact");
}

function createCallToAction(){
  getResponse("createCallToAction");
}

function getScholarshipDetails(){  
  getResponse("getScholarshipDetails");
}

function getScholarshipSearchDetails(){
  getResponse("getScholarshipSearchDetails");
} 


function getResponse(message){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: message}, function(response) {
                 copyToClipboard(response.message);
        });
    });
}


function getResponseContact(message){
  
 chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "createGoogleContact" }, function (response) {
            contactData = {
                nome: response.nome,
                telefone: response.telefone,
                email: response.email,
                cpf: response.cpf
            }
            getAuthTokenInteractive();
          
        });
    });

}




function copyToClipboard(text) {
 var dummy = $('<textarea class="delete">').val(text).appendTo('body').select();
 document.execCommand('copy');
    $( ".delete" ).remove();
     success("Copiado");
}


function success(texto){
    $(`<h5 class="text-center"><strong>${texto}</strong></h5>`).insertBefore("#amor").delay(2500).fadeOut(function() {
   $(this).remove(); 
  });
}


function getAuthTokenInteractive(){
    chrome.identity.getAuthToken({
        interactive: true
    }, function (token) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
        }

        getGoogleEmail(token, createContact);
    });

}

function getGoogleEmail(token, callback) {
    $.ajax({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + token + '&alt=json&v=3.0',
        dataType: 'jsonp',
        data: token,

    }).done(function (data) {
        userMail = data.email;
        createAtom(userMail, contactData);
        callback(token);
    });
}

function createAtom(userMail, contactData) {
    resource = `<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gd="http://schemas.google.com/g/2005">
  <atom:title>${contactData.nome}</atom:title>
<atom:content type="text">CPF: ${contactData.cpf}</atom:content>

  <gd:name>
    <gd:fullName>${contactData.nome}</gd:fullName>
  </gd:name>
  <gd:email address="${contactData.email}" rel="http://schemas.google.com/g/2005#home"/>
<gd:phoneNumber rel="http://schemas.google.com/g/2005#home">
                ${contactData.telefone}
              </gd:phoneNumber>
<gContact:groupMembershipInfo href='http://www.google.com/m8/feeds/groups/${userMail}/base/6' deleted='false' />
</atom:entry>`
}





function createContact(token) {

    $.ajax({
        url: "https://www.googleapis.com/m8/feeds/contacts/default/full?access_token=" + token + "&alt=json&v=3.0",
        type: 'POST',
        data: resource,
        headers: {
            'Content-Type': 'application/atom+xml',
            'GData-Version': '3.0'

        },
        success: success("Adicionado!"),
        error: function (xhr, textStatus, errorThrown) {
            chrome.identity.removeCachedAuthToken({ token: token }, getAuthTokenInteractive);

        }

    });

}
