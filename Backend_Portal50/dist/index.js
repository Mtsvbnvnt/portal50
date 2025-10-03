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
// Config
const swagger_1 = require("./config/swagger");
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
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
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Conectar a BD y iniciar servidor
(0, db_1.default)().then(() => {
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`🚀 API corriendo en puerto ${PORT}`);
        console.log(`📚 Documentación: http://localhost:${PORT}/api/docs`);
        console.log(`🔗 Health check: http://localhost:${PORT}/ping`);
    });
}).catch((err) => {
    console.warn("⚠️ Iniciando servidor sin BD:", err?.message);
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`🚀 API corriendo en puerto ${PORT} (sin BD)`);
    });
});
