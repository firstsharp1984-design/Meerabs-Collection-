# Meerab's Collection — Starter Store

This is a working front-end starter for the live store and admin dashboard.

## Files
- `index.html` — customer storefront
- `admin.html` — luxury admin dashboard
- `styles.css` — storefront styling
- `admin.css` — dashboard styling
- `app.js` — product search + local cart
- `README.md` — setup notes

## Run locally
Open `index.html` in a browser. For the admin dashboard, open `admin.html`.

## Next production steps
1. Create a Supabase project.
2. Add tables for products, customers, orders, order_items, categories and coupons.
3. Replace demo data in `app.js` with Supabase API calls.
4. Add Supabase Auth for customer/admin login.
5. Connect the dashboard to the same database.
6. Add your real product photos and prices.
7. Add your preferred Pakistan payment/COD workflow.
8. Deploy the static front-end to Cloudflare Pages.

The current cart is intentionally local/demo-only; it does not charge cards or create real orders yet.
