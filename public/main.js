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


