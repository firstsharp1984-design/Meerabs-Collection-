const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const cart = JSON.parse(localStorage.getItem('cart') || '[]');
let user = null;
let products = [];

function money(n){ return `PKR ${Number(n||0).toLocaleString()}`; }
function msg(text,error=false){
  document.getElementById('message').innerHTML =
    `<div class="${error?'error':'success-box'}">${text}</div>`;
}

function renderCart(){
  const el=document.getElementById('cart');
  if(!cart.length){
    el.innerHTML='<p class="muted">Your cart is empty. <a href="index.html">Continue shopping</a>.</p>';
    document.getElementById('placeOrder').disabled=true;
    return;
  }
  let total=0;
  el.innerHTML=cart.map(item=>{
    const line=Number(item.price||0)*Number(item.quantity||1);
    total+=line;
    return `<div class="cart-line"><span>${item.name} × ${item.quantity||1}</span><strong>${money(line)}</strong></div>`;
  }).join('');
  document.getElementById('grandTotal').textContent=money(total);
}

async function loadSession(){
  const {data}=await db.auth.getSession();
  user=data.session?.user || null;
  if(user){
    const {data:c}=await db.from('customers').select('*').eq('user_id',user.id).maybeSingle();
    if(c){
      name.value=c.name||user.user_metadata?.full_name||'';
      phone.value=c.phone||'';
      address.value=c.address||'';
      city.value=c.city||'';
    }
  }
}

async function placeOrder(e){
  e.preventDefault();
  if(!cart.length) return msg('Your cart is empty.',true);
  const button=document.getElementById('placeOrder');
  button.disabled=true;

  try{
    // Step 6 uses the signed-in customer's UUID. Guest checkout can be added later
    // with a trusted server function that creates an anonymous order safely.
    if(!user){
      location.href='customer-auth.html?next=checkout.html';
      return;
    }

    // Refresh prices from the database before creating the order.
    // The browser's localStorage price is NOT trusted for this calculation.
    const ids=cart.map(x=>x.product_id||x.id).filter(Boolean);
    const {data:dbProducts,error:productError}=await db.from('products')
      .select('id,name,price,stock,active').in('id',ids);
    if(productError) throw productError;
    products=dbProducts||[];

    const lines=cart.map(item=>{
      const id=item.product_id||item.id;
      const p=products.find(x=>String(x.id)===String(id));
      if(!p || p.active===false) throw new Error(`Product unavailable: ${item.name}`);
      const qty=Math.max(1,Number(item.quantity||1));
      if(p.stock != null && qty>Number(p.stock)) throw new Error(`Not enough stock for ${p.name}`);
      return {product_id:p.id, name:p.name, quantity:qty, unit_price:Number(p.price)};
    });

    const total=lines.reduce((s,l)=>s+l.quantity*l.unit_price,0);
    const payment=document.querySelector('input[name="payment"]:checked').value;

    const {data:order,error:orderError}=await db.from('orders').insert({
      customer_id:user.id,
      total,
      status:'pending',
      payment_method:payment,
      customer_name:name.value.trim(),
      customer_phone:phone.value.trim(),
      customer_address:address.value.trim(),
      customer_city:city.value.trim()
    }).select('id,total,status').single();
    if(orderError) throw orderError;

    const items=lines.map(l=>({
      order_id:order.id,
      product_id:l.product_id,
      quantity:l.quantity,
      price:l.unit_price
    }));
    const {error:itemError}=await db.from('order_items').insert(items);
    if(itemError) throw itemError;

    await db.from('customers').upsert({
      user_id:user.id,email:user.email,name:name.value.trim(),
      phone:phone.value.trim(),address:address.value.trim(),city:city.value.trim()
    },{onConflict:'user_id'});

    localStorage.removeItem('cart');
    document.querySelector('.checkout-grid').innerHTML=
      `<section class="card"><div class="success-box">
        <h2>Order placed successfully 🎉</h2>
        <p>Order #${String(order.id).slice(0,8)}</p>
        <p>Total: <strong>${money(order.total)}</strong></p>
        <p>Payment: <strong>${payment==='cod'?'Cash on Delivery':'Bank transfer'}</strong></p>
        <p>Your order is currently <strong>pending</strong>.</p>
        <a href="account.html">View My Orders</a> · <a href="index.html">Continue Shopping</a>
      </div></section>`;
  }catch(err){
    console.error(err);
    msg(err.message||'Could not place the order.',true);
    button.disabled=false;
  }
}

renderCart();
loadSession();
document.getElementById('checkoutForm').addEventListener('submit',placeOrder);
