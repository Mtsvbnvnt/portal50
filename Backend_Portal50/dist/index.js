"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Rutas
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const postulacion_routes_1 = __importDefault(require("./routes/postulacion.routes"));
const curso_routes_1 = __importDefault(require("./routes/curso.routes"));
const mensaje_routes_1 = __importDefault(require("./routes/mensaje.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const evaluacion_routes_1 = __importDefault(require("./routes/evaluacion.routes"));
const empresa_routes_1 = __importDefault(require("./routes/empresa.routes"));
const solicitudEmpleo_routes_1 = __importDefault(require("./routes/solicitudEmpleo.routes"));
// Config
const swagger_1 = require("./config/swagger");
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// CORS configurado para acceso externo
app.use((0, cors_1.default)({
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
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
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
app.use('/api/users', user_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/postulaciones', postulacion_routes_1.default);
app.use('/api/cursos', curso_routes_1.default);
app.use('/api/mensajes', mensaje_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/evaluacion', evaluacion_routes_1.default);
app.use('/api/empresas', empresa_routes_1.default);
app.use('/api/solicitudes-empleo', solicitudEmpleo_routes_1.default);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Conectar a BD y iniciar servidor
(0, db_1.default)().then(() => {
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
            networkInterfaces[interfaceName].forEach((iface) => {
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
// Export para uso en Vercel
exports.default = app;
