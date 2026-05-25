# Warwick Bethel Retreat

Luxury nightly stay website — **15 minutes from Warwick Bethel**.

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (repo root) → deploy on **Vercel** |
| **API** | ASP.NET Core 8 in [`api/PacificLuxe.Api/`](api/PacificLuxe.Api/) → deploy on **Render** |
| **Database** | **Neon** PostgreSQL — Prisma for reservations & calendar blocks (Vercel); optional ASP.NET API for legacy admin |

This repository is **standalone**. Pacific Luxe Direct vehicle rentals live in a different repo.

## Quick start (local)

**API** (port 5002):

```bash
cd api/PacificLuxe.Api
dotnet run --launch-profile retreat
```

**Frontend** (port 3000):

```bash
cp .env.example .env
# Required: DATABASE_URL, NEXT_PUBLIC_APP_URL
npx prisma migrate deploy
npm install
npm run dev
```

### Reservations (Prisma + PostgreSQL)

| Model | Purpose |
|-------|---------|
| `Reservation` | Guest requests and paid stays |
| `CalendarBlock` | Host-blocked dates |

**Status flow:** `PENDING_REVIEW` → `APPROVED_AWAITING_PAYMENT` → `PAID_CONFIRMED` (or `REJECTED` / `CANCELLED`)

**Blocking rules:** Only `PAID_CONFIRMED` reservations and `CalendarBlock` rows block new bookings. Pending and approved-unpaid requests may overlap and appear on the public calendar as “pending” without blocking dates.

**Helpers** (`src/lib/reservations/`): `getNights`, `calculateReservationTotal`, `checkDateOverlap`, `createReservationRequest`, `getAvailabilityForMonth`, `updateReservationStatus`, plus calendar block CRUD.

**Production:** Set `DATABASE_URL` on Vercel (Neon). Run `npx prisma migrate deploy` against the production database after deploy.

### Stripe Checkout

After host approval, guests pay in full via Stripe Checkout (amount from Postgres). Webhook marks stays `PAID_CONFIRMED` and blocks overlapping dates. See **[STRIPE-SETUP.md](STRIPE-SETUP.md)**.

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Production deploy

See **[SETUP-WARWICK-RETREAT.md](SETUP-WARWICK-RETREAT.md)** (quick) or **[DEPLOYMENT.md](DEPLOYMENT.md)** (full).

**Vercel:** Import this repo — **Root Directory:** `.` (repository root)

**Render:** New → Blueprint → this repo (`render.yaml`)

## Admin (after seed)

- `admin@warwickbethelretreat.com` / password from Render `AdminSeed__Password`
