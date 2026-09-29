# B&W Crackers

Sivakasi fireworks shop: **Medusa v2** backend + **Vite/React** storefront. Customers
browse the 2026 price list, build a cart, and place an **order enquiry**. Payment is
collected on WhatsApp / UPI after the shop confirms stock — there is no card checkout.

```
├── bwcrackers/              Medusa v2 API + admin (port 9000)
└── bwcrackers-storefront/   Vite + React shop (port 8000)
```

Production: storefront on Vercel (`https://bwcrackers.com`), API + admin on Railway
(`https://admin.bwcrackers.com`). See `AGENTS.md` for how those deploys actually work.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Yarn (storefront) — `npm install -g yarn`

## 1. Backend (`bwcrackers`)

```bash
cd bwcrackers
npm install
createdb medusa-bwcrackers
# DATABASE_URL in .env, e.g. postgres://USER@localhost/medusa-bwcrackers
npx medusa db:migrate
npm run seed
npx medusa user -e admin@bwcrackers.com -p admin123
npx medusa develop
```

- API: http://localhost:9000
- Admin: http://localhost:9000/app — `admin@bwcrackers.com` / `admin123`

Publishable key (storefront `.env`):

```bash
psql medusa-bwcrackers -c "SELECT token FROM public.api_key WHERE type = 'publishable';"
```

## 2. Storefront (`bwcrackers-storefront`)

```bash
cd bwcrackers-storefront
yarn install
```

`.env`:

```env
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=<token from the query above>
```

```bash
yarn dev          # http://localhost:8000
yarn test
yarn build
```

| Page | URL |
|------|-----|
| Home | http://localhost:8000/ |
| Price list | http://localhost:8000/store |
| Collections | http://localhost:8000/collections |
| Cart | http://localhost:8000/cart |
| Track order | http://localhost:8000/track |

## Order enquiries

1. Storefront posts items as `{ code, quantity }` only. The API looks up SKU `BW-<code>`,
   prices in INR, merges duplicate codes, and stores `packing_fee` (2%) + `grand_total`.
2. Response includes an 8-character **reference** (last 8 of the enquiry id).
3. Customer tracks with reference + the same mobile number.
4. Admin **Orders** page has an Order Enquiries widget: status
   `pending → confirmed → paid → packed → dispatched → delivered` (or `cancelled`),
   plus courier tracking and internal notes.

Public listing of all enquiries is **not** exposed. Rate limits apply on create/track.

### After pulling model changes

Local:

```bash
cd bwcrackers && npx medusa db:migrate
```

Production (Railway does **not** migrate on boot):

```bash
cd bwcrackers && railway run npx medusa db:migrate
```

Then rebuild and push the Docker image (`./scripts/deploy-backend.sh`) so the new code
is running. See `AGENTS.md`.

## Tech

| Layer | Stack |
|-------|--------|
| Backend | Medusa 2.11, Node, PostgreSQL |
| Storefront | Vite 4, React 18, TypeScript, Tailwind 3 |
| Admin | Medusa Admin + custom enquiry widget |
