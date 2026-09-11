# Step 6 — Checkout + Order System

## What this step adds
- Customer checkout page
- Delivery details
- Cash on Delivery option
- Bank-transfer option placeholder
- Database price refresh before order creation
- Customer-linked orders
- Order line items
- Customer order history compatibility
- Basic stock validation
- Order confirmation screen

## Setup
1. Keep the Step 5 files.
2. Add `checkout.html` and `checkout.js`.
3. Run `step6-order-schema.sql` in Supabase SQL Editor.
4. Make your cart's checkout button open `checkout.html`.
5. Make sure each cart item has `product_id` (or `id`) matching the Supabase `products.id`.
6. Make sure your `orders` and `order_items` tables use the column names expected by the Step 4/5 project.

## Customer flow
Shop → Add to cart → Checkout → Sign in → Delivery details → Payment method → Place order → My Account → Order history.

## Important production security
The browser should never be trusted with final prices, discounts, stock, or payment confirmation.
This step refreshes product prices from Supabase before creating the order, but a production
store should move the complete checkout transaction into a trusted Supabase Edge Function
or RPC. That server-side function should:
- re-check prices and stock
- calculate the total
- create the order and order_items atomically
- reduce inventory
- validate discounts
- verify payment status when online payments are added

## Payment
The current Step 6 includes COD and a bank-transfer placeholder. No payment credentials
are stored in the browser. A real online gateway can be integrated in the next step after
choosing the provider.
