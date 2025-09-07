"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    uid: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    rol: String,
    telefono: String,
    pais: String,
    experiencia: String,
    habilidades: [String],
    educacion: [
        {
            institucion: String,
            titulo: String,
            desde: String,
            hasta: String
        }
    ],
    idiomas: [
        {
            idioma: String,
            nivel: String
        }
    ],
    cv: String,
    videoPresentacion: String,
    modalidadPreferida: {
        type: String,
        enum: ['remota', 'presencial', 'híbrida', 'fraccional', 'tiempo completo', 'proyecto'],
        default: 'fraccional'
    },
    activo: { type: Boolean, default: true },
    isEjecutivo: { type: Boolean, default: false },
    fotoPerfil: { type: String },
    disponibilidad: {
        type: String,
        enum: ['disponible', 'con condiciones', 'no disponible'],
        default: 'disponible'
    }
});
exports.User = (0, mongoose_1.model)('User', userSchema, 'usuarios');
