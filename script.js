function calculateCraft() {
  const item = document.getElementById('itemSelect').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  let output = '';

  if (item === 'warhead_t1') {
    output += `Warhead T1 x${quantity} :\n`;
    output += `  - Acier compressé : ${16 * quantity} (nécessite ${16 * quantity * 8} charbon et ${16 * quantity * 2} lingots de fer)\n`;
    output += `  - Tin plate : ${16 * quantity} (nécessite ${16 * quantity * 4} lingots de tin)\n`;
    output += `  - TNT : ${16 * quantity} (nécessite ${16 * quantity * 4} sable et ${16 * quantity * 5} poudre à canon)\n`;
    output += `  - Poudre à canon : ${16 * quantity}\n`;
  } else if (item === 'warhead_t2') {
    output += `Warhead T2 x${quantity} :\n`;
    output += `  - Acier compressé : ${16 * quantity} (nécessite ${16 * quantity * 8} charbon et ${16 * quantity * 2} lingots de fer)\n`;
    output += `  - Compressed copper : ${16 * quantity} (nécessite ${16 * quantity * 2} lingots de cuivre)\n`;
    output += `  - Copper plate : ${16 * quantity} (nécessite ${16 * quantity * 4} lingots de cuivre)\n`;
    output += `  - Poudre à canon : ${12 * quantity}\n`;
    output += `  - Warhead T1 : ${5 * quantity}\n`;
  } else if (item === 'warhead_t3') {
    output += `Warhead T3 x${quantity} :\n`;
    output += `  - (détails à compléter)\n`;
  } else if (item === 'conventional_missile') {
    output += `Conventional Missile x${quantity} :\n`;
    output += `  - Plan T1 : ${2 * quantity}\n`;
    output += `  - Warhead T1 : ${2 * quantity}\n`;
    output += `  - Cactus green : ${60 * quantity} (nécessite ${(60 * quantity) / 8} green shrub, ${(60 * quantity) / 8} fioles d'eau et ${(60 * quantity) / 8} redstone)\n`;
    output += `  - Dandelion yellow : ${10 * quantity} (pareil que cactus green mais avec fleur jaune)\n`;
    output += `  - Basic circuit : ${1 * quantity} (4 redstone, 4 comparateurs et 1 steel plate)\n`;
    output += `  - TNT : ${10 * quantity} (nécessite ${10 * quantity * 4} sable et ${10 * quantity * 5} poudre à canon)\n`;
  }

  document.getElementById('results').textContent = output;
}
function downloadExcel() {
  var wb = XLSX.utils.table_to_book(document.getElementById('craftTable'), {sheet:"Craft"});
  XLSX.writeFile(wb, 'Conventional_Missile_Craft.xlsx');
}

function downloadCSV() {
  var wb = XLSX.utils.table_to_book(document.getElementById('craftTable'), {sheet:"Craft"});
  XLSX.writeFile(wb, 'Conventional_Missile_Craft.csv');
}
