async function fetchPokemonList(limit = 10) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  const data = await res.json();
  return data.results;
}

async function init() {
  console.log("Loading Pokémon list...");
  try {
    const list = await fetchPokemonList(10);
    console.log("Fetched Pokémon list:", list);
  } catch (err) {
    console.error("Error while fetching Pokémon list:", err);
  }
}

init();