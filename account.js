const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let user;

function show(text, error=false) {
  document.getElementById('message').innerHTML = `<p class="${error?'error':'success'}">${text}</p>`;
}

async function init() {
  const { data } = await db.auth.getSession();
  user = data.session?.user;
  if (!user) { location.href = 'customer-auth.html'; return; }

  document.getElementById('welcome').textContent = user.email;

  let { data: customer, error } = await db.from('customers').select('*').eq('user_id', user.id).maybeSingle();
  if (error) console.warn(error);
  if (!customer) {
    await db.from('customers').insert({user_id:user.id,email:user.email});
    customer = {email:user.email};
  }
  document.getElementById('name').value = customer.name || user.user_metadata?.full_name || '';
  document.getElementById('phone').value = customer.phone || '';
  document.getElementById('address').value = customer.address || '';
  document.getElementById('city').value = customer.city || '';

  const { data: orders, error: orderError } = await db.from('orders')
    .select('id,created_at,total,status')
    .eq('customer_id', user.id)
    .order('created_at',{ascending:false});
  if (orderError) {
    document.getElementById('orders').innerHTML = '<p class="muted">Orders are not yet connected to customer accounts. Apply the Step 5 SQL policies/schema first.</p>';
    return;
  }
  document.getElementById('orders').innerHTML = orders?.length
    ? orders.map(o => `<div class="order"><strong>Order #${String(o.id).slice(0,8)}</strong><br><span class="muted">${new Date(o.created_at).toLocaleString()} · ${o.status || 'pending'}</span><br><b>PKR ${Number(o.total||0).toLocaleString()}</b></div>`).join('')
    : '<p class="muted">You have no orders yet.</p>';
}

document.getElementById('profileForm').addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    user_id:user.id, name:document.getElementById('name').value.trim(),
    phone:document.getElementById('phone').value.trim(),
    address:document.getElementById('address').value.trim(),
    city:document.getElementById('city').value.trim(), email:user.email
  };
  const { error } = await db.from('customers').upsert(payload,{onConflict:'user_id'});
  if (error) show(error.message,true); else show('Profile saved.');
});

document.getElementById('logout').addEventListener('click', async ()=>{
  await db.auth.signOut(); location.href='customer-auth.html';
});
init();
