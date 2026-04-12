# BW Crackers — Deployment Guide

Deploy the full platform for **$0/month** using free tiers.

## Architecture

```
                     ┌──────────────┐
                     │  UptimeRobot  │
                     │  (keep-alive) │
                     └──────┬───────┘
                            │ pings every 5 min
                            ▼
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│   Vercel     │────▶│    Render     │────▶│  Supabase  │
│  Storefront  │     │   Medusa V2   │     │ PostgreSQL │
│  (Next.js)   │     │ Backend+Admin │     │            │
└─────────────┘     └──────┬───────┘     └────────────┘
                           │
                     ┌─────▼──────┐
                     │ Cloudinary  │
                     │  (Images)   │
                     └────────────┘
```

| Service         | Purpose                | Cost    |
|-----------------|------------------------|---------|
| Render          | Medusa backend + admin | Free    |
| Supabase        | PostgreSQL database    | Free    |
| Vercel          | Next.js storefront     | Free    |
| Cloudinary      | Product images         | Free    |
| UptimeRobot     | Prevent cold starts    | Free    |

---

## Step 1: Supabase — Database

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Click **New Project**
   - Name: `bwcrackers`
   - Database Password: generate a strong one and **save it**
   - Region: pick the closest to your users (e.g., Mumbai for India)
3. Wait for the project to finish provisioning
4. Go to **Settings → Database**
5. Under **Connection string → URI**, copy the connection string. It looks like:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
6. **Important**: In the URI, change the port from `6543` to `5432` and add `?sslmode=require`:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require
   ```
   Save this — this is your `DATABASE_URL`.

---

## Step 2: Cloudinary — Image Storage

1. Go to [https://cloudinary.com](https://cloudinary.com) and create a free account
2. From your **Dashboard**, note down:
   - **Cloud Name** (e.g., `dxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcDEF...`)

### Install Cloudinary plugin in the backend

```bash
cd bwcrackers
npm install @medusajs/file-cloudinary
```

### Update `medusa-config.ts`

Replace the existing file with:

```ts
import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: process.env.NODE_ENV === "production"
      ? { connection: { ssl: { rejectUnauthorized: false } } }
      : undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "./src/modules/order-enquiry",
    },
    {
      resolve: "@medusajs/file-cloudinary",
      key: Modules.FILE,
      options: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      },
    },
  ],
})
```

Commit this change.

---

## Step 3: Render — Medusa Backend

### 3.1 Push your code to GitHub

Make sure `bwcrackers/` is in a Git repo (it can be the `crackers/` monorepo or a separate repo).

### 3.2 Create a Render Web Service

1. Go to [https://render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:

| Setting          | Value                                    |
|------------------|------------------------------------------|
| Name             | `bwcrackers-api`                         |
| Root Directory   | `bwcrackers`                             |
| Runtime          | Node                                     |
| Build Command    | `npm install && npx medusa db:migrate && npm run build` |
| Start Command    | `npx medusa start`                       |
| Instance Type    | **Free**                                 |
| Node Version     | `20` (set in Environment → `NODE_VERSION=20`) |

### 3.3 Set Environment Variables

In Render dashboard → your service → **Environment**, add:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require
NODE_ENV=production
JWT_SECRET=<generate: openssl rand -hex 32>
COOKIE_SECRET=<generate: openssl rand -hex 32>
STORE_CORS=https://your-storefront.vercel.app
ADMIN_CORS=https://bwcrackers-api.onrender.com
AUTH_CORS=https://your-storefront.vercel.app,https://bwcrackers-api.onrender.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_VERSION=20
```

> Generate secrets locally:
> ```bash
> openssl rand -hex 32
> ```
> Run it twice, one for JWT_SECRET and one for COOKIE_SECRET.

### 3.4 Deploy

Click **Create Web Service**. Render will build and deploy.

First deploy takes 5-10 minutes. Once it's live, note your URL (e.g., `https://bwcrackers-api.onrender.com`).

### 3.5 Seed the database (first time only)

You need to run the seed script once. In Render dashboard:

1. Go to your service → **Shell** tab
2. Run:
   ```bash
   npx medusa db:migrate
   npm run seed
   npx medusa user -e admin@bwcrackers.com -p admin123
   ```

Or from your local machine, point to the remote database temporarily:

```bash
cd bwcrackers
DATABASE_URL="your-supabase-url" npx medusa db:migrate
DATABASE_URL="your-supabase-url" npm run seed
DATABASE_URL="your-supabase-url" npx medusa user -e admin@bwcrackers.com -p admin123
```

### 3.6 Get the publishable API key

From Render Shell or locally:

```bash
DATABASE_URL="your-supabase-url" npx medusa exec -c "
  const query = container.resolve('query');
  const { data } = await query.graph({ entity: 'api_key', fields: ['token'], filters: { type: 'publishable' } });
  console.log('KEY:', data[0]?.token);
"
```

Or log in to the admin panel at `https://bwcrackers-api.onrender.com/app`, go to **Settings → API Keys** and copy the publishable key.

### 3.7 Verify

- Admin Panel: `https://bwcrackers-api.onrender.com/app`
- API health: `https://bwcrackers-api.onrender.com/health`

---

## Step 4: Vercel — Storefront

### 4.1 Push storefront to GitHub

Make sure `bwcrackers-storefront/` is in the repo.

### 4.2 Create a Vercel Project

1. Go to [https://vercel.com](https://vercel.com) and sign up
2. Click **Add New → Project**
3. Import your GitHub repo
4. Configure:

| Setting          | Value                    |
|------------------|--------------------------|
| Framework Preset | Next.js                  |
| Root Directory   | `bwcrackers-storefront`  |

### 4.3 Set Environment Variables

In Vercel dashboard → your project → **Settings → Environment Variables**, add:

```
MEDUSA_BACKEND_URL=https://bwcrackers-api.onrender.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_from_step_3_6
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_DEFAULT_REGION=in
REVALIDATE_SECRET=<generate: openssl rand -hex 32>
```

### 4.4 Update `next.config.js` for Cloudinary images

Add the Cloudinary hostname to `images.remotePatterns` in `next.config.js`:

```js
{
  protocol: "https",
  hostname: "res.cloudinary.com",
},
```

Commit and push this change.

### 4.5 Deploy

Click **Deploy**. Vercel builds and deploys automatically.

### 4.6 Update Render CORS

After you have the Vercel URL (e.g., `https://bwcrackers.vercel.app`), go back to Render and update:

```
STORE_CORS=https://bwcrackers.vercel.app
AUTH_CORS=https://bwcrackers.vercel.app,https://bwcrackers-api.onrender.com
```

Render will auto-redeploy with the new env vars.

---

## Step 5: UptimeRobot — Prevent Cold Starts

1. Go to [https://uptimerobot.com](https://uptimerobot.com) and create a free account
2. Click **Add New Monitor**
3. Configure:

| Setting        | Value                                           |
|----------------|-------------------------------------------------|
| Monitor Type   | HTTP(s)                                         |
| Friendly Name  | `BW Crackers API`                               |
| URL            | `https://bwcrackers-api.onrender.com/health`    |
| Interval       | 5 minutes                                       |

4. Click **Create Monitor**

This pings your backend every 5 minutes, preventing Render from spinning it down.

---

## Step 6: Custom Domain (Optional)

### Vercel (storefront)

1. In Vercel → your project → **Settings → Domains**
2. Add your domain (e.g., `www.bwcrackers.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_BASE_URL` to `https://www.bwcrackers.com`

### Render (backend)

1. In Render → your service → **Settings → Custom Domains**
2. Add your API domain (e.g., `api.bwcrackers.com`)
3. Update DNS records as instructed
4. Update all env vars referencing the backend URL

After domain changes, update CORS env vars on Render:

```
STORE_CORS=https://www.bwcrackers.com
ADMIN_CORS=https://api.bwcrackers.com
AUTH_CORS=https://www.bwcrackers.com,https://api.bwcrackers.com
```

And update Vercel:

```
MEDUSA_BACKEND_URL=https://api.bwcrackers.com
NEXT_PUBLIC_BASE_URL=https://www.bwcrackers.com
```

---

## Post-Deployment Checklist

- [ ] Admin panel loads at `https://your-backend.onrender.com/app`
- [ ] Can log in with `admin@bwcrackers.com` / `admin123`
- [ ] Products visible in admin under Products
- [ ] Order Enquiries widget visible under Orders
- [ ] Storefront loads at your Vercel URL
- [ ] Products display with images on home page and store page
- [ ] Can add items to cart
- [ ] Can place an order enquiry from cart page
- [ ] Order enquiry appears in admin panel
- [ ] UptimeRobot shows the backend as "Up"
- [ ] **Change the admin password** after first login

---

## Redeployment

### Backend changes

Push to GitHub → Render auto-deploys.

If you changed models/migrations:

1. Push the code
2. Render runs `npx medusa db:migrate` as part of the build command automatically

### Storefront changes

Push to GitHub → Vercel auto-deploys.

---

## Environment Variables Reference

### Render (Backend)

| Variable                | Example                                      |
|-------------------------|----------------------------------------------|
| `DATABASE_URL`          | `postgresql://postgres.xxx:pw@...supabase...` |
| `NODE_ENV`              | `production`                                 |
| `JWT_SECRET`            | `(64-char hex string)`                       |
| `COOKIE_SECRET`         | `(64-char hex string)`                       |
| `STORE_CORS`            | `https://bwcrackers.vercel.app`              |
| `ADMIN_CORS`            | `https://bwcrackers-api.onrender.com`        |
| `AUTH_CORS`             | `https://bwcrackers.vercel.app,https://bwcrackers-api.onrender.com` |
| `CLOUDINARY_CLOUD_NAME` | `dxyz1234`                                  |
| `CLOUDINARY_API_KEY`    | `123456789012345`                            |
| `CLOUDINARY_API_SECRET` | `abcDEFghiJKL`                               |
| `NODE_VERSION`          | `20`                                         |

### Vercel (Storefront)

| Variable                              | Example                                   |
|---------------------------------------|-------------------------------------------|
| `MEDUSA_BACKEND_URL`                  | `https://bwcrackers-api.onrender.com`     |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`  | `pk_abc123...`                            |
| `NEXT_PUBLIC_BASE_URL`                | `https://bwcrackers.vercel.app`           |
| `NEXT_PUBLIC_DEFAULT_REGION`          | `in`                                      |
| `REVALIDATE_SECRET`                   | `(64-char hex string)`                    |
