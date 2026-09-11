# Step 8 — Production Launch

## Architecture
- Storefront: Cloudflare Pages
- Database/Auth/Storage: Supabase
- Source/deployment: GitHub → Cloudflare Pages
- Domain: your own domain (optional)

Cloudflare Pages supports static HTML sites and Git-based deployments.
Supabase recommends checking RLS, SSL, MFA, authentication settings and performance
before production.

## A. Supabase production checklist
1. Confirm all tables have appropriate Row Level Security policies.
2. Run Supabase Security Advisor.
3. Enable SSL enforcement.
4. Protect the Supabase account with MFA.
5. Enable email confirmation for customers.
6. Review Auth rate limits/CAPTCHA.
7. Never expose a service-role/secret key in browser files.
8. Test admin/customer roles using separate accounts.
9. Back up important product/order data.
10. Remember the Free Plan can pause low-activity projects, so treat free hosting
   as a low-cost launch option rather than a guaranteed high-availability setup.

## B. Prepare the website
1. Put your real Supabase project URL and publishable/anon key in `supabase-config.js`.
2. Do NOT put the Supabase service-role/secret key there.
3. Replace `YOUR-DOMAIN.example` in `robots.txt` and `sitemap.xml` with your real domain
   after you have one.
4. Add real store logo/product images.
5. Add business contact information and delivery/return/privacy pages.
6. Test checkout, account login, admin login, product images and order status.

## C. GitHub
Create a repository and upload the complete Step 8 project.

Example:
git init
git add .
git commit -m "Meerab's Collection production launch"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main

## D. Cloudflare Pages
In Cloudflare:
Workers & Pages → Create application → Pages → Import existing Git repository.
Choose your GitHub repository.

For this plain static site:
- Production branch: main
- Build command: exit 0
- Build output directory: /
Then deploy.

Cloudflare will provide a `*.pages.dev` address.

## E. Custom domain
After testing the pages.dev address:
Cloudflare project → Custom domains → Add domain.
Follow the DNS instructions shown by Cloudflare.

## F. Final test
Test on phone and computer:
- Home page
- Product listing
- Product details
- Cart
- Customer sign-up/login
- Checkout
- COD order
- My Account/order history
- Admin login
- Add/edit/hide product
- Image upload
- Order status
- Low stock
- Sign out

## Important payment note
Step 8 does not pretend that an online payment is successful. COD works as the current
payment method. A real gateway should use a trusted server/Edge Function and provider
webhook/callback before changing `payment_status` to `paid`.

## Launch status
After these checks, the store can be published on Cloudflare Pages. The `pages.dev`
address is free to use; a custom domain is optional and may cost money.
