# MyHRM Pro Backend (Option A)

Production stack:
- Frontend: GitHub Pages
- Backend API: Render/Railway/Fly
- Database: PostgreSQL (Neon/Supabase)

## Run locally
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill values
4. Apply schema to Postgres (`psql "$DATABASE_URL" -f schema.sql`)
5. `npm start`

## Endpoints
- `GET /health`
- `GET/POST/DELETE /api/employees`
- `GET/POST/DELETE /api/admin-staff`
- `POST /api/ai/deepseek` (server-side key proxy)

## Frontend migration notes
Replace `localStorage` CRUD and direct DeepSeek calls with API calls to this backend.
