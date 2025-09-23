const API = 'http://localhost:3001/api';

function renderStars(rating = 0) {
  const full = Math.round(rating);
  return '★★★★★☆☆☆☆☆'.slice(5 - Math.min(full, 5), 10 - Math.min(full, 5));
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error HTTP');
  return res.json();
}

function renderCourses(items) {
  const grid = document.getElementById('courses');
  grid.innerHTML = '';
  const tpl = document.getElementById('card-course');
  items.forEach(item => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.title').textContent = item.title;
    node.querySelector('.meta').textContent = `${item.area}`;
    node.querySelector('.pro').textContent = `${item.professional.name} · ⭐ ${item.professional.rating}`;
    grid.appendChild(node);
  });
}

function renderProfessionals(items) {
  const grid = document.getElementById('professionals');
  grid.innerHTML = '';
  const tpl = document.getElementById('card-professional');
  items.forEach(p => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.title').textContent = p.name;
    node.querySelector('.meta').textContent = `${p.areas.join(', ')} · ${p.city}`;
    node.querySelector('.stars').textContent = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
    node.querySelector('[data-action="review"]').addEventListener('click', () => openReviewModal(p.id, p.name));
    grid.appendChild(node);
  });
}

async function loadAll() {
  const q = document.getElementById('search').value.trim();
  const area = document.getElementById('filter-area').value;
  const city = document.getElementById('filter-city').value;
  const params = new URLSearchParams({ q, area, city });
  const [courses, pros] = await Promise.all([
    fetchJSON(`${API}/courses?${new URLSearchParams({ q, area })}`),
    fetchJSON(`${API}/professionals?${params}`)
  ]);
  renderCourses(courses.filter(c => c.featured));
  renderProfessionals(pros);
}

document.getElementById('btn-search').addEventListener('click', loadAll);
['search','filter-area','filter-city'].forEach(id => {
  document.getElementById(id).addEventListener('change', loadAll);
});

loadAll();

// Registro rápido
document.getElementById('form-register').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const role = document.getElementById('reg-role').value;
  const msg = document.getElementById('reg-msg');
  msg.textContent = 'Enviando...';
  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });
    if (!res.ok) throw new Error('Error en registro');
    const data = await res.json();
    msg.textContent = `Registrado: ${data.name} (${data.role})`;
    e.target.reset();
  } catch (err) {
    msg.textContent = 'No se pudo registrar.';
  }
});

// Modal reseña
const modal = document.getElementById('modal');
function openReviewModal(profId, name){
  document.getElementById('rev-prof-id').value = profId;
  document.getElementById('rev-msg').textContent = '';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
}

modal.addEventListener('click', (e)=>{
  if (e.target.matches('[data-action="close"], .modal-backdrop')) closeModal();
});

document.getElementById('form-review').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const profId = document.getElementById('rev-prof-id').value;
  const user = document.getElementById('rev-user').value.trim() || 'Anónimo';
  const stars = Number(document.getElementById('rev-stars').value || 5);
  const comment = document.getElementById('rev-comment').value.trim();
  const msg = document.getElementById('rev-msg');
  msg.textContent = 'Enviando...';
  try{
    const res = await fetch(`${API}/professionals/${profId}/reviews`,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ user, stars, comment })
    });
    if(!res.ok) throw new Error('error');
    await res.json();
    msg.textContent = '¡Gracias por tu reseña!';
    setTimeout(()=>{ closeModal(); loadAll(); }, 600);
  }catch(err){ msg.textContent = 'No se pudo enviar.'; }
});


