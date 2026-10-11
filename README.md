# Streamflix

React + Vite movie-discovery app with a Vercel serverless TMDB gateway. No accounts: the profile lives in `localStorage`.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set **`TMDB_BEARER_TOKEN`** (TMDB → Settings → API → "API Read Access Token"). `TMDB_API_KEY` (v3 key) works as a fallback.
3. `npm run dev` — the dev server also serves `/api/tmdb` locally (see `vite.config.js`). `vercel dev` works too.

## Deploy to Vercel
1. Push to GitHub and import the repo in Vercel (framework auto-detected: Vite).
2. Project → Settings → Environment Variables → add `TMDB_BEARER_TOKEN` (Production, Preview, Development).
3. Redeploy. Open `/api/tmdb?op=trending` — you should see `{"ok":true,...}`. Without the variable you get a clear `not_configured` error.

Do **not** name the variable `VITE_*`; that would ship it to the browser.

## Structure
- `api/tmdb.js` – allow-listed gateway (`op` = trending, popularMovies, topRatedMovies, upcomingMovies, popularTV, topRatedTV, actionAdventure, scifi, horror, hiddenGems, discover, search, genres, details). Validates every parameter, CDN-caches (`s-maxage`), maps 429/401/404, returns `{ok, data}` or `{ok:false, error}`.
- `src/lib` – API client (+ in-memory cache), localStorage store (safe parsing), hooks, hash router.
- `src/components`, `src/pages` – UI.
- `public/player.html` – player page (`player.html?id=550&type=movie`).

## Playback
TMDB supplies metadata, artwork and trailers only. `player.html` plays a title only if *you* list a source you are licensed to stream in `public/sources.json`:
```json
{ "movie:550": { "kind": "mp4", "url": "https://your-cdn.example/fight-club.mp4" },
  "tv:1399":   { "kind": "embed", "url": "https://your-licensed-player.example/embed/1399" } }
```
Otherwise it shows an "unavailable" state plus the TMDB/YouTube trailer.

## TMDB attribution
The footer shows the required notice. The "TMDB" mark is a text placeholder: before launch, replace it with the official logo from https://www.themoviedb.org/about/logos-attribution and follow their usage rules.

## Storage keys
`streamflix_username`, `streamflix_watchlist`, `streamflix_recent`, `streamflix_fav_genres`, `streamflix_prefs`.
