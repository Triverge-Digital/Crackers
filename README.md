# BW Crackers - E-Commerce Platform

A fire crackers e-commerce platform built with **Medusa V2** (backend) and **Next.js 15** (storefront).

## Project Structure

```
crackers/
├── bwcrackers/                 # Medusa V2 backend (API + Admin panel)
├── bwcrackers-storefront/      # Next.js storefront (customer-facing site)
```

---

## Prerequisites

- **Node.js** >= 20 — [https://nodejs.org](https://nodejs.org)
- **PostgreSQL** >= 14 — see install instructions below
- **Yarn** (for storefront) — `npm install -g yarn`

---

## Installing PostgreSQL

### macOS (Homebrew)

```bash
brew install postgresql@15
brew services start postgresql@15
```

Verify it's running:

```bash
/opt/homebrew/opt/postgresql@15/bin/pg_isready
# or if Intel Mac:
/usr/local/opt/postgresql@15/bin/pg_isready
```

Add to your PATH for convenience (add to `~/.zshrc` or `~/.bash_profile`):

```bash
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
```

Then reload your shell (`source ~/.zshrc`) so `psql`, `createdb` etc. work directly.

### Windows

1. Download the installer from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer — use the default port `5432` and set a password (remember it)
3. Make sure to check **"Add to PATH"** during installation, or manually add `C:\Program Files\PostgreSQL\15\bin` to your system PATH
4. Open a new Command Prompt / PowerShell and verify:

```cmd
psql --version
```

> On Windows, the database URL in `.env` will need a password:
> `DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost/medusa-bwcrackers`

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Create a user for your OS user:

```bash
sudo -u postgres createuser --superuser $USER
```

---

## 1. Backend Setup (bwcrackers)

```bash
cd bwcrackers
```

### Configure environment

Copy and edit the `.env` file. The key setting is `DATABASE_URL`:

```bash
# macOS / Linux (peer auth, no password needed)
DATABASE_URL=postgres://YOUR_USERNAME@localhost/medusa-bwcrackers

# Windows (password auth)
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost/medusa-bwcrackers
```

All other `.env` values can stay as defaults for local development.

### First-time setup

```bash
# Install dependencies
npm install

# Create the database
createdb medusa-bwcrackers
# Windows alternative: psql -U postgres -c "CREATE DATABASE \"medusa-bwcrackers\";"

# Run database migrations
npx medusa db:migrate

# Seed with fire cracker product data (India region, INR, 37 products, 8 categories)
npm run seed

# Create an admin user
npx medusa user -e admin@bwcrackers.com -p admin123
```

### Start the backend

```bash
npx medusa develop
```

This starts:
- **API** at `http://localhost:9000`
- **Admin Panel** at `http://localhost:9000/app`

### Admin Login

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@bwcrackers.com` |
| Password | `admin123`             |

---

## 2. Storefront Setup (bwcrackers-storefront)

```bash
cd bwcrackers-storefront
```

### Configure environment

Edit `.env.local`:

```env
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<your-key>
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=in
```

To get your publishable API key after seeding:

```bash
psql medusa-bwcrackers -c "SELECT token FROM public.api_key WHERE type = 'publishable';"

# Windows:
psql -U postgres medusa-bwcrackers -c "SELECT token FROM public.api_key WHERE type = 'publishable';"
```

Paste the key into `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `.env.local`.

### First-time setup

```bash
yarn install
```

### Start the storefront

```bash
yarn dev
```

Storefront runs at `http://localhost:8000`

---

## 3. Running Both Together

You need **two terminals** running simultaneously.

### macOS / Linux

**Terminal 1 — Backend:**
```bash
cd bwcrackers
npx medusa develop
```

**Terminal 2 — Storefront:**
```bash
cd bwcrackers-storefront
yarn dev
```

### Windows (Command Prompt or PowerShell)

**Window 1 — Backend:**
```cmd
cd bwcrackers
npx medusa develop
```

**Window 2 — Storefront:**
```cmd
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

### Storefront Pages

| Page           | URL                                  |
|----------------|--------------------------------------|
| Home           | http://localhost:8000/in              |
| All Products   | http://localhost:8000/in/store        |
| Collections    | http://localhost:8000/in/collections  |
| About          | http://localhost:8000/in/about        |
| Cart           | http://localhost:8000/in/cart         |

---

## Order Enquiry System

This platform uses a **no-payment order enquiry** model:

1. Customers browse products and add items to cart
2. From the cart page, they fill in their details — name, phone (+91 mandatory), email, address
3. A message clearly states: *"No online payment required. Your details will be captured and our team will contact you."*
4. The enquiry is saved to the database
5. In the admin panel, go to **Orders** to see the "Order Enquiries" widget at the top
6. Admin can view full details and update status: **Pending → Contacted → Confirmed → Cancelled**

No online payment is collected. The team contacts customers to confirm and arrange delivery.

---

## Resetting the Database

If you need to start completely fresh:

### macOS / Linux

```bash
cd bwcrackers
dropdb medusa-bwcrackers
createdb medusa-bwcrackers
npx medusa db:migrate
npm run seed
npx medusa user -e admin@bwcrackers.com -p admin123
```

### Windows

```cmd
cd bwcrackers
psql -U postgres -c "DROP DATABASE \"medusa-bwcrackers\";"
psql -U postgres -c "CREATE DATABASE \"medusa-bwcrackers\";"
npx medusa db:migrate
npm run seed
npx medusa user -e admin@bwcrackers.com -p admin123
```

After resetting, update the publishable API key in `bwcrackers-storefront/.env.local`.

---

## Troubleshooting

### `medusa: command not found`
Use `npx medusa` instead of `medusa` — the CLI is a project dependency, not a global install.

### Port already in use (9000 or 8000)

```bash
# macOS / Linux
lsof -ti:9000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 9000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
```

### PostgreSQL not running

```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
net start postgresql-x64-15
# or restart via Services app (services.msc)
```

### Storefront shows no products
- Make sure the backend is running at `http://localhost:9000`
- Make sure `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `.env.local` matches the key in the database
- Make sure you ran `npm run seed` in the backend

---

## Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Backend     | Medusa V2 (2.11.3), Node.js     |
| Database    | PostgreSQL                       |
| Storefront  | Next.js 15, React 19, Tailwind  |
| Admin Panel | Medusa Admin (built-in)          |
