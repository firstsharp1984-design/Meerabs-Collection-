# Step 4 — Secure Admin + Images

## Added
- Supabase email/password admin login
- Admin role check using `profiles`
- Admin-only product changes
- Admin-only order reads/updates
- Customer profile table
- Product image upload to Supabase Storage
- Sign-out
- RLS policies
- Public product-image viewing

## Setup
1. Create an Auth user in Supabase Authentication.
2. Run `step4-secure-schema.sql`.
3. Copy that Auth user's UUID.
4. Run:
   `update public.profiles set role='admin' where id='YOUR_AUTH_USER_UUID';`
   If the profile row does not exist yet, insert it:
   `insert into public.profiles(id, role) values ('YOUR_AUTH_USER_UUID','admin');`
5. Put your Supabase URL and PUBLIC anon/publishable key in `supabase-config.js`.
6. Open `admin-login.html` to sign in.
7. The admin dashboard redirects unauthenticated/non-admin users back to login.

## Security
Never place a `service_role`/secret key in browser files. The public anon/publishable key is designed to be used in the browser with RLS protecting data.

## Next
Step 5 can add customer sign-up/login, customer order history, product variants, image galleries, checkout improvements, payment gateway integration, and deployment to free hosting.
