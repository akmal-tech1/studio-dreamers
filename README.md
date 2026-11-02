# Studio Dreamers Pictures

A cinematic, production-ready website for an independent film production house.
React + Vite + Tailwind CSS frontend, FastAPI + SQLAlchemy backend, SQLite database,
JWT authentication — cinematic black/red branding throughout.

![stack](https://img.shields.io/badge/stack-React%2019%20%2B%20FastAPI%20%2B%20Tailwind%20v4-ff0033)

---

## Quick Start

### 1. Backend (FastAPI)

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1        # if blocked: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
pip install -r requirements.txt
# optional: copy .env.example to .env and set SECRET_KEY
uvicorn main:app --reload
```

API docs (interactive Swagger): http://localhost:8000/docs

### 2. Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

Site: http://localhost:5173 (the Vite dev server proxies `/api` to the backend
automatically — no config needed. To point at a remote API instead, set
`VITE_API_URL` in `frontend/.env`.)

### 3. Verify

- Run the API test suite: `cd backend && pytest tests`
- Register a user at `/auth`, browse `/films`, and visit `/store`.

---

## Project Structure

```
StudioDreamersPictures/
├── backend/
│   ├── main.py              # FastAPI app, CORS, lifespan DB init + seed
│   ├── database.py          # SQLAlchemy engine/session (SQLite, override via DATABASE_URL)
│   ├── models.py            # Users, Films, TeamMembers, Products, Orders, OrderItems
│   ├── schemas.py           # Pydantic request/response models
│   ├── auth.py              # bcrypt hashing + JWT (python-jose)
│   ├── seed.py              # Demo catalog: 4 films, 8 crew members, 2 store products
│   ├── routers/
│   │   ├── auth.py          # POST /api/auth/register | login   GET /api/auth/me
│   │   ├── films.py         # GET /api/films, /api/films/categories, /api/films/{id}
│   │   ├── team.py          # GET /api/team
│   │   ├── store.py         # GET /api/store/products  POST /api/store/checkout (JWT)
│   │   └── stats.py         # GET /api/stats (real DB aggregates)
│   └── tests/test_api.py    # API smoke tests (pytest)
└── frontend/
    └── src/
        ├── api/client.js        # typed fetch wrapper + token injection
        ├── context/AuthContext.jsx
        ├── components/          # Navbar, Footer, Logo, FilmCard, AuthForm/Modal, Reveal...
        └── pages/               # Home, Films, FilmDetail, Store, About, AuthPage, NotFound
```

## Features

- **Landing page** — full-screen cinematic video hero with auto-rotating film
  carousel, animated stat counters (real DB aggregates), featured-projects rail,
  genre marquee, studio teaser, CTA banner.
- **Films catalog** — category filters served from the API, poster cards with
  hover states, loading skeletons, error handling.
- **Film detail / trailer page** — video player, synopsis, release metadata,
  director's note, related films.
- **Store** — behind-the-scenes art book and director commentary, cart drawer
  with quantity controls, JWT-protected checkout, order confirmation (demo — no real payments).
- **About & team** — story, values, quote banner, crew grid from the API.
- **Auth** — JWT register/login (bcrypt-hashed), global modal + dedicated page,
  protected checkout, persistent sessions via localStorage.

## Branding

- Background `#0a0a0a`, white typography, accent `#ff0033`.
- Fonts: Bebas Neue (display) + Inter (body) via Google Fonts.

### Swapping in your real logo

The site logo and favicon use `frontend/public/logo.png`. Replace that file to
update the branding image.

## Notes

- All films, people, and products are fictional demonstration data (seeded on
  first startup into `backend/studio_dreamers.db`).
- Sample trailer/hero clips are served from Google's public sample-video bucket;
  posters/headshots use picsum.photos placeholders. Replace with real media URLs
  in `backend/seed.py` for production.
- Never commit `.env`, `venv/`, `node_modules/`, or `*.db`.
