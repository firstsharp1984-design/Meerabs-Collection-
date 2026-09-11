# Meerab's Collection — Final Launch Checklist

## 1. Supabase
- [ ] Run Step 5, 6 and 7 SQL migrations.
- [ ] Confirm RLS is enabled and policies are working.
- [ ] Confirm admin account works.
- [ ] Confirm customer signup/login works.
- [ ] Confirm product image storage works.
- [ ] Confirm checkout creates an order and decreases stock.
- [ ] Confirm customers can see only their own orders.
- [ ] Run Supabase Security Advisor.
- [ ] Enable MFA on the Supabase owner account.
- [ ] Never place a service-role/secret key in frontend files.

## 2. Website
- [ ] Put real Supabase URL + publishable/anon key in `supabase-config.js`.
- [ ] Replace the demo WhatsApp number.
- [ ] Replace placeholder email.
- [ ] Replace placeholder domain.
- [ ] Add real logo and product photos.
- [ ] Add real product names, prices, stock and descriptions.
- [ ] Add delivery charges and service areas.
- [ ] Publish final return/exchange and privacy wording.

## 3. Cloudflare Pages
- [ ] Push the project to a Git repository.
- [ ] Import the repository into Cloudflare Pages.
- [ ] Use `main` as production branch.
- [ ] For a plain static site, use build command `exit 0`.
- [ ] Set output directory to `/`.
- [ ] Test the generated `pages.dev` URL.
- [ ] Add a custom domain if desired.
- [ ] Update `robots.txt` and `sitemap.xml` with the final domain.

## 4. Full customer test
- [ ] Home page opens on phone.
- [ ] Product images load.
- [ ] Add to cart.
- [ ] Cart quantities work.
- [ ] Customer signup.
- [ ] Customer login.
- [ ] Checkout.
- [ ] COD order.
- [ ] Order appears in My Account.
- [ ] Admin sees the order.
- [ ] Admin changes order status.
- [ ] Stock changes correctly.
- [ ] Sign out works.

## 5. Launch
After all checks pass, announce the store URL and begin accepting orders.

## Important
Free hosting is suitable for an initial launch but has provider quotas and service limitations.
Monitor usage and upgrade hosting/database resources if traffic grows.
