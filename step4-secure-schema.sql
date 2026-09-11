-- Meerab's Collection — Step 4 security/auth schema
-- Run after the Step 2 schema in Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  email text default '',
  phone text default '',
  address text default '',
  city text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;

-- Helper: authenticated admin check.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
for select using (id = auth.uid() or public.is_admin());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Users read own customer record" on public.customers;
create policy "Users read own customer record" on public.customers
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users create own customer record" on public.customers;
create policy "Users create own customer record" on public.customers
for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users update own customer record" on public.customers;
create policy "Users update own customer record" on public.customers
for update using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- Replace broad development admin policies from Step 2.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products
for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products" on public.products
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can create orders" on public.orders;
create policy "Customers can create orders" on public.orders
for insert with check (true);

drop policy if exists "Admin read orders" on public.orders;
create policy "Admin read orders" on public.orders
for select using (public.is_admin());

drop policy if exists "Admin update orders" on public.orders;
create policy "Admin update orders" on public.orders
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can create order items" on public.order_items;
create policy "Customers can create order items" on public.order_items
for insert with check (true);

drop policy if exists "Admin read order items" on public.order_items;
create policy "Admin read order items" on public.order_items
for select using (public.is_admin());

-- Storage bucket for product images.
insert into storage.buckets (id, name, public)
values ('product-images','product-images',true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());

-- IMPORTANT:
-- After creating your own Auth user, promote that user's UUID to admin:
-- update public.profiles set role='admin' where id='YOUR_AUTH_USER_UUID';
