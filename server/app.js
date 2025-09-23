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

// Registro simple en memoria
const users = [];

// Endpoints esperados por el frontend
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

app.post('/api/register', (req, res) => {
  const { name, email, role } = req.body || {};
  const allowed = ['aprendiz', 'empresa', 'trabajador'];
  if (!name || !email || !role || !allowed.includes(String(role).toLowerCase())) {
    return res.status(400).json({ error: 'Datos inválidos. name, email, role(aprendiz|empresa|trabajador)' });
  }
  const user = { id: nanoid(), name, email, role: String(role).toLowerCase(), createdAt: new Date().toISOString() };
  users.push(user);
  res.status(201).json(user);
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});







