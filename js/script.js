// Declarando variavéis globais

let userInput = null;
let usersTab = null;
let standingsTab = null;
let searchButton = null;

let onOfbutton = false;

let mapedData = [];
let filteredData = [];

let numberFormat = null;

// Iniciar funções e variáveis ao carregar página

window.addEventListener('load', () => {
  userInput = document.querySelector('#userInput');
  usersTab = document.querySelector('#users-tab');
  standingsTab = document.querySelector('#standings-tab');
  searchButton = document.querySelector('#search-button');
  numberFormat = Intl.NumberFormat('pt-BR');
  fetchData();
  activateInput();
  preventSubmit();
  defaultState();
  clearInput();
});

// Coletando dados da API e usando método map
// para reduzir aos dados ao que serão usado na aplicação

async function fetchData() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  mapedData = json.results.map((person) => {
    const { name, picture, dob, gender } = person;
    return {
      name: name.first + ' ' + name.last,
      picture: picture.medium,
      age: dob.age,
      gender: gender,
    };
  });
  mapedData.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

// Manipulação de dados

function filterData() {
  userInputValue = userInput.value.toLowerCase();
  filteredData = mapedData.filter((user) => {
    return user.name.toLowerCase().includes(userInputValue);
  });
  if (filteredData.length === 0) {
    defaultState();
  } else {
    render();
  }
}

function totalFemale(users) {
  return users.filter((woman) => {
    return woman.gender == 'female';
  }).length;
}
function totalMale(users) {
  return users.filter((man) => {
    return man.gender == 'male';
  }).length;
}

function sumAges(users) {
  return users.reduce((acc, cur) => {
    return acc + cur.age;
  }, 0);
}
function totalUsers(users) {
  return users.length;
}

// ** Manipulação do DOM **

// Inputs

function preventSubmit() {
  function handleSubmit(event) {
    event.preventDefault();
  }
  searchButton.addEventListener('submit', handleSubmit);
}

function activateInput() {
  function handleTyping(event) {
    let hasText = !!event.target.value && event.target.value.trim() !== '';
    if (!hasText) {
      clearInput();
      return;
    }
    if (event.key === 'Enter') {
      filterData();
      clearInput();
    }
  }
  function submitButton(event) {
    onOfbutton = true;
    if ((onOfbutton = true)) {
      filterData();
      clearInput();
    }
    onOfbutton = false;
  }
  searchButton.addEventListener('click', submitButton);
  userInput.addEventListener('keyup', handleTyping);
}

// Renderização

function render() {
  renderUsersList();
  renderStandingsList();
  userInput.focus();
}

function renderUsersList() {
  let usersListHTMl = `<div>`;
  filteredData.forEach((users) => {
    const { picture, name, age, gender } = users;
    const user = `
      <div id = 'nameAge'>
        <p><img src = '${picture}'> ${name}, ${age}</p>
      </div>
    `;
    usersListHTMl += user;
  });
  usersListHTMl += `</div>`;
  usersTab.innerHTML = `
      <div>
        <h3>${totalUsers(filteredData)} usuário(s) encontrado(s)</h3>
        <ul>
          <li> ${usersListHTMl}</li>
        </ul>
      </div>
      `;
}

function renderStandingsList() {
  let standingsHTML = `
    <div>
      <h3>Estatísticas:</h3>
      <ul>
        <li>O total de mulheres é de: ${totalFemale(filteredData)}</li>
        <li>O total de homens é de: ${totalMale(filteredData)}</li>
        <li>A soma das idades é de: ${sumAges(filteredData)}</li>
        <li>A média das idades é de: ${(
          sumAges(filteredData) / filteredData.length
        ).toFixed(2)}</li>
      </ul>
    </div>
    `;
  standingsTab.innerHTML = standingsHTML;
}

function defaultState() {
  usersTab.innerHTML = `<h3>Nenhum usuário filtrado</h3>`;
  standingsTab.innerHTML = `<h3>Nada a ser exibido</h3>`;
}

const clearInput = () => {
  userInput.value = '';
  userInput.focus();
};
