// In deze stap haal ik enkel de *lijst* op van Pokémon namen + URLs (10 stuks).
// Nog geen weergave in de tabel: dit dient puur om te testen
// of mijn project correct kan praten met de PokéAPI.

//Asynchrone functie om de lijst van Pokémon op te halen
async function fetchPokemonList(limit = 10) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  // Controleer of de response succesvol was (status 200–299)
  // Zo niet, geef een foutmelding

  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
   // Zet de response om naar JSON-formaat
  const data = await res.json();
    // Geef enkel de array van resultaten terug
  return data.results;
}
// Init-functie = startplaats van dit script
// Doel: de fetch uitvoeren en het resultaat tonen in de console
async function init() {
  console.log("Loading Pokémon list...");
  try {
  // Roep de fetch-functie aan en wacht op de resultaten
    const list = await fetchPokemonList(10);
    
  // Toon de lijst zodat ik de structuur van de data kan bestuderen
    console.log("Fetched Pokémon list:", list);
  } catch (err) {
   // Indien er iets foutloopt, toon de foutmelding in de consol
    console.error("Error while fetching Pokémon list:", err);
  }
}
// In deze stap ga ik naast de namen ook de *details* van elke Pokémon ophalen.
// Dit doe ik via parallelle fetches: meerdere requests tegelijk uitvoeren
// Kleine helperfunctie: eerste letter hoofdletter maken
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Functie om 10 Pokémon op te halen + hun details
async function fetchPokemons(limit = 10) {
  // Stap 1: lijst met namen en urls ophalen
  const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!listRes.ok) throw new Error("Kon de lijst niet ophalen");
  const listData = await listRes.json();
  // Stap 2: voor elke Pokémon url de details ophalen (parallel)
  const detailPromises = listData.results.map(async (p) => {
    const res = await fetch(p.url);
    if (!res.ok) throw new Error(`Kon ${p.name} niet ophalen`);
    return res.json(); // Geef detaildata terug
  });

  // Promise.all wacht tot alle requests klaar zijn en bundelt de resultaten
  return Promise.all(detailPromises);
}

// Init-functie: startpunt van de app
async function init() {
  console.log("Bezig met laden van Pokémon details...");
  try {
    const pokemons = await fetchPokemons(10);

    // Log alle details naar de console zodat ik de structuur kan zien
       renderTable(pokemons);
    // Toon als test de eerste Pokémon naam in de console
    console.log("Eerste Pokémon:", cap(pokemons[0].name));

  } 
  catch (err) {
    console.error("Fout bij ophalen Pokémon details:", err);
  }
}
// Functie om de tabel te vullen met rijen
function renderTable(pokemons) {
  const tbody = document.getElementById("pokemon-tbody");
  if (!tbody) return;

  // Maak eerst de tabel leeg
  tbody.innerHTML = "";

  pokemons.forEach((pk) => {
    const tr = document.createElement("tr");

    const sprite =
      pk?.sprites?.other?.["official-artwork"]?.front_default ||
      pk?.sprites?.front_default ||
      "";

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
// Start de app
init();
