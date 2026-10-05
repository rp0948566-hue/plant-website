# Leaf Herbarium Website — Work Scope (One-Day Game)

> Rule: No backend, no heavy engineering. Frontend showcase only. Minimal details, leaf focus, super first impression.

## 1. Hamare paas kya hai (Ready)
- [x] React + Vite + Tailwind frontend scaffold with Intro animation + inset-shell + HeaderNav
- [x] 8 herbarium sheets (pressed leaf + handwritten details) — Zip 1
- [x] 9 geotag field photos, Velocity Girls Hostel Indore, 03 Oct 2026 — Zip 2
- [x] Research: design patterns (2-color botanical theme) + 8 plants ke 1-liners

## 2. Total kaam — 6 tasks (approx 4–5 hours)

| # | Kaam | Details | Status |
|---|------|---------|--------|
| 1 | Photos setup | 8 herbarium + 9 geotag ko `frontend/public/leaves/` (sheets/ & field/) me copy & mapped | Completed |
| 2 | Data file `src/data/leaves.ts` | 8 entries with full botanical taxonomy, morphology, notes & geotag data | Completed |
| 3 | Hero re-theme | Cinematic botanical hero (`#3F4E49` + `#FAF7F2`), Leaf Herbarium branding, metrics strip & CTAs | Completed |
| 4 | Collection grid + modal | `LeafCollection.tsx` 8 archival cards, click -> dual-tab modal (Sheet vs In-Situ Geotag) + key fields | Completed |
| 5 | Field proof + footer | `FieldProof.tsx` Indore geotags & methodology + `HerbariumFooter.tsx` submission dossier | Completed |
| 6 | Polish + build | Type-safe React 19, responsive layout, `npm run build` passed cleanly | Completed |

Backend: **ZERO kaam** — `backend/` ko haath nahi lagana.

## 3. Tumhe kya dena hai (Teacher ke liye must)
1. Footer ke liye: naam, roll no, class, college name
2. Site title final: `Leaf Herbarium` OK ya kuch aur?
3. Kaunsi 3–4 geotag photos best hai? (default: mai sharp wali chun lunga)

## 4. Out of scope (jaan-boojh ke nahi karenge)
- Login, database, admin panel, upload
- Filtering/search, multi-page routing, blog
- 3D, sound, heavy animation
- Full tree/plant details — sirf leaf minimal

Bolo to Task 1 se start karu?
