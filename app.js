const demoProducts=[
{id:1,name:"Women's Embroidered Suit",price:2499,old:3499,emoji:"👗",badge:"Sale",rating:4.8,cat:"Clothing"},
{id:2,name:"King Size Bedsheet Set",price:3199,old:0,emoji:"🛏️",badge:"New",rating:4.7,cat:"Bedding"},
{id:3,name:"Men's Casual Shirt",price:1799,old:0,emoji:"👔",badge:"",rating:4.6,cat:"Clothing"},
{id:4,name:"Soft Fleece Blanket",price:2199,old:2999,emoji:"🧶",badge:"Sale",rating:4.8,cat:"Bedding"},
{id:5,name:"Kitchen Cookware Set",price:4499,old:0,emoji:"🍲",badge:"New",rating:4.5,cat:"Mix Items"},
{id:6,name:"Cushion Cover Set (5 Pcs)",price:1299,old:1799,emoji:"🛋️",badge:"Sale",rating:4.7,cat:"Bedding"},
{id:7,name:"Cotton 3-Piece Suit",price:2899,old:0,emoji:"🥻",badge:"New",rating:4.6,cat:"Clothing"},
{id:8,name:"Home Storage Basket",price:999,old:1199,emoji:"🧺",badge:"",rating:4.4,cat:"Mix Items"}
];
let products=[...demoProducts];
let cart=JSON.parse(localStorage.getItem("meerabCart")||"[]");
let supabaseClient=null;

function money(n){return "Rs. "+Number(n).toLocaleString("en-PK")}
function slugify(s){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}

async function initSupabase(){
  if(!window.supabase || !window.SUPABASE_URL || window.SUPABASE_URL.startsWith("YOUR_")) return false;
  try{
    supabaseClient=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
    const {data,error}=await supabaseClient.from("products").select("*,categories(name)").eq("is_active",true).order("created_at",{ascending:false});
    if(error) throw error;
    if(data && data.length){
      products=data.map(p=>({id:p.id,name:p.name,price:Number(p.price),old:Number(p.compare_at_price||0),emoji:"🛍️",badge:p.badge||"",rating:Number(p.rating||0),cat:p.categories?.name||"Mix Items",image:p.image_url||""}));
    }
    return true;
  }catch(e){
    console.warn("Supabase is not connected yet:",e.message);
    return false;
  }
}

function renderProducts(list=products){
 document.getElementById("productGrid").innerHTML=list.map(p=>`<article class="product"><div class="product-img">${p.image?`<img src="${p.image}" alt="">`:`<span>${p.emoji}</span>`}${p.badge?`<span class="badge ${p.badge==="New"?"new":""}">${p.badge}</span>`:""}</div><div class="product-info"><h3>${p.name}</h3><div class="stars">★★★★★ <span>(${p.rating||"New"})</span></div><div class="price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:""}</div><button class="add" onclick="addToCart('${String(p.id).replaceAll("'","")}')">Add to Cart</button></div></article>`).join("");
}

function addToCart(id){
 const p=products.find(x=>String(x.id)===String(id));
 if(!p)return;
 const item=cart.find(x=>String(x.id)===String(id));
 item?item.qty++:cart.push({...p,qty:1});
 saveCart();openCart();
}
function saveCart(){
 localStorage.setItem("meerabCart",JSON.stringify(cart));
 document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
 renderCart();
}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML="<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent="Rs. 0";return}
 box.innerHTML=cart.map(x=>`<div class="cart-row"><div class="mini">${x.image?`<img src="${x.image}" alt="">`:x.emoji}</div><div style="flex:1"><b>${x.name}</b><div>${money(x.price)} × ${x.qty}</div><button onclick="removeItem('${x.id}')">Remove</button></div></div>`).join("");
 document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
function removeItem(id){cart=cart.filter(x=>String(x.id)!==String(id));saveCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function searchProducts(){const q=document.getElementById("searchInput").value.toLowerCase();renderProducts(products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q)));document.getElementById("featured").scrollIntoView({behavior:"smooth"})}

async function checkout(){
 if(!cart.length)return alert("Your cart is empty.");
 if(!supabaseClient)return alert("Checkout is ready for the next connection step. Add your Supabase URL + anon/publishable key in supabase-config.js first.");
 const customerName=prompt("Customer name:");
 if(!customerName)return;
 const phone=prompt("Phone number:");
 if(!phone)return;
 const address=prompt("Delivery address:");
 if(!address)return;
 const subtotal=cart.reduce((a,x)=>a+x.price*x.qty,0);
 const orderNumber="MC-"+Date.now().toString().slice(-6);
 const {data:order,error}=await supabaseClient.from("orders").insert({
   order_number:orderNumber,customer_name:customerName,customer_phone:phone,
   shipping_address:address,payment_method:"COD",payment_status:"pending",
   status:"processing",subtotal,delivery_fee:0,total:subtotal
 }).select().single();
 if(error)return alert("Could not create order: "+error.message);
 const rows=cart.map(x=>({order_id:order.id,product_id:typeof x.id==="string"?x.id:null,product_name:x.name,quantity:x.qty,unit_price:x.price,line_total:x.price*x.qty}));
 const {error:itemError}=await supabaseClient.from("order_items").insert(rows);
 if(itemError)return alert("Order was created, but items need attention: "+itemError.message);
 cart=[];saveCart();closeCart();
 alert(`Order ${orderNumber} placed successfully. Payment: Cash on Delivery.`);
}

document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")searchProducts()});
(async()=>{await initSupabase();renderProducts();saveCart()})();
