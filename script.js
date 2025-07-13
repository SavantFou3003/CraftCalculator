let crafts = [];
let pendingCrafts = JSON.parse(localStorage.getItem('pendingCrafts')) || [];

const ADMIN_PASSWORD = "monSuperMotDePasse"; // Change-le !
const ADMIN_DURATION_HOURS = 48;

// Charger les crafts officiels
fetch('crafts.json')
  .then(res => res.json())
  .then(data => {
    crafts = data;
    displayCrafts();
    displayPending();
    checkAdminStatus();
  });

function displayCrafts() {
  const table = document.getElementById('craft-table');
  table.innerHTML = "";
  crafts.forEach(craft => {
    let rows = `<tr><th colspan="3">${craft.item} x${craft.quantity}</th></tr>`;
    rows += `<tr><th>Composant</th><th>Quantité</th><th>Note</th></tr>`;
    craft.components.forEach(comp => {
      rows += `<tr><td>${comp.name}</td><td>${comp.quantity}</td><td>${comp.note}</td></tr>`;
    });
    table.innerHTML += rows;
  });
}

function displayPending() {
  const list = document.getElementById('pending-list');
  list.innerHTML = "";
  pendingCrafts.forEach((craft, idx) => {
    list.innerHTML += `<div><strong>${craft.item} x${craft.quantity}</strong> <button onclick="removePending(${idx})">Supprimer</button></div>`;
  });
}

document.getElementById('add-craft-form').addEventListener('submit', e => {
  e.preventDefault();
  const item = document.getElementById('new-item-name').value;
  const quantity = parseInt(document.getElementById('new-item-quantity').value);
  const componentsText = document.getElementById('new-item-components').value.trim();
  const components = componentsText.split('\n').map(line => {
    const parts = line.split(';');
    return { name: parts[0], quantity: parseInt(parts[1]), note: parts[2] || "-" };
  });
  pendingCrafts.push({ item, quantity, components });
  localStorage.setItem('pendingCrafts', JSON.stringify(pendingCrafts));
  displayPending();
  e.target.reset();
});

function removePending(idx) {
  pendingCrafts.splice(idx,1);
  localStorage.setItem('pendingCrafts', JSON.stringify(pendingCrafts));
  displayPending();
}

function loginAdmin() {
  const pw = document.getElementById('admin-password').value;
  if (pw === ADMIN_PASSWORD) {
    const expireTime = new Date().getTime() + ADMIN_DURATION_HOURS * 3600 * 1000;
    localStorage.setItem('adminExpire', expireTime);
    checkAdminStatus();
    alert("Mode admin activé !");
  } else {
    alert("Mot de passe incorrect");
  }
}

function checkAdminStatus() {
  const expire = parseInt(localStorage.getItem('adminExpire') || "0");
  if (new Date().getTime() < expire) {
    document.getElementById('validate-btn').style.display = 'inline';
  } else {
    document.getElementById('validate-btn').style.display = 'none';
  }
}

function validatePending() {
  crafts = crafts.concat(pendingCrafts);
  pendingCrafts = [];
  localStorage.setItem('pendingCrafts', JSON.stringify(pendingCrafts));
  displayCrafts();
  displayPending();
  alert("Crafts validés !");
}

function downloadCSV() {
  let csv = "Item;Quantité;Composant;Quantité;Note\n";
  crafts.forEach(craft => {
    craft.components.forEach(comp => {
      csv += `${craft.item};${craft.quantity};${comp.name};${comp.quantity};${comp.note}\n`;
    });
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "crafts.csv";
  a.click();
  URL.revokeObjectURL(url);
}
