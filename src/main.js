// src/main.js
import './style.css';

// ---------------------------
// Fase1: Pokémon tonen in de tabel
// ---------------------------

// Helper: maak de eerste letter hoofdletter
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// 1) Data ophalen (lijst + details)
async function fetchPokemons(limit = 20) {
  // Lijst ophalen
  const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!listRes.ok) throw new Error("Kon de lijst niet ophalen");
  const listData = await listRes.json();

  // Details per item (parallel)
  const detailPromises = listData.results.map(async (p) => {
    const res = await fetch(p.url);
    if (!res.ok) throw new Error(`Kon ${p.name} niet ophalen`);
    return res.json();
  });

  return Promise.all(detailPromises);
}

// Deze functie zorgt ervoor dat alle Pokémon netjes in de tabel verschijnen.
// dit is gewoon de renderfunctie die mijn data uit de API omzet naar een tabel met minstens 6 kolommen
function renderTable(pokemons) {
  const tbody = document.getElementById("pokemon-tbody");
  if (!tbody) {
    console.error("Geen tbody gevonden met id 'pokemon-tbody'");
    return;
  }

  if (!pokemons.length) {
  tbody.innerHTML = `<tr><td colspan="7">Geen resultaten</td></tr>`;
  return;
}
  tbody.innerHTML = ""; // leegmaken

  pokemons.forEach((pk) => {
    const tr = document.createElement("tr");

    const sprite =
      pk?.sprites?.other?.["official-artwork"]?.front_default ||
      pk?.sprites?.front_default || "";

    tr.innerHTML = `
      <td>${pk.id}</td>
      <td>${sprite ? `<img loading="lazy" src="${BLANK_IMG}" data-src="${sprite}" alt="${cap(pk.name)}" width="48" height="48" class="lazy-img">` : ""}</td>
      <td>${cap(pk.name)}</td>
      <td>${pk.types.map((t) => t.type.name).join(", ")}</td>
      <td>${pk.height}</td>
      <td>${pk.weight}</td>
      <td><button class="fav-btn" data-id="${pk.id}">${favIds.has(pk.id) ? '★' : '☆'}</button></td>
    `;

    tbody.appendChild(tr);
  });
}
// Globale cache
// hierin komen alle pokemons
let allPokemons = [];
// favotieten uit locale storage laden of lege weergave als er niks is
let favIds = new Set(JSON.parse(localStorage.getItem('favIds') || '[]'));
// favorieten opslaan in local storage
const saveFavs = () => localStorage.setItem('favIds', JSON.stringify([...favIds]));
// favoriet toevoegen/verwijderen en direct opslaan
const toggleFav = (id) => { favIds.has(id) ? favIds.delete(id) : favIds.add(id); saveFavs(); };

// Zoeken in cache en tabel filteren
function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

   input.addEventListener('input', () => { applyFilters();
  });
}
let currentList = []; // wat nu getoond wordt (na search/sort)
// Dit gaat zorgen voor de sorteren van fase 3

function setupSort() {
  const sel = document.getElementById('sort-select'); // pak de dropdown (select)
  if (!sel) return; // als die er niet is stop gewoon

  // object met sorteerfuncties voor id, naam en gewicht
  const cmp = {
    'id-asc':   (a,b) => a.id - b.id,
    'id-desc':  (a,b) => b.id - a.id,
    'name-asc': (a,b) => a.name.localeCompare(b.name),
    'name-desc':(a,b) => b.name.localeCompare(a.name),
    'weight-asc': (a,b) => a.weight - b.weight,
    'weight-desc':(a,b) => b.weight - a.weight,
  };
  // elke keer als de selectie verandert → sorteer lijst en render opnieuw
  sel.addEventListener('change', () => {
    const sortFn = cmp[sel.value] || cmp['id-asc']; // pak juiste sorteerfunctie
    currentList = [...currentList].sort(sortFn); // maak nieuwe gesorteerde lijst
    renderCurrentView();  // toon de nieuwe lijst
  });
}
// pak de dropdown voor type-filter en als die er niet is stopt die hier ook
function setupTypeFilter() {
  const sel = document.getElementById('type-filter');
  if (!sel) return;

  // dropdown vullen met alle unieke types uit de Pokémon-lijst
    sel.length = 1; // reset dropdown
    const types = [...new Set(allPokemons.flatMap(pk => pk.types.map(t => t.type.name)))].sort();
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    sel.appendChild(opt);
  });

  // één change-listener
  sel.addEventListener('change', applyFilters) 
  }; //

//Zorgt dat de favorietenknoppen werken in zowel de tabel als kaartweergave
function setupFavs() {
  const tbody = document.getElementById('pokemon-tbody');
  const cards = document.getElementById('cards-container');
  
  const handler = (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    toggleFav(Number(btn.dataset.id));
    applyFilters(); // toont lijst opnieuw met huidige view en filters
  };
   // eventlistener koppelen op zowel tabel- als kaartweergave
  if (tbody) tbody.addEventListener('click', handler);
  if (cards) cards.addEventListener('click', handler);
}
// Hier pas ik alle filters toe: zoeken op naam, filteren op type en/of enkel favorieten tonen. 
// Het resultaat is een gefilterde lijst Pokémon die later in de view wordt weergegeven.
function applyFilters() {
  const q = (document.getElementById('search-input')?.value || '').toLowerCase();
  const t = document.getElementById('type-filter')?.value || '';
  const onlyFavs = document.getElementById('only-favs')?.checked || false;

  let list = allPokemons;
  if (q) list = list.filter(pk => pk.name.toLowerCase().includes(q));
  if (t) list = list.filter(pk => pk.types.some(x => x.type.name === t));
  if (onlyFavs) list = list.filter(pk => favIds.has(pk.id));

  currentList = list;
  renderCurrentView();

  const sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.dispatchEvent(new Event('change'));

}

function setupOnlyFavs() {
  const cb = document.getElementById('only-favs'); // checkbox alleen favorieten
  if (!cb) return;
  cb.addEventListener('change', applyFilters); // telekns opnieuw filteren bij aan/uit
}
let viewMode = 'table'; // bewaart huidige view tabel of kaarten

function renderCards(list) {
  const wrap = document.getElementById('cards-container');
  if (!wrap) return;
  wrap.innerHTML = '';
  // toon lege boodschap als er geen resultaten zijn
  if (!list.length) {
  wrap.innerHTML = `<div class="empty">Geen resultaten</div>`;
  return;
}

// voor elke Pokémon een kaart maken met info + sprite + fav-knop
  list.forEach(pk => {
    const sprite =
      pk?.sprites?.other?.["official-artwork"]?.front_default ||
      pk?.sprites?.front_default || "";

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">#${pk.id} — ${cap(pk.name)}</div>
      ${sprite ? `<img loading="lazy" src="${BLANK_IMG}" data-src="${sprite}" alt="${cap(pk.name)}" class="lazy-img">` : ''}
      <div class="meta">${pk.types.map(t => t.type.name).join(', ')}</div>
      <div class="meta">H: ${pk.height} • W: ${pk.weight}</div>
      <button class="fav-btn" data-id="${pk.id}">${favIds.has(pk.id) ? '★' : '☆'}</button>
    `;
    wrap.appendChild(card);
  });
}
// Deze functie kiest welke view getoond wordt: tabel of kaarten. 
// Op basis van viewMode wordt één van de twee zichtbaar gemaakt en gevuld met de gefilterde lijst.
function renderCurrentView() {
  const table = document.getElementById('pokemon-table');
  const cards = document.getElementById('cards-container');
  if (!table || !cards) return;

  if (viewMode === 'table') {
    table.hidden = false;
    cards.hidden = true;
    renderTable(currentList);
  } else {
    table.hidden = true;
    cards.hidden = false;
    renderCards(currentList);
  }

  // altijd NA het renderen (voor beide views)
  queueMicrotask(setupLazyImages); // of: setTimeout(setupLazyImages, 0)
}

//Deze functie zorgt dat de gebruiker kan schakelen tussen tabel en kaartweergave via een dropdown. 
//De keuze wordt bewaard in localStorage zodat de voorkeur bij herladen onthouden wordt
function setupViewToggle() {
  const sel = document.getElementById('view-select');
  if (!sel) return;
  sel.addEventListener('change', () => {
    viewMode = sel.value; // 'table' | 'cards'
    localStorage.setItem('viewMode', viewMode);
    renderCurrentView();
  });
}

let itemsPerPage = Number(localStorage.getItem('perPage') || 20); // aantal pokemons per pagina
// Met deze functie kan de gebruiker kiezen hoeveel Pokémon tegelijk geladen worden (bv. 20, 50, 100). 
// De keuze wordt onthouden in localStorage. Bij verandering wordt nieuwe data opgehaald en meteen de filters toegepast.
function setupPerPage() {
  const sel = document.getElementById('per-page');
  if (!sel) return;
  sel.value = String(itemsPerPage);

  sel.addEventListener('change', async () => {
    itemsPerPage = Number(sel.value);
    localStorage.setItem('perPage', String(itemsPerPage));

    const tbody = document.getElementById('pokemon-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="7">Bezig met laden...</td></tr>`;

    allPokemons = await fetchPokemons(itemsPerPage);
    currentList = allPokemons;
    applyFilters(); 
  });
}
// zet body class op dark of light theme
function applyTheme(t) {
  document.body.classList.toggle('theme-dark', t === 'dark');
  document.body.classList.toggle('theme-light', t === 'light');
}

function setupTheme() {
  const cb = document.getElementById('theme-toggle'); // checkbox of switch voor theme
  const saved = localStorage.getItem('theme') || 'light'; // opgeslagen voorkeur (default light)
  applyTheme(saved);
  if (cb) { // sync checkbox met opgeslagen theme
    cb.checked = (saved === 'dark');
    cb.addEventListener('change', () => {
      const t = cb.checked ? 'dark' : 'light';
      localStorage.setItem('theme', t);
      applyTheme(t);
    });
  }
}

// Dit stuk bereidt het instellingenformulier voor: alle inputvelden, foutmeldingen en succesbericht worden opgehaald. In de volgende code 
//  komt de echte validatie en opslag van de instellingen
function setupSettingsForm() {
  const form = document.getElementById('settings-form');
  if (!form) return;

  const nameInp = document.getElementById('trainer-name');
  const perInp  = document.getElementById('form-per-page');
  const accCb   = document.getElementById('accept');
  const okMsg   = document.getElementById('form-ok');
  const errName = document.getElementById('err-name');
  const errPer  = document.getElementById('err-perpage');
  const errAcc  = document.getElementById('err-accept');

  // init waarden
  // // vooraf ingevulde waarden laden uit localStorage of defaults
  if (nameInp) nameInp.value = localStorage.getItem('trainerName') || '';
  if (perInp)  perInp.value  = String(itemsPerPage);

  // 
// helpers om foutmeldingen te tonen/verbergen
  const hide = el => el && (el.hidden = true);
  const show = el => el && (el.hidden = false);
  // formulier afhandelen bij submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
     // validatie van velden: toon foutmeldingen indien ongeldig
    if (!nameInp.checkValidity()) { show(errName); valid = false; } else hide(errName);
    if (!perInp.checkValidity())  { show(errPer);  valid = false; } else hide(errPer);
    if (!accCb.checked)           { show(errAcc);  valid = false; } else hide(errAcc);

    if (!valid) return; // stop als iets niet klopt

    // opslaan
    localStorage.setItem('trainerName', nameInp.value.trim());
    renderGreeting();
    itemsPerPage = Number(perInp.value);
    localStorage.setItem('perPage', String(itemsPerPage));

    // UI sync met bestaande select
    const selPer = document.getElementById('per-page');
    if (selPer) selPer.value = String(itemsPerPage);

    // feedback
    okMsg.hidden = false;
    setTimeout(() => { okMsg.hidden = true; }, 1500);
    // herladen data
    const tbody = document.getElementById('pokemon-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="7">Bezig met laden...</td></tr>`;
    allPokemons = await fetchPokemons(itemsPerPage);
    currentList = allPokemons;
    applyFilters();
  });
}
//Deze functie laat een persoonlijke begroeting zien bovenaan de pagina. 
//Als de gebruiker zijn naam in het instellingenformulier invult, wordt die opgeslagen en hier weergegeven als “Hi [naam]!”.
function renderGreeting(){
  const el = document.getElementById('greet-name');
  if (!el) return;
  const name = localStorage.getItem('trainerName') || '';
  el.textContent = name ? `– Hi ${name}!` : '';
}
// roepen na setupSettingsForm() en in init() na setupTheme():
renderGreeting();

let imgObserver;
function setupLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  // fallback zonder Observer
  if (!('IntersectionObserver' in window)) {
    imgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    return;
  }

  if (imgObserver) imgObserver.disconnect();
  imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.removeAttribute('data-src');
      obs.unobserve(img);
    });
  }, { root: null, rootMargin: '300px 0px', threshold: 0.01 });

  imgs.forEach(img => imgObserver.observe(img));
}

function setStatus(msg){ const el=document.getElementById('status'); if(el) el.textContent = msg || ''; }

//Startpunt
//“De init() functie start de app: ze haalt de Pokémon-data op, zet de juiste view, 
// activeert alle functies zoals zoeken en sorteren, en toont alles in de UI met statusmeldingen.”
async function init() {
  const tbody = document.getElementById("pokemon-tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="7">Bezig met laden...</td></tr>`;
  setStatus('Bezig met laden...');
  try {
    allPokemons = await fetchPokemons(itemsPerPage);
    currentList = allPokemons;      // ⬅️ init view
    const selView = document.getElementById('view-select');
    if (selView) viewMode = selView.value; // 'table' of 'cards'
    const savedView = localStorage.getItem('viewMode');
if (savedView) {
  viewMode = savedView;
  const vs = document.getElementById('view-select');
  if (vs) vs.value = viewMode;
}
    renderCurrentView();
    setupSearch();
    setupSort();
    setupTypeFilter();
    setupOnlyFavs();
    setupFavs();   
    setupViewToggle();  
    setupPerPage();  
    setupTheme();  
    renderGreeting();
    setupSettingsForm();
    
    setStatus(''); 
    console.log("Loaded", currentList.length, "Pokémon");
  } catch (err) {
    console.error("Fout bij ophalen/renderen:", err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="7">Er ging iets mis.</td></tr>`;
    setStatus('Er ging iets mis.'); 
  }
}

init();
