# Meerab’s Collection — Step 11: Live Launch

This package consolidates the storefront, admin dashboard, customer accounts,
secure checkout, inventory, production headers, SEO files, contact/delivery/privacy
pages, and launch configuration from Steps 2–10.

## 1. Supabase
1. Create/open your Supabase project.
2. Run the SQL files in order where applicable:
   - supabase-schema.sql
   - step4-secure-schema.sql
   - step5-customer-schema.sql
   - step6-order-schema.sql
   - step7-inventory-payments.sql
3. In Authentication, configure customer sign-up/email confirmation as desired.
4. Create your admin user, then set its profile role to `admin` using the secure
   method described in the setup files.
5. Confirm RLS is enabled and run Supabase Security Advisor.
6. Never put a Supabase service-role/secret key in browser files.

## 2. Configure the website
Update `supabase-config.js` with the project's public URL and public
anon/publishable key.
Update `whatsapp.js` with the real WhatsApp number.
Replace placeholder domain/email/delivery/return-policy text before launch.

## 3. GitHub
Put the contents of this folder in the repository root:
  git init
  git add .
  git commit -m "Meerab's Collection live launch"
  git branch -M main
  git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
  git push -u origin main

## 4. Cloudflare Pages
Create a Pages project from the GitHub repository.
Production branch: `main`
Build command: `exit 0`
Build output directory: `/`
After deployment, test the generated `pages.dev` address.

## 5. Required live tests
- Home page loads on mobile and desktop.
- Product images load.
- Customer signup/login works.
- Cart totals are correct.
- Secure checkout creates an order.
- COD order appears in customer account and admin dashboard.
- Admin can update order status.
- Inventory decreases correctly.
- Sign-out works.
- WhatsApp/contact links work.
- robots.txt and sitemap.xml load.
- No secret/service-role credentials are present in public files.

## 6. Payments
COD is the ready payment path. Online payment is intentionally not marked as
complete until a real provider is selected and its server-side webhook/payment
verification is implemented. Do not mark orders paid from browser JavaScript.

## 7. Important
Free hosting is suitable for an initial launch but has quotas and service
limitations. Monitor usage and upgrade when the store needs more capacity,
reliability, or paid transactional services.
