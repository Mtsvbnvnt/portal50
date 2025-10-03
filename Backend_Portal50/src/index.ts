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
import connectDB from './config/db';
connectDB();
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configurado para acceso externo
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    // Permitir acceso desde cualquier IP en red local
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}(:\d+)?$/,
    // Agregar aquí IPs específicas si es necesario
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Archivos estáticos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/ping', (_, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (_, res) => {
  res.json({
    message: '🚀 Portal50+ API',
    status: 'OK',
    version: '1.0.0',
    docs: '/api/docs'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluacion', evaluacionRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Conectar a BD y iniciar servidor
connectDB().then(() => {
  const PORT = Number(process.env.PORT) || 3001;
  const HOST = process.env.HOST || '0.0.0.0'; // Escuchar en todas las interfaces
  
  app.listen(PORT, HOST, () => {
    console.log(`🚀 API corriendo en ${HOST}:${PORT}`);
    console.log(`🌐 Acceso externo habilitado - IP: http://tu-ip:${PORT}`);
    console.log(`📚 Documentación: http://${HOST}:${PORT}/api/docs`);
    console.log(`🔗 Health check: http://${HOST}:${PORT}/ping`);
    
    // Mostrar IPs de red local si es posible
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    console.log('\n📡 Interfaces de red disponibles:');
    Object.keys(networkInterfaces).forEach(interfaceName => {
      networkInterfaces[interfaceName].forEach((iface: any) => {
        if (!iface.internal && iface.family === 'IPv4') {
          console.log(`   💻 ${interfaceName}: http://${iface.address}:${PORT}`);
        }
      });
    });
  });
}).catch((err) => {
  console.warn("⚠️ Iniciando servidor sin BD:", err?.message);
  const PORT = Number(process.env.PORT) || 3001;
  const HOST = process.env.HOST || '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    console.log(`🚀 API corriendo en ${HOST}:${PORT} (sin BD)`);
    console.log(`🌐 Acceso externo habilitado`);
  });
});