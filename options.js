// Saves options to chrome.storage.sync.
function save_options() {
  var nomeGuia = document.getElementById('gr-nomeGuia').value;
  var saveDate = document.getElementById('wp-dataNome').checked;
  chrome.storage.sync.set({
    nomeGuia: nomeGuia,
    saveDate: saveDate
  }, function() {
    // Update status to let user know options were saved.
  alert("Salvo!")


  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    nomeGuia: '',
    saveDate: false
  }, function(items) {
    document.getElementById('gr-nomeGuia').value = items.nomeGuia;
    document.getElementById('wp-dataNome').checked = items.saveDate;
  });
}


document.addEventListener('DOMContentLoaded', restore_options);



document.getElementById('save').addEventListener('click',
    save_options);

