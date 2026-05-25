# Stripe Checkout — Tuxedo Retreat

## Payment flow

1. Guest submits `/book` → `PENDING_REVIEW` in PostgreSQL  
2. Host approves in `/admin` → `APPROVED_AWAITING_PAYMENT` + Stripe Checkout Session (amount from DB)  
3. Guest pays via Stripe Checkout (no card data on your site)  
4. Webhook `checkout.session.completed` → `PAID_CONFIRMED`  
5. Paid dates block the public availability calendar  

## Environment variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://tuxedoretreat.com
```

On Vercel, set the same in Production. `NEXT_PUBLIC_APP_URL` must match your live domain for success/cancel redirects.

## Local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

Trigger a test payment with a host-approved reservation, or:

```bash
stripe trigger checkout.session.completed
```

## Endpoints

| Route | Purpose |
|-------|---------|
| `POST /api/admin/reservations/[id]/approve` | Approve + create Checkout |
| `POST /api/admin/reservations/[id]/checkout` | Regenerate Checkout session |
| `GET /api/admin/reservations/[id]/payment-link` | Guest + Stripe URLs for host |
| `POST /api/reservations/[id]/checkout` | Guest starts Checkout |
| `POST /api/stripe/webhook` | Signature-verified events |

## Guest pages

- `/reservations/[id]/payment` — summary + “Pay in full” (redirects to Stripe)  
- `/reservations/[id]/payment/success` — after Stripe success  
- `/reservations/[id]/payment/cancel` — if guest leaves Checkout  

## Production (Vercel)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint  
   `https://YOUR_DOMAIN/api/stripe/webhook`  
2. Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`  
3. Paste signing secret into Vercel `STRIPE_WEBHOOK_SECRET`  
