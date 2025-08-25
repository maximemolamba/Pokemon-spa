# Pokemon-spa

# Pokémon  (Herexamen Web advanced)

## Over dit project
Dit is mijn project voor het herexamen van **Web advanced**.  
Het idee is een kleine webapp (SPA) maken die data toont van de [PokéAPI](https://pokeapi.co/).  
Ik heb gekozen voor Pokémon omdat er veel data beschikbaar is (id, types, gewicht, ...), dus genoeg om de gevraagde functies te doen (zoeken, filteren, sorteren, favorieten, enzovoort).

De app is gebouwd met **Vite** en **JavaScript**.  
Stap voor stap voeg ik meer features toe.  

## Installatie & starten
Dit project draait met **npm**.  
1. Dependencies installeren:  
   bash
   npm install
De server start je met:
npm run dev
npx vite preview

## 2) Data & API

## Data & API
- Dataset: **PokéAPI** — https://pokeapi.co/
- Endpoint: `https://pokeapi.co/api/v2/pokemon?limit={n}` (detail-URL per item uit de lijst)

## Folderstructuur
.
├─ index.html
├─ src/
│  ├─ main.js
│  └─ style.css
├─ docs/
│  └─ ai-chatlog.md
├─ package.json
└─ vite.config.*   (indien aanwezig)


## 4) Features (kort)

## Features
- Tabel (6 kolommen) + **kaarten view** (toggle)
- **Zoeken**, **sorteren**, **filter op type**
- **Favorieten** (★/☆) + **Alleen favorieten**
- **Voorkeuren**: items-per-page, dark mode, view-mode, trainer-naam (persist via localStorage)
- **Form + validatie** (naam/per-page/confirm) + live begroeting
- **Lazy-load** sprites (IntersectionObserver)
- **Responsive** (table-wrap), “Geen resultaten”, aria-live status

## Mapping naar vereisten (waar in de code)
**DOM** — `src/main.js`: `renderTable`, `renderCards`, `renderCurrentView`, `setStatus`
**Events** — `setupSearch`, `setupSort`, `setupTypeFilter`, `setupFavs`, `setupOnlyFavs`, `setupViewToggle`, `setupPerPage`, `setupSettingsForm`
**Modern JS** — `const/let`, arrow functions, template literals (render), array methods (`map/filter/sort/flatMap/some`), ternary (★/☆), callbacks (event handlers/observer)
**Async** — `fetchPokemons` (fetch + `Promise.all`), `init`, refetch in per-page & form
**Observer API** — `setupLazyImages` (IntersectionObserver)
**Data & JSON** — `fetchPokemons` (lijst + detail → JSON → render)
**Opslag & validatie** — `localStorage` (favIds, perPage, theme, viewMode, trainerName) + `setupSettingsForm` (required/min/max/pattern)
**Styling** — `#cards-container` grid, tabelstyles, `.table-wrap` (overflow-x), themaklassen, `.empty`, `.sr-only`
**Tooling** — Vite, gescheiden `html/css/js` in `src/`

## Demo
- Video: **
## Bronnen
- PokéAPI (docs & endpoints)
- Lesmateriaal
- AI-assistent
- https://vite.dev/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript

# AI-gebruik (korte samenvatting)

- Doel: begeleiding (planning, debug), voorbeeldsnippets voor standaard patronen.

## Fragmenten (samengevat)
1) **Filter + sort samen laten werken**
> “Gebruik één `currentList` en render via `applyFilters()`; laat de sort-change de huidige lijst sorteren en daarna renderen.”
Effect: zoek/type/only-favs + sort combineren zonder dubbele renders.

2) **Cards view + toggle**
> “Maak `renderCards(list)` en een centrale `renderCurrentView()` die table/cards toont  op basis van `viewMode`.”
Effect: één renderpad voor beide views → minder bugs.

3) **Lazy-load sprites (Observer)**
> “Zet `src` op een blank gif en de echte URL in `data-src`; laad via `IntersectionObserver` in `setupLazyImages()`.”
Effect: snellere initial load; images laden pas in zicht.

## codevoorbeelden (gebruikt)
// applyFilters (samengevat)
function applyFilters(){
  const q = ..., t = ..., onlyFavs = ...
  let list = allPokemons;
  if (q) list = list.filter(...);
  if (t) list = list.filter(...);
  if (onlyFavs) list = list.filter(pk => favIds.has(pk.id));
  currentList = list;
  renderCurrentView();
}
// renderCurrentView (table/cards)
function renderCurrentView(){
  if (viewMode === 'table'){ ...renderTable(currentList); }
  else { ...renderCards(currentList); }
  queueMicrotask(setupLazyImages);
}
// lazy-load kern
const BLANK_IMG = 'data:image/gif;base64,...';
<img src="${BLANK_IMG}" data-src="${sprite}" class="lazy-img">

Verificatie & verantwoordelijkheid

Ik heb alle code lokaal getest, aangepast en geïntegreerd.

De AI had geen toegang tot mijn repository of runtime.


## fase 1
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

  ## screenshots
  Dark Mode: 
  <img width="1915" height="904" alt="image" src="https://github.com/user-attachments/assets/b7cf441c-6ccc-46d5-bd1e-5f57d11bdf63" />
  zoekfilter: 
  <img width="1918" height="897" alt="image" src="https://github.com/user-attachments/assets/891e4072-e995-4fa1-ac93-c5914ada2493" />
  kaarten: 
<img width="1899" height="898" alt="image" src="https://github.com/user-attachments/assets/17a50722-23e8-490c-a0a8-9f1933d6df7e" />
favorieten + filter: 
<img width="1916" height="898" alt="image" src="https://github.com/user-attachments/assets/b825de82-0dff-49d9-b9ca-00d4e22e2920" />

<img width="1918" height="899" alt="image" src="https://github.com/user-attachments/assets/3ef32484-1f4f-460e-a7b3-bc31f11cdd1c" />




