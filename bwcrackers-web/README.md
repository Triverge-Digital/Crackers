# B&W Crackers — website + admin (Next.js + Supabase)

One Next.js app: the storefront at `/` and the shop admin at `/admin`. Products,
categories, customers, orders and shop settings live in Supabase; product photos
in Supabase Storage (bucket `products`). This replaces the old Vite storefront +
Medusa backend.

## First-time setup

1. Create a Supabase project (region Mumbai). Copy `.env.example` to `.env.local`
   and fill in the URL, anon key, service-role key and database connection string
   (Project Settings → API / Database).
2. `yarn install`
3. `yarn db:migrate` — creates tables, security rules and the photo bucket.
4. `yarn db:seed` — imports the 2026 price list, uploads the product photos from
   `scripts/data/photo-map.mjs` (compressed to webp) and writes default settings.
5. Supabase → Authentication → Users → **Add user** (email + password) for each admin,
   then `yarn admin:grant their@email.com "Their name"`.
6. `yarn dev` → http://localhost:3000 and http://localhost:3000/admin

## Deploying (Vercel)

Set the same env vars in Vercel (all except `SUPABASE_DB_URL`), plus
`NEXT_PUBLIC_SITE_URL=https://bwcrackers.com` and `RESEND_API_KEY` for order emails.
`SUPABASE_SERVICE_ROLE_KEY` must stay server-only (no `NEXT_PUBLIC_` prefix).

## How it fits together

- `src/lib/shop-data.ts` — loads the live catalog + settings (cached, tag `shop-data`;
  every admin save clears it, so changes show on the site within seconds).
- `src/app/api/orders` — places orders: validates, re-prices from the database,
  saves customer + order, emails the shop and customer.
- `src/app/api/track` — order status by reference + phone.
- `src/admin/*`, `src/app/admin/*` — the admin panel. Every admin query runs with the
  signed-in user's session, so Supabase row-level security enforces admin-only access.
- `src/shop/*` — the storefront (ported from the old Vite app, same design).
