# Base44 Dev Environment

## What this project is
A static HTML/CSS/JS marketing site ("Clairo Care") for a self-direction caregiving service. No build step, no backend, no package manager, no external credentials.

## How it runs
Served as static files by `nginx:alpine` via `docker-compose.base44.yml`, exposed on host port 3000. The repo root is bind-mounted read-only into the nginx document root, so edits to HTML/CSS/JS appear immediately on refresh (no rebuild, no reload needed).

## Key files
- `index.html` — home page (formerly `Clairo Site Wireframe.dc.html`).
- `About.dc.html` — About page.
- `Wages and Benefits.dc.html` — SDS details page.
- `matchmaker-map.html` — standalone Leaflet map demo (loads Leaflet from CDN).
- `support.js` — dc-runtime bundle that interprets the `<x-dc>` markup and design-system components.
- `_ds/clairo-care-design-system-*/` — design system tokens (CSS) and component bundle (`_ds_bundle.js`).
- `assets/` — images (faces, hero photos, logos).
- `uploads/` — source backups / reference PDFs, not part of the live site.

## Notes / gotchas
- The git history renamed `Clairo Site Wireframe.dc.html` → `index.html`. Nav links across the active pages were updated to point to `index.html`; the copies under `uploads/` still reference the old name (left as-is, they're backups).
- No secrets required to boot.

## Verify it works
`docker compose -f docker-compose.base44.yml up -d`, then `curl -sf http://localhost:3000/` should return the home page HTML. Pages: `/` (home), `/About.dc.html`, `/Wages%20and%20Benefits.dc.html`, `/matchmaker-map.html`.
