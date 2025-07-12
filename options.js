// saves options to localStorage
function SaveOptions() {
  var select = document.getElementById("emailadd");
  var add = select.value;
  localStorage["emailadd"] = add;

  // update status to let user know options were saved
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// restores select box state to saved value from localStorage
function RestoreOptions() {
  var add = localStorage["emailadd"];
  if (!add) {
    return;
  }

  var select = document.getElementById("emailadd");
  select.value = add;
}
document.addEventListener('DOMContentLoaded', RestoreOptions);
document.querySelector('#save').addEventListener('click', SaveOptions);