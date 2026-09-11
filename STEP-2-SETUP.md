# Meerab's Collection — Step 2: Supabase Products + Orders

## 1. Create a Supabase project
Create a free Supabase project and open its SQL Editor.

## 2. Create the database
Paste and run `supabase-schema.sql`.

## 3. Add the public browser key
Open `supabase-config.js` and set:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (or the project's publishable key)

Use only the public browser key. Never use a `service_role`/secret key in the website.

## 4. Add products
Products can be inserted into the `products` table. Set `is_active=true` for products that should appear in the storefront.

Example fields:
- name
- slug
- price
- compare_at_price
- stock
- image_url
- badge
- rating
- category_id
- is_featured

## 5. What works after connection
- Storefront reads active products from Supabase.
- Product search works on loaded products.
- Cart remains available in the browser.
- Checkout collects customer name, phone and address.
- Cash-on-delivery orders are saved in `orders`.
- Order line items are saved in `order_items`.

## 6. Important production security step
The schema contains intentionally simple development policies so the storefront can read products and create COD orders. Before accepting real customer traffic, add authenticated admin policies and tighten order access so customers cannot read or alter other customers' orders.

## 7. Next step
Step 3 should add:
- Admin login/authentication
- Add/edit/delete product UI
- Inventory updates
- Order management/status changes
- Customer/order dashboard data
- Image uploads through Supabase Storage
