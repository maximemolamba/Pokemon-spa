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

- ## fase 5 – favorieten
**wat heb ik gedaan**
- extra kolom met ★/☆ per Pokémon
- favorieten bewaard in `localStorage` (Set + helpers)
- event delegation op `tbody` (1 listener)
- checkbox “alleen favorieten” die samenwerkt met search/type/sort

**resultaat**
- ★ blijft na refresh
- met “alleen favorieten” zie je enkel je faves

## fase 6 – kaarten view + toggle
**wat heb ik gedaan**
- view-toggle toegevoegd (`table` ↔ `cards`)
- `renderCards(list)` gemaakt met simpele grid
- centrale `renderCurrentView()` die ofwel tabel ofwel cards toont
- sort/search/type/favs werken ook in cards

**resultaat**
- je kan vlot wisselen tussen tabel en kaarten
- slechts 1 view zichtbaar, alles blijft gefilterd/gesorteerd

## fase 7 – voorkeuren (items-per-page + dark mode + view-mode)

**wat heb ik gedaan**
- **items-per-page** selector (10/20/50) → bewaart keuze in `localStorage` (`perPage`) en doet refetch.
- **dark mode** toggle → zet `body.theme-dark`/`body.theme-light`, bewaart in `localStorage` (`theme`).
- **view-mode** (table/cards) wordt ook onthouden in `localStorage` (`viewMode`).

**resultaat**
- app onthoudt mijn voorkeuren na refresh.
- wisselen van aantal items + thema gebeurt direct, zonder pagina-reload.

## 7.2 – live begroeting (trainerName)
**wat heb ik gedaan**
- In de titel `<h1>` een `<span id="greet-name">` gezet.
- `renderGreeting()` gemaakt: leest `localStorage.trainerName` en toont `– Hi {naam}!`.
- Aangeroepen **na thema** in `init()` én **na submit** van het instellingen-form, dus **geen refresh nodig**.
- Naam zelf wordt opgeslagen via het form.

**resultaat**
- Na opslaan zie je meteen `– Hi Max!` in de titel en het blijft na reload.

## fase 8 – formulier + validatie (instellingen)
**wat heb ik gedaan**
- Instellingen-form toegevoegd met:
  - **Trainer naam** (required, pattern, 3–20 tekens) opslaan in `localStorage.trainerName`
  - **Items per page** (number, min 5, max 100, step 5) synced met per-page select
  - **Bevestigen** checkbox (required)
- Bij submit: validatie → opslaan → feedback “Opgeslagen” → **refetch** met nieuwe `itemsPerPage`
- Live begroeting: `renderGreeting()` toont `– Hi {naam}!` meteen (zonder refresh)

**resultaat**
- Instellingen zijn geverifieerd en blijven na refresh
- Data wordt opnieuw opgehaald met nieuw aantal items

## fase 9 – polish & a11y
**wat heb ik gedaan**
- **“Geen resultaten”** boodschap in tabel + cards wanneer filters leeg lopen
- **aria-live status** (screenreader) voor “Bezig met laden… / fout”
- **Mobiel**: tabel in een `.table-wrap` met horizontale scroll
- **Lazy-load sprites** met IntersectionObserver (performance)

**resultaat**
- Beter UX: duidelijke feedback bij laden/geen data
- Toegankelijker voor screenreaders
- Snellere pagina door lazy-load

