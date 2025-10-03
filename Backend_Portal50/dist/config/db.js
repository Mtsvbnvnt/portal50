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
        await mongoose_1.default.connect(MONGO_URL);
        console.log("✅ Conectado a MongoDB en Railway");
    }
    catch (error) {
        console.error("❌ Error conectando a MongoDB:", error);
        console.warn("⚠️ API continuará funcionando sin base de datos");
        // No terminar el proceso, continuar sin BD
    }
};
exports.default = connectDB;
