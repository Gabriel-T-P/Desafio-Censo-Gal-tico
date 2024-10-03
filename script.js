const apiUrl = 'https://swapi.dev/api/planets?format=json';
const planetsSection = document.getElementById('planets');

async function fetchData() {
  let response = await fetch(apiUrl);
  let data = await response.json();
  return data.results
}

async function printData() {

  planets = await fetchData()
  planets.forEach(async planet => {

    // Buscando residentes do planeta e adicionando uma promessa para cada 1
    let residents = []
    const residentPromises = planet.residents.map(async (resident) => {
      let response = await fetch(resident);
      let data = await response.json();
      return { name: data.name, birth_year: data.birth_year };
    });

    // Aguarda todas as promessas serem resolvidas
    residents = await Promise.all(residentPromises);

    // Criando divs para as informações
    let newDiv = document.createElement('div');
    newDiv.id = planet.name.toLowerCase() + '_div'
    newDiv.style.display = 'none';
    newDiv.innerHTML = `
  <b>Details about ${planet.name}:</b><br>
  <b>Climate</b> => ${planet.climate}<br>
  <b>Population</b> => ${planet.population}<br>
  <b>Terrain</b> => ${planet.terrain}<br>
  <br>`;

    // Criação da tabela com os residentes
    let table = document.createElement('table');

    let headerRow = document.createElement('tr');
    let nameHeader = document.createElement('th');
    nameHeader.textContent = 'Name';

    let birthYearHeader = document.createElement('th');
    birthYearHeader.textContent = 'Birth Year';

    headerRow.appendChild(nameHeader);
    headerRow.appendChild(birthYearHeader);
    table.appendChild(headerRow);

    residents.forEach(character => {
      let row = document.createElement('tr');

      let nameCell = document.createElement('td');
      nameCell.textContent = character.name;
      let birthYearCell = document.createElement('td');
      birthYearCell.textContent = character.birth_year;

      row.appendChild(nameCell);
      row.appendChild(birthYearCell);

      table.appendChild(row);
    });

    // Somente adiciona tabela se houver habitantes
    if (table.rows.length != 1) { newDiv.appendChild(table); }

    let newButton = document.createElement('button');
    newButton.textContent = planet.name;

    planetsSection.appendChild(newButton);
    planetsSection.appendChild(newDiv);

    newButton.onclick = function () {
      newDiv.style.display = (newDiv.style.display === 'none') ? 'block' : 'none';
    };

  });

}

function cloneDiv() {
  let planetDiv = document.getElementById('planetContainer');
  let value = document.getElementById('search').value;

  let originalDiv = document.getElementById(value.trim().toLowerCase() + '_div');
  let clonedDiv = originalDiv.cloneNode(true);

  planetDiv.innerHTML = '';
  clonedDiv.style.display = 'block'
  planetDiv.appendChild(clonedDiv);
}

window.onload = printData;