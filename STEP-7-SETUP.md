# Step 7 — Secure Checkout, Inventory & Payment Tracking

## Added
- Trusted database checkout transaction
- Server-side price calculation
- Stock validation with row locks
- Automatic stock decrement
- Inventory movement ledger
- Payment status/reference fields
- Safer checkout flow
- Foundation for real payment gateway integration

## Install
1. Keep the Step 6 project.
2. Run `step7-inventory-payments.sql` in Supabase SQL Editor.
3. Replace the old checkout logic with `checkout-secure.js`.
4. Keep your public Supabase URL + anon/publishable key in `supabase-config.js`.
5. Never expose a service-role/secret key in browser code.

## Cart requirement
Each cart item must contain:
- `product_id` (preferred), or `id`
- `quantity`
- `name` and `price` may remain for display, but they are NOT trusted for the final order total.

## What happens now
Customer submits checkout → Supabase trusted function locks products → checks active status and stock → reads the real database price → creates order → creates order items → decrements inventory → records inventory movement.

## Payment gateway
Step 7 intentionally does not hard-code a specific Pakistan payment provider.
For a real gateway, the browser should start a payment request through a trusted server/Edge Function,
and the provider's callback/webhook should update:
- `payment_status`
- `payment_reference`
- `paid_at`

Never mark an online payment as `paid` merely because the browser says payment succeeded.

## Inventory
Current implementation decrements stock when an order is created. If you prefer reserving stock
until payment is successful, change the business rule to use `reserved_stock` and release reservations
on expiry/failure.

## Recommended next step
Step 8 can be the production launch:
- Cloudflare Pages deployment
- Supabase production configuration
- custom domain
- SEO/WhatsApp/contact buttons
- final mobile polish
- test checklist
- production environment configuration
