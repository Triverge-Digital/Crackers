# BW Crackers - E-Commerce Platform

A fire crackers e-commerce platform built with **Medusa V2** (backend) and **Next.js 15** (storefront).

## Prerequisites

- **Node.js** >= 20
- **PostgreSQL 15** (installed via Homebrew)
- **Yarn 4** (for storefront)

## Project Structure

```
Clients/
├── bwcrackers/                 # Medusa V2 backend (API + Admin)
├── bwcrackers-storefront/      # Next.js storefront (customer-facing)
└── Ecommerce Fire Crackers Website/  # Design reference (not needed to run)
```

---

## 1. Start PostgreSQL

```bash
brew services start postgresql@15
```

Verify it's running:

```bash
/opt/homebrew/opt/postgresql@15/bin/pg_isready
```

---

## 2. Backend Setup (bwcrackers)

```bash
cd bwcrackers
```

### First-time setup

```bash
# Install dependencies (if not already done)
npm install

# Create database
/opt/homebrew/opt/postgresql@15/bin/createdb medusa-bwcrackers

# Run migrations
npx medusa db:migrate

# Seed product data (India region, INR, 37 fire cracker products)
npm run seed

# Create admin user
npx medusa user -e admin@bwcrackers.com -p admin123
```

### Run the backend

```bash
npx medusa develop
```

This starts:
- **API** at `http://localhost:9000`
- **Admin Panel** at `http://localhost:9000/app`

### Admin Login

- Email: `admin@bwcrackers.com`
- Password: `admin123`

---

## 3. Storefront Setup (bwcrackers-storefront)

```bash
cd bwcrackers-storefront
```

### First-time setup

```bash
# Install dependencies
yarn install
```

### Update `.env.local` if needed

After seeding, the publishable API key may change. Get the current key:

```bash
/opt/homebrew/opt/postgresql@15/bin/psql medusa-bwcrackers -c "SELECT token FROM public.api_key WHERE type = 'publishable';"
```

Update `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `.env.local` with the key from above.

### Run the storefront

```bash
yarn dev
```

Storefront runs at `http://localhost:8000`

---

## 4. Running Both Together

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd bwcrackers
npx medusa develop
```

**Terminal 2 - Storefront:**
```bash
cd bwcrackers-storefront
yarn dev
```

---

## URLs

| Service        | URL                          |
|----------------|------------------------------|
| Storefront     | http://localhost:8000         |
| Medusa API     | http://localhost:9000         |
| Admin Panel    | http://localhost:9000/app     |

## Storefront Pages

| Page           | URL                              |
|----------------|----------------------------------|
| Home           | http://localhost:8000/in          |
| All Products   | http://localhost:8000/in/store    |
| Collections    | http://localhost:8000/in/collections |
| About          | http://localhost:8000/in/about    |
| Cart           | http://localhost:8000/in/cart     |

---

## Order Enquiry System

This platform uses a **no-payment order enquiry** model:

1. Customers browse products and add to cart
2. From the cart, they fill in contact details (name, phone +91, email, address)
3. The order enquiry is saved to the database
4. Admin can view and manage enquiries from the **Orders** section in the admin panel
5. Admin can update status: Pending → Contacted → Confirmed / Cancelled

No online payment is collected. The team contacts customers to confirm orders and arrange delivery/payment.

---

## Resetting the Database

If you need to start fresh:

```bash
cd bwcrackers
/opt/homebrew/opt/postgresql@15/bin/dropdb medusa-bwcrackers
/opt/homebrew/opt/postgresql@15/bin/createdb medusa-bwcrackers
npx medusa db:migrate
npm run seed
npx medusa user -e admin@bwcrackers.com -p admin123
```

Then update the publishable API key in `bwcrackers-storefront/.env.local`.

---

## Tech Stack

- **Backend:** Medusa V2 (2.11.3), PostgreSQL, Node.js
- **Storefront:** Next.js 15, React 19, Tailwind CSS
- **Admin:** Medusa Admin (built-in at /app)
