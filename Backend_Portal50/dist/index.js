"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const cors_1 = __importDefault(require("cors"));
const postulacion_routes_1 = __importDefault(require("./routes/postulacion.routes"));
const curso_routes_1 = __importDefault(require("./routes/curso.routes"));
const mensaje_routes_1 = __importDefault(require("./routes/mensaje.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const evaluacion_routes_1 = __importDefault(require("./routes/evaluacion.routes"));
const db_1 = require("./config/db");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const empresa_routes_1 = __importDefault(require("./routes/empresa.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get('/ping', (_, res) => {
    console.log('📡 Ping recibido');
    res.send('pong');
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Middlewares
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Rutas
app.use('/api/users', user_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/postulaciones', postulacion_routes_1.default);
app.use('/api/cursos', curso_routes_1.default);
app.use('/api/mensajes', mensaje_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/evaluacion', evaluacion_routes_1.default);
app.use('/api/empresas', empresa_routes_1.default);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Conexión a BD y arranque del servidor
(0, db_1.connectDB)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en puerto ${PORT}`);
});
