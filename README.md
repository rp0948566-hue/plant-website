# Aethera Botanical Archive 🌿

An ultra-luxury botanical web experience engineered with high-precision typography, interactive 3D motion, an **ultra-fast Rust Axum backend**, and **seamless 1-Click Vercel Deployment**.

---

## ⚡ Architecture Highlights

- **Rust High-Performance Core (`backend/`)**:
  - Built with **Axum 0.8** & **Tokio Async Runtime**.
  - **Microsecond In-Memory Serving**: Zero disk I/O latency for botanical specimen metadata.
  - **Transparent Compression**: Brotli & Gzip streaming compression (`tower-http`).
  - **Aggressive Browser Caching**: `Cache-Control: public, max-age=31536000, immutable` headers for instant image rendering.
  - **CORS Permissive**: Pre-configured for Vite dev server and cross-origin access.
  - REST Endpoints: `/api/health`, `/api/specimens`, `/api/works`, `/api/stats`, `/images/*`.

- **Vercel 1-Click Deployment (`vercel.json`)**:
  - Zero-configuration deployment directly from GitHub to Vercel.
  - Root `package.json` and `vercel.json` configured with automatic build triggers.
  - Vercel Serverless Functions (`api/health.ts`, `api/specimens.ts`, `api/works.ts`, `api/stats.ts`) providing native edge parity.
  - Automatic Edge Caching headers on all images, sounds, and assets.
  - Fallback SPA routing (`index.html`) prevents 404s on navigation.

- **Frontend Experience (`frontend/`)**:
  - **Vite + React 18 + TypeScript + Tailwind CSS**.
  - **Lenis Smooth Scroll** with custom momentum physics.
  - **Framer Motion 3D Mechanics**:
    - Floating dynamic top bar with smooth indicator pill animation (`layoutId`).
    - Orbiting Herbarium Specimen Carousel with expandable high-resolution lightbox modal.
    - 3D Kinetic Text Convergence.
    - Works Wheel Portfolio Drum showcasing 9 living botanical field specimens.
  - **Resilient Data Layer (`src/lib/api.ts`)**:
    - Intelligent offline fallback if backend is unreachable.
    - Asynchronous idle preloader (`preloadBotanicalImages`) warms browser cache for instant rendering.

---

## 🚀 1-Click Vercel Deployment

Deploying to Vercel requires **zero manual configuration**:

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), select **"Add New Project"** and import this repository.
3. Keep all settings at their defaults:
   - **Framework Preset**: Vite
   - **Build Command**: `npm --prefix frontend install && npm --prefix frontend run build` *(Pre-configured)*
   - **Output Directory**: `frontend/dist` *(Pre-configured)*
4. Click **Deploy**. Your site and edge APIs are live worldwide in under 60 seconds!

---

## 🦀 Running the Rust Backend (Local / Server / VPS)

The Rust backend is pre-compiled and ready to run:

```bash
# Navigate to backend directory
cd backend

# Run the optimized release binary
cargo run --release

# Server starts on http://localhost:8080 (or your $PORT env variable)
```

Available Rust Endpoints:
- `GET http://localhost:8080/api/health` — Service health & engine diagnostics
- `GET http://localhost:8080/api/specimens` — Archival herbarium specimen records
- `GET http://localhost:8080/api/works` — Living Flora '26 collection
- `GET http://localhost:8080/api/stats` — Real-time performance & cache statistics
- `GET http://localhost:8080/images/*` — Microsecond static image delivery with immutable caching

---

## 💻 Frontend Development

```bash
# From the repository root:
npm run dev

# Or directly inside the frontend:
cd frontend
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 📦 Project Directory Structure

```
├── api/                           # Vercel Serverless Edge API Handlers
│   ├── health.ts
│   ├── specimens.ts
│   ├── works.ts
│   └── stats.ts
├── backend/                       # High-Performance Rust Axum Server
│   ├── Cargo.toml
│   └── src/
│       └── main.rs
├── frontend/                      # React + TypeScript + Vite Application
│   ├── public/
│   │   ├── images/                # Botanical Imagery (IMAGE/, END/, LOGO.png)
│   │   └── sounds/                # Interactive UI Soundscapes
│   ├── src/
│   │   ├── components/            # UI & Hero components
│   │   └── lib/                   # Resilient API & Image Preloader
│   ├── vercel.json                # Frontend-specific Vercel Configuration
│   └── package.json
├── package.json                   # Root Monorepo Orchestration
├── vercel.json                    # Root 1-Click Vercel Configuration
└── README.md
```
