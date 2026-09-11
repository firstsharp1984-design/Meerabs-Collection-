const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let signup = true;
const form = document.getElementById('authForm');
const btn = document.getElementById('submitBtn');
const toggle = document.getElementById('toggleMode');
const nameWrap = document.getElementById('nameWrap');
const msg = document.getElementById('message');

function message(text, error=false) {
  msg.innerHTML = `<p class="${error ? 'error' : 'success'}">${text}</p>`;
}

toggle.addEventListener('click', () => {
  signup = !signup;
  btn.textContent = signup ? 'Create account' : 'Sign in';
  nameWrap.style.display = signup ? 'block' : 'none';
  toggle.textContent = signup ? 'Already have an account? Sign in' : 'New customer? Create an account';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  btn.disabled = true;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const fullName = document.getElementById('fullName').value.trim();

  try {
    if (signup) {
      const { data, error } = await db.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      if (!data.session) {
        message('Account created. Please verify your email, then sign in.');
      } else {
        await db.from('customers').upsert({
          user_id: data.user.id, name: fullName, email
        }, { onConflict: 'user_id' });
        location.href = 'account.html';
      }
    } else {
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      location.href = 'account.html';
    }
  } catch (err) {
    message(err.message || 'Authentication failed.', true);
  } finally {
    btn.disabled = false;
  }
});
