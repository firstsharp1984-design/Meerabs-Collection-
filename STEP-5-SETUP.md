# Step 5 — Customer Accounts

## 1. Copy the files
Keep the Step 4 files and add:
- customer-auth.html
- customer-auth.js
- account.html
- account.js

## 2. Run SQL
In Supabase SQL Editor, run `step5-customer-schema.sql`.

## 3. Auth settings
In Supabase Authentication, enable Email provider.
For a simple launch, you can keep email confirmation on. Customers will verify
their email before signing in.

## 4. Add account links
Add links such as:
- customer-auth.html → Sign in / Create account
- account.html → My Account

## 5. Checkout
Your checkout should set `customer_id` to the authenticated user's UUID.
For guests, keep your existing COD flow until you add a server-side checkout
function.

## Security
Never put a Supabase service-role/secret key in browser JavaScript.
The anon/publishable key is the browser key.
For production, validate product prices and totals on a trusted server/Edge
Function before creating an order.
