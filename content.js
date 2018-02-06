

function getSearchCourseData(){
    bolsa = $(".modal-title.course-search-result-modal-header-text").filter(":visible")[0].textContent
    caracteristicas = $(".col-sm-12.modal-body:visible > div.col-sm-6")[0].querySelectorAll("ul > li");
    percentuais = $(".col-sm-12.modal-body:visible > div.col-sm-6")[1].querySelectorAll("ul > li");
    grau = caracteristicas[0].textContent
    modalidade = caracteristicas[1].textContent
    turno = caracteristicas[2].textContent
    semestre = caracteristicas[3].textContent
    duracao = caracteristicas[4].textContent
    link = $(".col-sm-12.modal-body:visible > div.col-sm-6 > ul > li > a").attr("href")
    porcentagem = percentuais[0].textContent
    preMatricula = percentuais[1].textContent
    mensalidade = percentuais[2].textContent
    mensalidadeDesc = percentuais[3].textContent
    localizacaoFacul= $(".col-sm-12.modal-body:visible > div.col-sm-6")[2].querySelectorAll("ul > li");
    campus = localizacaoFacul[0].textContent
    cidade = localizacaoFacul[1].textContent
    endereco= localizacaoFacul[2].textContent
    contatoFacul = $(".col-sm-12.modal-body:visible > div.col-sm-6")[3].querySelectorAll("ul > li"); 
    telefoneFacul = contatoFacul[0].textContent.replace(/ /g, '')

        scholarshipSearchDetails = [{
                                        bolsa: bolsa,
                                        grau: grau,
                                        modalidade: modalidade,
                                        turno: turno,
                                        semestre: semestre,
                                        duracao: duracao,
                                        link: link,
                                        bolsa: bolsa,
                                        preMatricula: preMatricula,
                                        mensalidade: mensalidade,
                                        mensalidadeDesc: mensalidadeDesc

                                    },
                                    {
                                        campus: campus,
                                        cidade: cidade,
                                        endereco: endereco,
                                        telefoneFacul: telefoneFacul
                                    }
                                ]

   return scholarshipSearchDetails;
}



function getStudentProfileData(){
    nomeCompletoGuia = $("p.no-margin")[0].textContent
    nomeGuia = nomeCompletoGuia.split(" ")[0].replace("@", "")
    nomeCompleto = $(".name-normal").filter(":visible")[0].textContent
    nome = nomeCompleto.split(" ")[0]
    cpf = $(".opa-field-name + .color-steel").filter(":visible")[0].textContent
    telefone =$('.user-phone-whatsapp').prev("span.color-steel").filter(":visible")[0].textContent.replace(/ /g, '')
    email =  $(".links-gray").filter(":visible")[0].textContent
    campus = $(".col-xs-6.order-details > a").filter(":visible")[0].textContent
    bolsa = $(".order-header-title").filter(":visible")[0].textContent
    valores = $(".col-xs-6.order-details-extended:visible")[0].innerHTML.split("<br>");
    enderecoBolsa = $(".col-xs-6.order-details:visible > div")[0].textContent
    preMatricula = valores[0];
    mensalidadeDesc = valores[1];
    detalhes =  $(".col-xs-6.order-details:visible")[0].innerHTML.split("<br>");
    grau = detalhes[1]; 
    modalidade = detalhes[2];
    turno = detalhes[3];

    studentProfile = [{
            nome: nomeCompleto,
            cpf: cpf,
            telefone: telefone,
            email: email},
         {
            bolsa: bolsa,
            grau: grau,
            modalidade: modalidade,
            turno: turno,
            campus: campus,
            preMatricula: preMatricula,
            mensalidadeDesc: mensalidadeDesc,
            enderecoBolsa: enderecoBolsa

         },
        {
            nomeGuia: nomeGuia
        }]  

    return studentProfile;

}

   //Listening to messages
   chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            var config
           
            console.log(config);

            console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

            var studentProfile = getStudentProfileData();
            var studentData = studentProfile[0];
            var scholarshipData = studentProfile[1];
            var guiaProfile = studentProfile[2];
            var response = "";
            
            if (request.greeting == "createGoogleContact"){

                    sendResponse({nome: studentData.nome, cpf: studentData.cpf, telefone: studentData.telefone, email: studentData.email});
                
                 
            }else if (request.message == "getScholarshipDetails"){
                response=`${studentData.nome}, esses são os detalhes da sua bolsa:\n`+
                         `${scholarshipData.bolsa}\n${scholarshipData.grau}\n${scholarshipData.modalidade}\n${scholarshipData.turno}\n${scholarshipData.preMatricula}\n`+
                         `${scholarshipData.mensalidadeDesc}\nEndereço: ${scholarshipData.enderecoBolsa}`;

                          sendResponse({message: response});

            }else if (request.message == "createCallToAction"){
                
                response = `Olá ${studentData.nome}✨, tudo bem?\nmeu nome é ${guiaProfile.nomeGuia} 😁 e sou o seu Guia no programa Quero Bolsa 📚🎒\n`+
                                `Você está a um passo de garantir a bolsa de estudos: *${scholarshipData.bolsa}*.\n`+
                                `Essa é uma das últimas bolsas disponíveis com um ótimo desconto.\n`+
                                `Como temos muita gente querendo essa bolsa, ela deve se esgotar nas próximas horas 😥.\n`+
                                `Sei que você quer economizar 🤑 na faculdade, então vamos garantir a sua bolsa?`
                                
                                sendResponse({message: response});

            }else if (request.message == "getScholarshipSearchDetails"){

                checkVisibility = $(".modal-title.course-search-result-modal-header-text").filter(":visible")[0]

                if (!checkVisibility){
                    response = alert("Clique em detalhes da oferta primeiro 😁")
                }else{
                    var scholarshipSearchDetails = getSearchCourseData();
                    var scholarshipSearchValues = scholarshipSearchDetails[0];
                    var scholarshipSearchUniversity = scholarshipSearchDetails[1];

                    response = `Detalhes da bolsa:\n${scholarshipSearchValues.bolsa}\n${scholarshipSearchValues.grau}\n${scholarshipSearchValues.modalidade}\n` +
                        `${scholarshipSearchValues.turno}\n${scholarshipSearchValues.semestre}\n${scholarshipSearchValues.duracao}\n` +
                        `Link da bolsa:\n${scholarshipSearchValues.link}\n${scholarshipSearchValues.preMatricula}\n${scholarshipSearchValues.mensalidade}\n` +
                        `${scholarshipSearchValues.mensalidadeDesc}\n${scholarshipSearchUniversity.cidade}\n${scholarshipSearchUniversity.endereco}`


                }
                            sendResponse({message: response});

               
            }});

