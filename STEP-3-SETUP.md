# Step 3 — Real Admin Dashboard

The dashboard now has a Supabase-aware data layer.

Features:
- Live KPI totals for sales, orders, customers and products
- Product search
- Add and edit products
- Hide/show products
- Inventory view
- Order search and status changes
- Customer summary
- Responsive layout
- Demo fallback when Supabase is not configured

To connect: edit `supabase-config.js` with your Supabase project URL and public anon/publishable key, then use the SQL from `supabase-schema.sql`.

Security note: do not put a service-role/secret key in browser code. Before public launch, add Supabase Auth and strict Row Level Security for admin actions.
