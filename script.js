let isAdmin = false;
// hash SHA-256 de "monSuperMotDePasse"
const adminHash = "4cb59c4f58837c3b1d6d6f4a4663a88e946e97e659fdb12e4df79e95e86e9302";

let pendingCrafts = JSON.parse(localStorage.getItem('pendingCrafts')) || [];
let validatedCrafts = JSON.parse(localStorage.getItem('validatedCrafts')) || [];

function saveData() {
  localStorage.setItem('pendingCrafts', JSON.stringify(pendingCrafts));
  localStorage.setItem('validatedCrafts', JSON.stringify(validatedCrafts));
}

function renderLists() {
  const pendingList = document.getElementById('pendingCrafts');
  const validatedList = document.getElementById('validatedCrafts');
  pendingList.innerHTML = '';
  validatedList.innerHTML = '';

  pendingCrafts.forEach((craft, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${craft.name}</b><br>${formatComponents(craft.components)}`;
    if (isAdmin) {
      const btn = document.createElement('button');
      btn.textContent = "Valider";
      btn.onclick = () => validateCraft(index);
      li.appendChild(btn);
    }
    pendingList.appendChild(li);
  });

  validatedCrafts.forEach(craft => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${craft.name}</b><br>${formatComponents(craft.components)}`;
    validatedList.appendChild(li);
  });
}

function formatComponents(components) {
  return components.map(c =>
    `- ${c.item} x${c.quantity}` +
    (c.subcomponents.length > 0 ? 
      '<br>' + c.subcomponents.map(sub => `&nbsp;&nbsp;- ${sub.item} x${sub.quantity}`).join('<br>') 
      : '')
  ).join('<br>');
}

function addComponent() {
  const container = document.createElement('div');
  container.className = 'component';
  container.innerHTML = `
    <input type="text" placeholder="Nom du composant" class="comp-name" required>
    <input type="number" placeholder="Quantité" class="comp-qty" required>
    <button type="button" onclick="addSubcomponent(this)">➕ Sous-composant</button>
    <div class="subcomponents"></div>
  `;
  document.getElementById('components').appendChild(container);
}

function addSubcomponent(btn) {
  const subContainer = document.createElement('div');
  subContainer.className = 'subcomponent';
  subContainer.innerHTML = `
    <input type="text" placeholder="Nom sous-composant" class="sub-name" required>
    <input type="number" placeholder="Quantité" class="sub-qty" required>
  `;
  btn.nextElementSibling.appendChild(subContainer);
}

async function activateAdmin() {
  const entered = document.getElementById('adminPassword').value;
  const status = document.getElementById('adminStatus');

  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(entered));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if (hashHex === adminHash) {
    isAdmin = true;
    localStorage.setItem('adminActivatedAt', Date.now());
    status.textContent = "Mode admin activé (48h)";
    renderLists();
  } else {
    status.textContent = "Mot de passe incorrect";
  }
}

function checkAdminDuration() {
  const activatedAt = localStorage.getItem('adminActivatedAt');
  if (activatedAt && Date.now() - activatedAt < 48 * 3600 * 1000) {
    isAdmin = true;
  }
}

function validateCraft(index) {
  validatedCrafts.push(pendingCrafts[index]);
  pendingCrafts.splice(index, 1);
  saveData();
  renderLists();
}

document.getElementById('craftForm').onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById('itemName').value;
  const compEls = document.querySelectorAll('.component');
  let components = [];

  compEls.forEach(comp => {
    const item = comp.querySelector('.comp-name').value;
    const quantity = parseInt(comp.querySelector('.comp-qty').value);
    const subEls = comp.querySelectorAll('.subcomponent');
    let subcomponents = [];

    subEls.forEach(sub => {
      const subItem = sub.querySelector('.sub-name').value;
      const subQty = parseInt(sub.querySelector('.sub-qty').value);
      subcomponents.push({ item: subItem, quantity: subQty });
    });

    components.push({ item, quantity, subcomponents });
  });

  pendingCrafts.push({ name, components });
  saveData();
  document.getElementById('craftForm').reset();
  document.getElementById('components').innerHTML = '';
  renderLists();
}

checkAdminDuration();
renderLists();
