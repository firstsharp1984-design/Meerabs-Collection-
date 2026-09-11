-- STEP 5: customer accounts + customer-owned orders
-- Run after Step 4 schema.
alter table public.orders add column if not exists customer_id uuid references auth.users(id);

alter table public.customers enable row level security;

drop policy if exists "customers own select" on public.customers;
create policy "customers own select" on public.customers
for select to authenticated using (user_id = auth.uid());

drop policy if exists "customers own insert" on public.customers;
create policy "customers own insert" on public.customers
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "customers own update" on public.customers;
create policy "customers own update" on public.customers
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Customers can read only their own orders.
drop policy if exists "customers own orders" on public.orders;
create policy "customers own orders" on public.orders
for select to authenticated using (customer_id = auth.uid() or public.is_admin());

-- Admins retain full order access.
drop policy if exists "admins select orders" on public.orders;
create policy "admins select orders" on public.orders
for select to authenticated using (public.is_admin());

-- Customer checkout can create an order only for the signed-in customer.
drop policy if exists "public can insert orders" on public.orders;
create policy "customers create own orders" on public.orders
for insert to authenticated
with check (customer_id = auth.uid());

-- Order items: customers may read items belonging to their own order.
drop policy if exists "customers own order items" on public.order_items;
create policy "customers own order items" on public.order_items
for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or public.is_admin())
  )
);

-- NOTE: For production, move checkout price/total calculation to a trusted
-- server/Edge Function so the browser cannot tamper with prices.
