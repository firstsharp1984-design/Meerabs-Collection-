// Optional Step 7 admin helper.
// Add a script tag to admin.html after admin.js if you want low-stock alerts.
async function loadLowStock(db) {
  const { data, error } = await db.from('products')
    .select('id,name,stock,active')
    .eq('active', true)
    .lte('stock', 5)
    .order('stock', { ascending: true });

  if (error) return console.warn('Low-stock query:', error.message);
  const box = document.getElementById('lowStock');
  if (!box) return;
  box.innerHTML = data?.length
    ? data.map(p => `<div>${p.name}: <strong>${p.stock ?? 0}</strong> left</div>`).join('')
    : '<div>No low-stock products.</div>';
}
