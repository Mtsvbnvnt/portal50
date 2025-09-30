import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// Rutas
import userRoutes from './routes/user.routes';
import jobRoutes from './routes/job.routes';
import postulacionRoutes from './routes/postulacion.routes';
import cursoRoutes from './routes/curso.routes';
import mensajeRoutes from './routes/mensaje.routes';
import adminRoutes from './routes/admin.routes';
import evaluacionRoutes from './routes/evaluacion.routes';
import empresaRoutes from './routes/empresa.routes';

// Config
import { swaggerSpec } from './config/swagger';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Archivos estáticos (subidas)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ping de prueba
app.get('/ping', (_, res) => {
  console.log('📡 Ping recibido');
  res.send('pong');
});

// Root de la API
app.get('/', (_, res) => {
  res.json({
    message: '🚀 Portal50+ API corriendo en Railway',
    status: 'OK',
    timestamp: new Date().toISOString(),
    docs: '/api/docs'
  });
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluacion', evaluacionRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================================
// 🔗 Conexión a MongoDB
// =============================================
const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
  console.warn("⚠️ No se encontró MONGO_URL - API funcionará sin base de datos");
} else {
  mongoose.connect(MONGO_URL, {
    // Opciones recomendadas para Mongoose 7+
  })
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => {
      console.error("❌ Error conectando a MongoDB:", err);
      console.warn("⚠️ API continuará sin base de datos");
    });
}

// =============================================
// 🚀 Iniciar servidor (independiente de MongoDB)
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
  console.log(`📚 Documentación en: http://localhost:${PORT}/api/docs`);
  console.log(`🔗 Health check: http://localhost:${PORT}/ping`);
});
