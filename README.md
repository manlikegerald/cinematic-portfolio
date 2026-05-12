# Cinematic Personal Portfolio

A cinematic portfolio built with **React + FastAPI**, mirroring the motion language and aesthetic system of [landonorris.com](https://landonorris.com) — adapted for a personal brand.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + CSS variable design-token layer |
| Animation | GSAP + ScrollTrigger, Framer Motion, Lenis |
| Backend | FastAPI + Uvicorn |
| Database | SQLite (local) → Postgres (prod) via `DATABASE_URL` |
| ORM | SQLAlchemy 2.0 async |

---

## One-command setup

```bash
# Terminal 1 — backend
cd backend
uv sync
uv run python scripts/seed_db.py
uv run uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Or use the Makefile from the repo root:

```bash
make seed   # seed the database
make dev    # start both servers (requires two terminals or tmux)
```

Open [http://localhost:5173](http://localhost:5173).

---

## Folder tour

```
portfolio/
├── frontend/src/
│   ├── config/
│   │   ├── site.ts        ← name, tagline, socials, nav — ONE source of truth
│   │   └── theme.ts       ← font families, accent color, animation intensity
│   ├── styles/
│   │   ├── tokens.css     ← CSS variables (:root) — change accent/dark here
│   │   ├── reset.css
│   │   └── globals.css    ← typography classes, container, font imports
│   ├── components/
│   │   ├── primitives/    ← SplitText, HighlightLine, MarqueeRow, MagneticButton, ArrowButton, ScrollBar
│   │   ├── layout/        ← Nav, Footer, PageWrapper, SmoothScrollProvider
│   │   └── sections/      ← Hero, HorizontalScroll, OnOffSplit, ProjectGrid, ContactBlock, Section
│   ├── pages/             ← Home, Work, WorkDetail, About, Contact, DevPrimitives
│   ├── hooks/             ← useGsapContext, useReveal, useCursor
│   └── lib/api.ts         ← typed fetch wrappers for all backend endpoints
├── backend/
│   ├── app/               ← FastAPI app, routers, models, schemas
│   ├── seed/              ← profile.json, projects.json, timeline.json
│   └── scripts/seed_db.py ← re-seed without touching the DB schema
└── Makefile
```

---

## How to customise

### Change your name, tagline, socials
Edit **`frontend/src/config/site.ts`** — every component reads from here.

### Change colors
1. Edit `--color--accent` and `--color--dark` in **`frontend/src/styles/tokens.css`**.
2. Update `accent` and `dark` in **`frontend/src/config/theme.ts`** to match.

That's it — the whole site re-themes.

### Change the display font
1. In `frontend/src/styles/globals.css`, update the Google Fonts import URL.
2. In `frontend/src/styles/tokens.css`, update `--font--display`.
3. In `frontend/src/config/theme.ts`, update `fonts.display`.

### Add a project
1. Add an entry to `backend/seed/projects.json` following the existing structure.
2. Drop a cover image in `frontend/public/images/projects/`.
3. Run `make seed` (or `cd backend && uv run python scripts/seed_db.py`).

### Add a new section
1. Create `frontend/src/components/sections/MySection.tsx`.
2. Wrap it in `<Section theme="dark|light|accent">` to get the scroll-triggered theme flip.
3. Import and place it in the page.

### Adjust animation intensity
Set `animIntensity` in `frontend/src/config/theme.ts` — 1 is default, 0 disables all GSAP tweens.

---

## Animation primitives (`/dev/primitives`)

Visit [http://localhost:5173/dev/primitives](http://localhost:5173/dev/primitives) to see each primitive in isolation:

| Component | Effect |
|-----------|--------|
| `<SplitText>` | Line/char splitting with clip-path or translateY reveals |
| `<HighlightLine>` | Accent block wipes across text on scroll or hover |
| `<MarqueeRow>` | Infinite CSS marquee with scroll-velocity speed boost |
| `<MagneticButton>` | Button drifts toward cursor via Framer Motion spring |
| `<ArrowButton>` | Circular CTA — SVG arrow rotates 45° on hover |

---

## Deploy

### Frontend → Vercel
```bash
cd frontend && npm run build
# Push to GitHub → connect to Vercel → set VITE_API_BASE to your backend URL
```

### Backend → Fly.io
```bash
cd backend
fly launch   # follow prompts
fly deploy
# Set DATABASE_URL secret to a Postgres URL:
fly secrets set DATABASE_URL=postgres://...
```

### Backend → Railway
1. Connect your GitHub repo.
2. Set `DATABASE_URL` in environment variables.
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## Replace `[PLACEHOLDER]` content

Search the whole codebase for `[PLACEHOLDER]` — every instance marks something that needs your real content:

```bash
grep -r "\[PLACEHOLDER\]" --include="*.json" --include="*.ts" --include="*.tsx" .
```

The `{{VARIABLE}}` tokens in `site.ts` and the seed JSON files are the critical ones. Fill those first and run `make seed`.
