const ready=window.SUPABASE_URL&&!window.SUPABASE_URL.startsWith("YOUR_");let sb=ready?window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY):null;
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!sb)return $("msg").textContent="Add your Supabase URL and public key first.";const {error}=await sb.auth.signInWithPassword({email:$("email").value,password:$("password").value});if(error)return $("msg").textContent=error.message;location.href="admin.html"});
function $(x){return document.getElementById(x)}
