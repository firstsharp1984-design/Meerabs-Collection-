async function requireAdmin(){
 if(!db)return false;
 const {data:{session}}=await db.auth.getSession();
 if(!session){location.href="admin-login.html";return false}
 const {data,error}=await db.from("profiles").select("role").eq("id",session.user.id).single();
 if(error||!data||data.role!=="admin"){await db.auth.signOut();location.href="admin-login.html";return false}
 return true;
}

const demoProducts=[
{name:"Women's Embroidered Suit",price:2499,stock:24,cat:"Clothing"},
{name:"King Size Bedsheet Set",price:3199,stock:18,cat:"Bedding"},
{name:"Men's Casual Shirt",price:1799,stock:12,cat:"Clothing"},
{name:"Soft Fleece Blanket",price:2199,stock:5,cat:"Bedding"}
];
let db=null, products=[], orders=[], categories=[];
const $=id=>document.getElementById(id);
const money=n=>"Rs. "+Number(n||0).toLocaleString("en-PK");
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function showView(id){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");document.querySelectorAll(".side nav a").forEach(x=>x.classList.toggle("sel",x.dataset.view===id));if(id==="products")renderProducts();if(id==="orders")renderOrders()}
async function init(){
 $("today").textContent=new Date().toLocaleDateString("en-PK",{day:"2-digit",month:"short",year:"numeric"});
 if(window.SUPABASE_URL && !window.SUPABASE_URL.startsWith("YOUR_")){
   try{db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY); if(!(await requireAdmin())) return;
     let c=await db.from("categories").select("*").order("name"); if(c.error)throw c.error; categories=c.data||[];
     let p=await db.from("products").select("*,categories(name)").order("created_at",{ascending:false}); if(p.error)throw p.error; products=p.data||[];
     let o=await db.from("orders").select("*").order("created_at",{ascending:false}); if(o.error)throw o.error; orders=o.data||[];
     $("connectionStatus").textContent="● Connected to Supabase"; renderAll(); return;
   }catch(e){$("connectionStatus").textContent="Database error: "+e.message}
 }
 products=demoProducts; orders=[]; categories=[{id:"1",name:"Clothing"},{id:"2",name:"Bedding"},{id:"3",name:"Mix Items"}];$("connectionStatus").textContent="Demo mode — connect Supabase to save changes.";renderAll()
}
function renderAll(){renderStats();renderProducts();renderOrders();renderInventory();renderCustomers();fillCats()}
function renderStats(){const sales=orders.reduce((a,o)=>a+Number(o.total||0),0);$("statSales").textContent=money(sales);$("statOrders").textContent=orders.length;$("statProducts").textContent=products.filter(p=>p.is_active!==false).length;$("statCustomers").textContent=new Set(orders.map(o=>o.customer_phone||o.customer_email||o.customer_name)).size;$("analyticsSales").textContent=money(sales);$("orderBadge").textContent=orders.filter(o=>o.status==="processing").length}
function renderProducts(){const q=($("productSearch")?.value||"").toLowerCase();const list=products.filter(p=>!q||p.name.toLowerCase().includes(q));$("productTable").innerHTML=list.length?`<table><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr>${list.map(p=>`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.categories?.name||p.cat||"—")}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><button class="action" onclick="editProduct('${p.id||""}')">Edit</button> <button class="action" onclick="toggleProduct('${p.id||""}',${p.is_active===false})">${p.is_active===false?"Show":"Hide"}</button></td></tr>`).join("")}</table>`:"<p class=muted>No products yet.</p>"}
function renderOrders(){const q=($("orderSearch")?.value||"").toLowerCase(),s=$("orderStatus")?.value||"";const list=orders.filter(o=>(!q||(o.order_number+" "+o.customer_name+" "+(o.customer_phone||"")).toLowerCase().includes(q))&&(!s||o.status===s));$("orderTable").innerHTML=list.length?`<table><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr>${list.map(o=>`<tr><td>#${esc(o.order_number)}</td><td>${esc(o.customer_name)}</td><td>${money(o.total)}</td><td><span class="status ${o.status}">${esc(o.status)}</span></td><td><select onchange="updateOrder('${o.id}',this.value)"><option ${o.status==="processing"?"selected":""}>processing</option><option ${o.status==="shipped"?"selected":""}>shipped</option><option ${o.status==="delivered"?"selected":""}>delivered</option><option ${o.status==="cancelled"?"selected":""}>cancelled</option></select></td></tr>`).join("")}</table>`:"<p class=muted>No orders yet.</p>"}
function renderInventory(){$("inventoryTable").innerHTML=`<table><tr><th>Product</th><th>Stock</th><th>Health</th><th>Action</th></tr>${products.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.stock}</td><td>${p.stock<=5?"🔴 Low":p.stock<=15?"🟡 Watch":"🟢 Healthy"}</td><td><button class=action onclick="editProduct('${p.id||""}')">Update</button></td></tr>`).join("")}</table>`}
function renderCustomers(){const m={};orders.forEach(o=>{const k=o.customer_phone||o.customer_email||o.customer_name;m[k]??={name:o.customer_name,phone:o.customer_phone||"",orders:0,total:0};m[k].orders++;m[k].total+=Number(o.total||0)});const a=Object.values(m);$("customerTable").innerHTML=a.length?`<table><tr><th>Customer</th><th>Phone</th><th>Orders</th><th>Total</th></tr>${a.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.phone)}</td><td>${x.orders}</td><td>${money(x.total)}</td></tr>`).join("")}</table>`:"<p class=muted>Customers appear after orders.</p>"}
function fillCats(){const opts=categories.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");$("pCategory").innerHTML=opts}
function openModal(p=null){$("productModal").classList.add("open");$("productId").value=p?.id||"";$("pName").value=p?.name||"";$("pCategory").value=p?.category_id||categories[0]?.id||"";$("pPrice").value=p?.price??"";$("pOld").value=p?.compare_at_price||"";$("pStock").value=p?.stock??0;$("pBadge").value=p?.badge||"";$("pImage").value=p?.image_url||"";$("pDescription").value=p?.description||"";$("modalTitle").textContent=p?"Edit Product":"Add Product"}
function closeModal(){$("productModal").classList.remove("open")}
function editProduct(id){const p=products.find(x=>String(x.id)===String(id));if(p)openModal(p);else toast("Connect Supabase to edit products.")}
async function toggleProduct(id,active){if(!db)return toast("Demo mode — connect Supabase first.");const r=await db.from("products").update({is_active:active,updated_at:new Date().toISOString()}).eq("id",id);if(r.error)return toast(r.error.message);await $("logout").addEventListener("click",async()=>{if(db)await db.auth.signOut();location.href="admin-login.html"}); init();toast("Product updated")}
async function updateOrder(id,status){if(!db)return toast("Demo mode — connect Supabase first.");const r=await db.from("orders").update({status}).eq("id",id);if(r.error)return toast(r.error.message);await $("logout").addEventListener("click",async()=>{if(db)await db.auth.signOut();location.href="admin-login.html"}); init();toast("Order status updated")}
async function uploadProductImage(file){
 if(!file||!db)return "";
 const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
 const path=`${crypto.randomUUID()}.${ext}`;
 const r=await db.storage.from("product-images").upload(path,file,{upsert:false,contentType:file.type});
 if(r.error)throw r.error;
 return db.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}
$("productForm").addEventListener("submit",async e=>{e.preventDefault();if(!db)return toast("Connect Supabase first.");let imageUrl=$("pImage").value.trim();try{if($("pFile").files[0])imageUrl=await uploadProductImage($("pFile").files[0])}catch(err){return toast("Image upload failed: "+err.message)}const data={name:$("pName").value.trim(),category_id:$("pCategory").value||null,price:Number($("pPrice").value),compare_at_price:Number($("pOld").value||0),stock:Number($("pStock").value||0),badge:$("pBadge").value.trim(),image_url:imageUrl,description:$("pDescription").value.trim(),is_featured:$("pFeatured").checked,is_active:true,updated_at:new Date().toISOString()};const id=$("productId").value;let r;if(id)r=await db.from("products").update(data).eq("id",id);else{data.slug=data.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+Date.now();r=await db.from("products").insert(data)}if(r.error)return toast(r.error.message);closeModal();await $("logout").addEventListener("click",async()=>{if(db)await db.auth.signOut();location.href="admin-login.html"}); init();showView("products");toast(id?"Product updated":"Product added")});
document.querySelectorAll("[data-view]").forEach(x=>x.addEventListener("click",()=>showView(x.dataset.view)));
document.querySelectorAll("[data-action=add-product]").forEach(x=>x.addEventListener("click",()=>openModal()));
$("productSearch").addEventListener("input",renderProducts);$("orderSearch").addEventListener("input",renderOrders);$("orderStatus").addEventListener("change",renderOrders);
$("logout").addEventListener("click",async()=>{if(db)await db.auth.signOut();location.href="admin-login.html"}); init();
