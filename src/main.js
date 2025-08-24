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
// Voer de init-functie uit wanneer de app start
init();