const products=[
{id:1,name:"Women's Embroidered Suit",price:2499,old:3499,emoji:"👗",badge:"Sale",rating:4.8,cat:"Clothing"},
{id:2,name:"King Size Bedsheet Set",price:3199,old:0,emoji:"🛏️",badge:"New",rating:4.7,cat:"Bedding"},
{id:3,name:"Men's Casual Shirt",price:1799,old:0,emoji:"👔",badge:"",rating:4.6,cat:"Clothing"},
{id:4,name:"Soft Fleece Blanket",price:2199,old:2999,emoji:"🧶",badge:"Sale",rating:4.8,cat:"Bedding"},
{id:5,name:"Kitchen Cookware Set",price:4499,old:0,emoji:"🍲",badge:"New",rating:4.5,cat:"Mix Items"},
{id:6,name:"Cushion Cover Set (5 Pcs)",price:1299,old:1799,emoji:"🛋️",badge:"Sale",rating:4.7,cat:"Bedding"},
{id:7,name:"Cotton 3-Piece Suit",price:2899,old:0,emoji:"🥻",badge:"New",rating:4.6,cat:"Clothing"},
{id:8,name:"Home Storage Basket",price:999,old:1199,emoji:"🧺",badge:"",rating:4.4,cat:"Mix Items"}
];
let cart=JSON.parse(localStorage.getItem("meerabCart")||"[]");
function money(n){return "Rs. "+n.toLocaleString("en-PK")}
function renderProducts(list=products){
 document.getElementById("productGrid").innerHTML=list.map(p=>`<article class="product"><div class="product-img"><span>${p.emoji}</span>${p.badge?`<span class="badge ${p.badge==="New"?"new":""}">${p.badge}</span>`:""}</div><div class="product-info"><h3>${p.name}</h3><div class="stars">★★★★★ <span>(${p.rating})</span></div><div class="price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:""}</div><button class="add" onclick="addToCart(${p.id})">Add to Cart</button></div></article>`).join("");
}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});saveCart();openCart()}
function saveCart(){localStorage.setItem("meerabCart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);renderCart()}
function renderCart(){const box=document.getElementById("cartItems");if(!cart.length){box.innerHTML="<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent="Rs. 0";return}box.innerHTML=cart.map(x=>`<div class="cart-row"><div class="mini">${x.emoji}</div><div style="flex:1"><b>${x.name}</b><div>${money(x.price)} × ${x.qty}</div><button onclick="removeItem(${x.id})">Remove</button></div></div>`).join("");document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0))}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function searchProducts(){const q=document.getElementById("searchInput").value.toLowerCase();renderProducts(products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q)));document.getElementById("featured").scrollIntoView({behavior:"smooth"})}
function checkout(){if(!cart.length)return alert("Your cart is empty.");alert("Checkout demo ready. Next step is connecting Supabase + your preferred payment/COD workflow.");}
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")searchProducts()});
renderProducts();saveCart();
