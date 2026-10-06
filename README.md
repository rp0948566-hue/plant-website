# Leaf Herbarium — Botanical Fieldwork & Preservation Archive

A single-page academic showcase of 8 hand-pressed angiosperm leaf specimens,
with geotagged in-situ field evidence from Scheme No 114, Indore (M.P.).

- **Frontend only** (`frontend/` — React + Vite + Tailwind): hero, 8-specimen
  collection grid with inspection modal, field-evidence strip, submission footer.
- Specimen photos: `frontend/public/leaves/sheets/` (pressed sheets),
  `frontend/public/leaves/field/` (geotagged field photos).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173/`.

## Deploy (Vercel, zero config)

Import this repo in the Vercel dashboard with defaults
(build: frontend install + build, output: `frontend/dist`).
