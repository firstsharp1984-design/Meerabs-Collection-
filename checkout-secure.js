// STEP 7 checkout replacement.
// Replace checkout.js with this file's logic, or rename this file to checkout.js.
// It sends cart item IDs/quantities to the trusted Supabase function.
// The database function calculates final prices and stock.

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
let user = null;

const $ = id => document.getElementById(id);
const money = n => `PKR ${Number(n || 0).toLocaleString()}`;

function show(text, error=false) {
  $('message').innerHTML = `<div class="${error ? 'error' : 'success-box'}">${text}</div>`;
}

function renderCart() {
  const el = $('cart');
  if (!cart.length) {
    el.innerHTML = '<p class="muted">Your cart is empty. <a href="index.html">Continue shopping</a>.</p>';
    $('placeOrder').disabled = true;
    return;
  }
  el.innerHTML = cart.map(x =>
    `<div class="cart-line"><span>${x.name} × ${x.quantity || 1}</span><strong>${money(Number(x.price||0)*(x.quantity||1))}</strong></div>`
  ).join('');
}

async function init() {
  const { data } = await db.auth.getSession();
  user = data.session?.user || null;
  if (!user) {
    location.href = 'customer-auth.html?next=checkout.html';
    return;
  }

  const { data: customer } = await db.from('customers')
    .select('*').eq('user_id', user.id).maybeSingle();

  if (customer) {
    $('name').value = customer.name || user.user_metadata?.full_name || '';
    $('phone').value = customer.phone || '';
    $('address').value = customer.address || '';
    $('city').value = customer.city || '';
  }
}

async function placeOrder(e) {
  e.preventDefault();
  if (!cart.length) return show('Your cart is empty.', true);

  const button = $('placeOrder');
  button.disabled = true;

  try {
    const items = cart.map(x => ({
      product_id: x.product_id || x.id,
      quantity: Math.max(1, Number(x.quantity || 1))
    }));

    if (items.some(x => !x.product_id)) throw new Error('A cart item is missing its product ID.');

    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'cod';

    const { data: orderId, error } = await db.rpc('place_order_secure', {
      p_customer_id: user.id,
      p_customer_name: $('name').value.trim(),
      p_customer_phone: $('phone').value.trim(),
      p_customer_address: $('address').value.trim(),
      p_customer_city: $('city').value.trim(),
      p_payment_method: payment,
      p_items: items
    });

    if (error) throw error;

    await db.from('customers').upsert({
      user_id: user.id, email: user.email,
      name: $('name').value.trim(), phone: $('phone').value.trim(),
      address: $('address').value.trim(), city: $('city').value.trim()
    }, { onConflict: 'user_id' });

    localStorage.removeItem('cart');

    document.querySelector('.checkout-grid').innerHTML =
      `<section class="card"><div class="success-box">
        <h2>Order confirmed 🎉</h2>
        <p>Order #${String(orderId).slice(0,8)}</p>
        <p>Payment method: <strong>${payment === 'cod' ? 'Cash on Delivery' : 'Bank transfer'}</strong></p>
        <p>Your order is pending confirmation.</p>
        <a href="account.html">View My Orders</a> · <a href="index.html">Continue Shopping</a>
      </div></section>`;
  } catch (err) {
    console.error(err);
    show(err.message || 'Could not place the order.', true);
    button.disabled = false;
  }
}

renderCart();
init();
$('checkoutForm').addEventListener('submit', placeOrder);
