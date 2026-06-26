# BW Crackers — project guide for Claude

E-commerce for a Sivakasi fireworks brand. Two apps in this repo:

- **`bwcrackers/`** — Medusa v2 backend (admin + store API). Deployed on **Railway**.
- **`bwcrackers-storefront/`** — Vite + React storefront (NOT the Next.js starter; the
  Next.js files under `src/app/` are vestigial). Deployed on **Vercel**.

The storefront is largely **hardcoded** (products in `src/data/pricelist.ts`, banners/brands
as `public/` assets). The only homepage data it pulls from the backend is **brands**
(`GET /store/brands`), with a static fallback in `App.tsx`.

## Domains
- Storefront: **https://bwcrackers.com** (Vercel)
- Backend + Medusa admin: **https://admin.bwcrackers.com** (Railway) — admin UI at `/app`
- Railway also serves it at `https://bwcrackers-api-production.up.railway.app`

## Deployment — READ THIS

### Backend → Railway (Docker image, NO build on the server)
The Railway service `bwcrackers-api` (project `genuine-essence`) deploys a **prebuilt
Docker image**: `haridev111/bwcrackers-api:latest`. We build the image **locally**, push it
to Docker Hub, and Railway just runs it. **Do not** use `railway up` / Nixpacks / a
Dockerfile-builder-on-Railway — that builds on the server and is slow/unreliable here.

```bash
# one-time: Docker Desktop running, `docker login` (as haridev111), railway CLI linked
./scripts/deploy-backend.sh
# = docker buildx build --platform linux/amd64 -t haridev111/bwcrackers-api:latest --push .
#   then: railway redeploy --yes   (re-pulls :latest)
```

Notes:
- Build for **linux/amd64** (Mac is arm64; Railway runs amd64) — the script handles it.
- The image `CMD` is just `medusa start`. It does **not** migrate on boot.
- **Migrations are manual.** When models/migrations change, run before deploying:
  ```bash
  (cd bwcrackers && railway run npx medusa db:migrate)   # uses Railway's DATABASE_URL
  ```
  `railway run` injects Railway env, including the working Supabase **pooler** URL.

### Storefront → Vercel (git push)
The Vercel project (`bwcrackers-storefront`) is git-connected and auto-deploys on push to
the GitHub repo. The owner pushes/deploys the storefront. Set
`VITE_MEDUSA_BACKEND_URL=https://admin.bwcrackers.com` in Vercel env.

## Database
Supabase Postgres via the **transaction pooler**
(`aws-1-ap-south-1.pooler.supabase.com:6543`). The direct `db.<ref>.supabase.co` host is not
exposed. **Free tier auto-pauses** after inactivity — when paused, the host returns NXDOMAIN
and the backend 404s; resume it in the Supabase dashboard. Never commit secrets; the real
`DATABASE_URL`/`JWT_SECRET`/`COOKIE_SECRET` live in Railway env, not in the repo.

## Brands (admin-configurable)
- Module: `bwcrackers/src/modules/brand/` (model `brand`: name, handle, logo_url, rank,
  is_enabled). Registered in `medusa-config.ts`.
- APIs: `GET /store/brands` (enabled only), `GET/POST /admin/brands`, `POST/DELETE
  /admin/brands/[id]`.
- Admin UI: **Settings → Brands** (`src/admin/routes/brands/page.tsx`) — toggle visibility,
  edit name/logo, reorder, add/delete.
- Seed: `railway run npx medusa exec ./src/scripts/seed-brands.ts` (9 brands; Anil, Bheema,
  Vanitha, Sony, Star Vell enabled).
- Brand logos are storefront `public/brandN.png` assets; `logo_url` is resolved against the
  storefront origin.

## Build / verify
- Backend builds: `cd bwcrackers && npx medusa build`
- Storefront typecheck: `cd bwcrackers-storefront && npx tsc --noEmit`
- `.medusa/` is gitignored (built inside the Docker image; do not commit it).

## Conventions
- Images for the site (banners, etc.) are compressed to **WebP** in `public/`
  (banners ~300 KB, were 6–8 MB). Use Pillow/sharp; keep hero banners ≤ ~1920px wide.
- "Wala" (garland) crackers use `showImage: false` in `pricelist.ts` → rendered name + price,
  no photo.
