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
const bookings = [];
const professionals = [
  {
    id: nanoid(),
    name: 'Ana Torres',
    areas: ['Marketing Digital', 'SEO'],
    city: 'Buenos Aires',
    rating: 4.7,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    availability: [
      // ISO strings de slots disponibles (ejemplo)
      // Hoy + próximos 5 días, 10:00 y 16:00 locales
    ],
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
    videoUrl: 'https://www.youtube.com/embed/3GwjfUFyY6M',
    availability: [],
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
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
    availability: [],
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

// Detalle de profesional
app.get('/api/professionals/:id', (req, res) => {
  const { id } = req.params;
  const prof = professionals.find(p => p.id === id);
  if (!prof) return res.status(404).json({ error: 'Profesional no encontrado' });
  res.json(prof);
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

// Generar disponibilidad simple si no existe: próximos 7 días a las 10:00 y 16:00
function ensureAvailability(prof) {
  if (prof.availability && prof.availability.length > 0) return;
  const slots = [];
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    [10, 16].forEach(hour => {
      const slot = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, 0, 0));
      slots.push(slot.toISOString());
    });
  }
  prof.availability = slots;
}

// Disponibilidad del profesional
app.get('/api/professionals/:id/availability', (req, res) => {
  const { id } = req.params;
  const prof = professionals.find(p => p.id === id);
  if (!prof) return res.status(404).json({ error: 'Profesional no encontrado' });
  ensureAvailability(prof);
  // Excluir slots ya reservados
  const reserved = new Set(bookings.filter(b => b.professionalId === id).flatMap(b => b.slots));
  const available = prof.availability.filter(s => !reserved.has(s));
  res.json({ professionalId: id, slots: available });
});

// Checkout simulado
app.post('/api/checkout', (req, res) => {
  const { professionalId, classes = 1 } = req.body || {};
  const prof = professionals.find(p => p.id === String(professionalId));
  if (!prof) return res.status(404).json({ error: 'Profesional no encontrado' });
  const bookingId = nanoid();
  // No confirmamos horarios aún, sólo autorizamos una compra
  bookings.push({ id: bookingId, professionalId: prof.id, classes: Number(classes) || 1, slots: [] });
  res.status(201).json({ bookingId });
});

// Confirmar reservas para una compra
app.post('/api/bookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const { slots } = req.body || {};
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return res.status(404).json({ error: 'Compra no encontrada' });
  if (!Array.isArray(slots) || slots.length === 0) return res.status(400).json({ error: 'Slots requeridos' });
  if (slots.length > booking.classes) return res.status(400).json({ error: 'Excede cantidad de clases compradas' });

  // Validar disponibilidad
  const prof = professionals.find(p => p.id === booking.professionalId);
  ensureAvailability(prof);
  const reserved = new Set(bookings.filter(b => b.professionalId === prof.id).flatMap(b => b.slots));
  for (const s of slots) {
    if (!prof.availability.includes(s) || reserved.has(s)) {
      return res.status(400).json({ error: 'Al menos uno de los horarios no está disponible', slot: s });
    }
  }
  booking.slots = slots;
  res.status(201).json({ ok: true, booking });
});

// Obtener una compra
app.get('/api/bookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return res.status(404).json({ error: 'Compra no encontrada' });
  res.json(booking);
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







