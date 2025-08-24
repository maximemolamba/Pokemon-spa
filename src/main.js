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

// 3) Startpunt
async function init() {
  // optioneel: zet tijdelijk "Loading..." in de tabel
  const tbody = document.getElementById("pokemon-tbody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="6">Bezig met laden...</td></tr>`;

  try {
    const pokemons = await fetchPokemons(20);
    renderTable(pokemons);
    console.log("Loaded", pokemons.length, "Pokémon"); // debug
  } catch (err) {
    console.error("Fout bij ophalen/renderen:", err);
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">Er ging iets mis.</td></tr>`;
  }
}

init();
