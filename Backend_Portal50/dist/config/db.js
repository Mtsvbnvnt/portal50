"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) {
            console.warn("⚠️ No se encontró MONGO_URL, API funcionará sin base de datos");
            return;
        }
        // Configuración para conexión externa/remota
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Mantener hasta 10 conexiones en el pool
            serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s por defecto
            socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
            bufferMaxEntries: 0, // Deshabilitar mongoose buffering
            bufferCommands: false, // Deshabilitar mongoose buffering
        };
        await mongoose_1.default.connect(MONGO_URL, options);
        console.log("✅ Conectado a MongoDB - Acceso remoto habilitado");
        console.log("🌐 Base de datos accesible vía IP externa");
    }
    catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        console.warn("⚠️ API continuará funcionando sin base de datos");
        // No terminar el proceso, continuar sin BD
    }
};
exports.default = connectDB;
