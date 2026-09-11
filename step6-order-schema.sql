-- STEP 6: checkout + order fields
-- Run after Step 5 SQL.

alter table public.orders add column if not exists payment_method text default 'cod';
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists customer_address text;
alter table public.orders add column if not exists customer_city text;

-- Ensure authenticated customers can create their own order.
drop policy if exists "customers create own orders" on public.orders;
create policy "customers create own orders" on public.orders
for insert to authenticated
with check (customer_id = auth.uid());

-- Customers may insert line items only for an order they own.
drop policy if exists "customers create own order items" on public.order_items;
create policy "customers create own order items" on public.order_items
for insert to authenticated
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and o.customer_id = auth.uid()
  )
);

-- Customers must not update/delete orders or order items.
-- Admin policies from Step 4/5 remain responsible for administration.

-- Recommended indexes.
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_created_at_idx on public.orders(created_at);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- IMPORTANT:
-- The checkout page re-reads product prices from the database before inserting
-- an order. For stronger production security, put the entire checkout transaction
-- in a Supabase Edge Function/RPC so price, stock, totals and inventory changes
-- happen atomically on the trusted side.
