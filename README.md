# Pokemon-spa

# Pokémon  (Herexamen Web advanced)

## Over dit project
Dit is mijn project voor het herexamen van **Web advanced**.  
Het idee is een kleine webapp (SPA) maken die data toont van de [PokéAPI](https://pokeapi.co/).  
Ik heb gekozen voor Pokémon omdat er veel data beschikbaar is (id, types, gewicht, ...), dus genoeg om de gevraagde functies te doen (zoeken, filteren, sorteren, favorieten, enzovoort).

De app is gebouwd met **Vite** en **JavaScript**.  
Stap voor stap voeg ik meer features toe.  

## Ik ben begonnen met
- Eerste versie met een tabel die **20 Pokémon** laat zien  
- Tabel toont **6 kolommen**: ID, Sprite, Naam, Types, Height en Weight  
- Basis CSS styling voor de tabel  
- Oude testcode en attributen uit HTML opgeruimd

 ## Resultaat
- De tabel toont nu 20 Pokémon correct
- Ik heb getest in de browser: sprites laden goed, namen en types kloppen
- Eerst waren er wat fouten (bv. oude code en HTML attributen), maar die heb ik verwijderd en verbeterd
- Commit gemaakt om dit op GitHub te zetten

## Installatie & starten
Dit project draait met **npm**.  
1. Dependencies installeren:  
   bash
   npm install
De server start je met:
npm run dev

## Fase 2: Zoekfunctie

### Wat heb ik gedaan
- Zoekveld toegevoegd boven de tabel.
- Lijst lokaal gecachet (`allPokemons`) en live gefilterd op naam bij elke toetsaanslag.
- Tabel her-renderen met gefilterde resultaten.

### Resultaat
- Zoeken werkt direct (zonder refresh).
- Performance is ok voor 20+ items.
- Commit: `feat(search): live zoekfunctie op naam (filtert tabel)`


## Fase 3: Sorteren

### Wat heb ik gedaan
- Dropdown toegevoegd om te sorteren op **ID**, **Naam**, **Gewicht** (↑/↓).
- `currentList` ingevoerd zodat zoeken + sorteren samen werken.
- Comparators met `localeCompare` en numerieke sort.

### Resultaat
- Lijst kan live gesorteerd worden zonder reload.
- Werkt ook na een zoekopdracht.

## Fase 4: Filter op type
### Wat heb ik gedaan
- Dropdown toegevoegd en automatisch gevuld met unieke types uit de dataset.
- Filter combineert met zoekfunctie en behoudt sortering dat er al is.
### Resultaat
- Snel filteren op bv. `fire`, `water`, …
- Werkt samen met search + sort.

