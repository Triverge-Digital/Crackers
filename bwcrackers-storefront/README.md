# B&W Crackers storefront

Customer-facing shop for B&W Crackers (Sivakasi). Vite + React 18 + TypeScript + Tailwind.

Catalog prices and copy live in `src/data/pricelist.ts` and `src/constants.ts`. Cart and
customer details persist in `localStorage`. Orders are **enquiries** — no card checkout —
saved to the Medusa backend and confirmed on WhatsApp.

## Routes

| Path | Page |
|------|------|
| `/` | Home — Diwali banners, how to order, featured categories, FAQ |
| `/store` | Full 2026 price list |
| `/store/:categorySlug` | Category (e.g. `/store/sparklers`) |
| `/collections` | Gift boxes and family packs |
| `/cart` | Cart + checkout |
| `/track` | Look up an order by 8-character reference + phone |

## Run locally

Needs the Medusa backend on port 9000 (see the repo-root README).

```bash
cd bwcrackers-storefront
yarn install
# optional: copy .env.example values into .env
yarn dev
```

Opens at **http://localhost:8000**.

```env
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=<publishable key from the Medusa DB>
```

Production (Vercel) must set `VITE_MEDUSA_BACKEND_URL=https://admin.bwcrackers.com`.
If that env is missing, the shop still works but orders only go out via WhatsApp.

## Scripts

```bash
yarn test      # vitest — catalog integrity, 80% discount, totals
yarn build     # tsc && vite build
yarn preview   # serve the production bundle
```

## Checkout flow

1. Customer adds items. Minimum order is ₹3,000 (`MIN_ORDER` in `src/constants.ts`).
2. Checkout collects name, 10-digit mobile, address, pincode.
3. Storefront posts `{ customer_name, phone: +91…, items: [{ code, quantity }] }` to
   `POST /store/order-enquiry`. The **backend re-prices** from Medusa SKUs (`BW-<code>`),
   adds 2% packing, and returns a reference (last 8 characters of the enquiry id).
4. WhatsApp opens with the same totals. The customer can download a PDF estimate.
5. Status is later visible at `/track` via `GET /store/order-enquiry/track?ref=&phone=`.
