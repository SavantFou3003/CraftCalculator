let isAdmin = false;
// SHA-256 du mot de passe "monSuperMotDePasse"
const adminHash = "87f29a7d74534506aa0736198b6fd969a66e89ccd83d85dd32b4f7351c5b6d8d";

const craftForm = document.getElementById('craftForm');
const pendingList = document.getElementById('pendingCrafts');
const validatedList = document.getElementById('validatedCrafts');

let pendingCrafts = JSON.parse(localStorage.getItem('pendingCrafts')) || [];
let validatedCrafts = JSON.parse(localStorage.getItem('validatedCrafts')) || [];

function saveData() {
  localStorage.setItem('pendingCrafts', JSON.stringify(pendingCrafts));
  localStorage.setItem('validatedCrafts', JSON.stringify(validatedCrafts));
}

function renderLists() {
  pendingList.innerHTML = '';
  validatedList.innerHTML = '';

  pendingCrafts.forEach((craft, index) => {
    const li = document.createElement('li');
    li.textContent = craft.item + ": " + craft.recipe;

    if (isAdmin) {
      const validateBtn = document.createElement('button');
      validateBtn.textContent = "Valider";
      validateBtn.onclick = () => validateCraft(index);
      li.appendChild(validateBtn);
    }

    pendingList.appendChild(li);
  });

  validatedCrafts.forEach(craft => {
    const li = document.createElement('li');
    li.textContent = craft.item + ": " + craft.recipe;
    validatedList.appendChild(li);
  });
}

function validateCraft(index) {
  validatedCrafts.push(pendingCrafts[index]);
  pendingCrafts.splice(index, 1);
  saveData();
  renderLists();
}

async function activateAdmin() {
  const entered = document.getElementById('adminPassword').value;
  const status = document.getElementById('adminStatus');

  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(entered));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if (hashHex === adminHash) {
    isAdmin = true;
    status.textContent = "Mode admin activé (48h)";
    localStorage.setItem('adminActivatedAt', Date.now());
    renderLists();
  } else {
    status.textContent = "Mot de passe incorrect";
  }
}

function checkAdminDuration() {
  const activatedAt = localStorage.getItem('adminActivatedAt');
  if (activatedAt && Date.now() - activatedAt < 48 * 3600 * 1000) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }
}

craftForm.onsubmit = (e) => {
  e.preventDefault();
  const item = document.getElementById('itemName').value;
  const recipe = document.getElementById('itemRecipe').value;
  pendingCrafts.push({ item, recipe });
  saveData();
  craftForm.reset();
  renderLists();
}

checkAdminDuration();
renderLists();
