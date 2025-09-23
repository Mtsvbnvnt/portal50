import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Datos en memoria (demo)
const professionals = [
  {
    id: nanoid(),
    name: 'Ana Torres',
    areas: ['Marketing Digital', 'SEO'],
    city: 'Buenos Aires',
    rating: 4.7,
    reviews: [
      { id: nanoid(), user: 'Julián', stars: 5, comment: 'Excelente clase y material.' },
      { id: nanoid(), user: 'Valentina', stars: 4, comment: 'Muy clara al explicar.' }
    ]
  },
  {
    id: nanoid(),
    name: 'Carlos Pérez',
    areas: ['Programación', 'JavaScript'],
    city: 'CDMX',
    rating: 4.5,
    reviews: [
      { id: nanoid(), user: 'Luis', stars: 5, comment: 'Aprendí mucho de JS moderno.' }
    ]
  },
  {
    id: nanoid(),
    name: 'María Gómez',
    areas: ['Diseño UX/UI'],
    city: 'Lima',
    rating: 4.8,
    reviews: []
  }
];

const courses = [
  { id: nanoid(), title: 'Introducción a SEO', area: 'Marketing Digital', featured: true, professionalId: professionals[0].id },
  { id: nanoid(), title: 'JavaScript desde 0', area: 'Programación', featured: true, professionalId: professionals[1].id },
  { id: nanoid(), title: 'Figma para principiantes', area: 'Diseño UX/UI', featured: false, professionalId: professionals[2].id }
];

// Endpoints
app.get('/api/courses', (req, res) => {
  const { q, area } = req.query;
  let results = courses.map(c => ({
    ...c,
    professional: professionals.find(p => p.id === c.professionalId)
  }));
  if (area) results = results.filter(c => c.area.toLowerCase().includes(String(area).toLowerCase()));
  if (q) {
    const query = String(q).toLowerCase();
    results = results.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.professional.name.toLowerCase().includes(query) ||
      c.area.toLowerCase().includes(query)
    );
  }
  res.json(results);
});

app.get('/api/professionals', (req, res) => {
  const { q, area, city } = req.query;
  let results = [...professionals];
  if (area) results = results.filter(p => p.areas.join(' ').toLowerCase().includes(String(area).toLowerCase()));
  if (city) results = results.filter(p => p.city.toLowerCase().includes(String(city).toLowerCase()));
  if (q) {
    const query = String(q).toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(query) || p.areas.join(' ').toLowerCase().includes(query));
  }
  res.json(results);
});

app.post('/api/professionals/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { user, stars, comment } = req.body;
  const prof = professionals.find(p => p.id === id);
  if (!prof) return res.status(404).json({ error: 'Profesional no encontrado' });
  const review = { id: nanoid(), user: user || 'Anónimo', stars: Number(stars) || 5, comment: comment || '' };
  prof.reviews.push(review);
  // recalcular rating simple
  const sum = prof.reviews.reduce((acc, r) => acc + Number(r.stars || 0), 0);
  prof.rating = Number((sum / prof.reviews.length).toFixed(2));
  res.status(201).json(review);
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

import express from 'express';\nimport cors from 'cors';\nimport path from 'path';\nimport { fileURLToPath } from 'url';\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\n\n// Datos demo en memoria\nconst areas = ['Programaci�n', 'Dise�o', 'Marketing', 'Idiomas'];\nconst professionals = [\n  { id: 'p1', name: 'Ana Garc�a', area: 'Programaci�n', city: 'Buenos Aires', rating: 4.7, reviews: 18, bio: 'Full-stack JS, clases pr�cticas y proyectos.' },\n  { id: 'p2', name: 'Luis P�rez', area: 'Dise�o', city: 'Santiago', rating: 4.9, reviews: 25, bio: 'UI/UX y prototipado r�pido en Figma.' },\n  { id: 'p3', name: 'Mar�a L�pez', area: 'Idiomas', city: 'Lima', rating: 4.5, reviews: 40, bio: 'Ingl�s conversacional y preparaci�n IELTS.' },\n  { id: 'p4', name: 'Carlos Ruiz', area: 'Marketing', city: 'CDMX', rating: 4.6, reviews: 31, bio: 'Ads, SEO y crecimiento org�nico.' }\n];\nconst courses = [\n  { id: 'c1', title: 'JavaScript desde cero', area: 'Programaci�n', featured: true, teacherId: 'p1' },\n  { id: 'c2', title: 'Dise�o de interfaces', area: 'Dise�o', featured: true, teacherId: 'p2' },\n  { id: 'c3', title: 'Ingl�s conversacional', area: 'Idiomas', featured: false, teacherId: 'p3' }\n];\nconst reviews = [\n  { id: 'r1', professionalId: 'p1', stars: 5, comment: 'Excelente clase!' },\n  { id: 'r2', professionalId: 'p2', stars: 5, comment: 'Muy claro y pr�ctico.' }\n];\n\n// Endpoints\napp.get('/api/areas', (req, res) => { res.json(areas); });\n\napp.get('/api/courses', (req, res) => {\n  const { q, area } = req.query;\n  const filtered = courses.filter(c =>\n    (!area || c.area === area) && (!q || c.title.toLowerCase().includes(String(q).toLowerCase()))\n  );\n  res.json(filtered.map(c => ({ ...c, teacher: professionals.find(p => p.id === c.teacherId) })));\n});\n\napp.get('/api/professionals', (req, res) => {\n  const { q, area, city, sort } = req.query;\n  let list = professionals.filter(p =>\n    (!area || p.area === area) && (!city || p.city.toLowerCase() === String(city).toLowerCase()) && (!q || (p.name + ' ' + p.bio).toLowerCase().includes(String(q).toLowerCase()))\n  );\n  if (sort === 'rating') list = list.sort((a,b) => b.rating - a.rating);\n  if (sort === 'reviews') list = list.sort((a,b) => b.reviews - a.reviews);\n  res.json(list);\n});\n\napp.get('/api/reviews/:professionalId', (req, res) => {\n  const { professionalId } = req.params;\n  res.json(reviews.filter(r => r.professionalId === professionalId));\n});\n\napp.post('/api/reviews', (req, res) => {\n  const { professionalId, stars, comment } = req.body;\n  if (!professionalId || !stars) return res.status(400).json({ error: 'Datos incompletos' });\n  const id = 'r' + (reviews.length + 1);\n  reviews.push({ id, professionalId, stars: Number(stars), comment: comment || '' });\n  const prof = professionals.find(p => p.id === professionalId);\n  if (prof) {\n    const profReviews = reviews.filter(r => r.professionalId === professionalId);\n    prof.reviews = profReviews.length;\n    prof.rating = Number((profReviews.reduce((s,r) => s + r.stars, 0) / profReviews.length).toFixed(1));\n  }\n  res.status(201).json({ ok: true });\n});\n\n// Servir frontend\napp.use(express.static(path.join(__dirname, '..', 'public')));\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(Servidor escuchando en http://localhost:);\n});\n
