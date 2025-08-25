// src/main.js
import './style.css';

// ---------------------------
// Fase1: Pokémon tonen in de tabel
// ---------------------------

// Helper: maak de eerste letter hoofdletter
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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

// 2) Tabel renderen
function renderTable(pokemons) {
  const tbody = document.getElementById("pokemon-tbody");
  if (!tbody) {
    console.error("Geen tbody gevonden met id 'pokemon-tbody'");
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
      <td>${sprite ? `<img src="${sprite}" alt="${cap(pk.name)}" width="48" height="48">` : ""}</td>
      <td>${cap(pk.name)}</td>
      <td>${pk.types.map((t) => t.type.name).join(", ")}</td>
      <td>${pk.height}</td>
      <td>${pk.weight}</td>
    `;

    tbody.appendChild(tr);
  });
}
// Globale cache
let allPokemons = [];

// Zoeken in cache en tabel filteren
function setupSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = q
      ? allPokemons.filter(pk => pk.name.toLowerCase().includes(q))
      : allPokemons;
      currentList = filtered;
      renderTable(filtered);
  });
}
let currentList = []; // wat nu getoond wordt (na search/sort)
// Dit gaat zorgen voor de sorteren van fase 3 dus de..
function setupSort() {
  const sel = document.getElementById('sort-select');
  if (!sel) return;

  const cmp = {
    'id-asc':   (a,b) => a.id - b.id,
    'id-desc':  (a,b) => b.id - a.id,
    'name-asc': (a,b) => a.name.localeCompare(b.name),
    'name-desc':(a,b) => b.name.localeCompare(a.name),
    'weight-asc': (a,b) => a.weight - b.weight,
    'weight-desc':(a,b) => b.weight - a.weight,
  };

  sel.addEventListener('change', () => {
    const sortFn = cmp[sel.value] || cmp['id-asc'];
    const sorted = [...currentList].sort(sortFn); // kopie
    renderTable(sorted);
  });
}
function setupTypeFilter() {
  const sel = document.getElementById('type-filter');
  if (!sel) return;
}

//Startpunt
async function init() {
  const tbody = document.getElementById("pokemon-tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="6">Bezig met laden...</td></tr>`;

  try {
    allPokemons = await fetchPokemons(20);
    currentList = allPokemons;      // ⬅️ init view
    renderTable(currentList);
    setupSearch();
    setupSort();
    console.log("Loaded", currentList.length, "Pokémon");
  } catch (err) {
    console.error("Fout bij ophalen/renderen:", err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">Er ging iets mis.</td></tr>`;
  }
}

init();
