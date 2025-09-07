"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    empresaId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    modalidad: { type: String, enum: ['presencial', 'remota', 'híbrida'], required: true },
    jornada: { type: String, required: true },
    ubicacion: { type: String },
    salario: { type: String },
    estado: { type: String, default: 'activa' },
    etiquetas: [String],
    fechaPublicacion: { type: Date, default: Date.now },
    preguntas: [
        {
            pregunta: String,
            obligatoria: Boolean
        }
    ],
    moderada: { type: Boolean, default: false }
});
exports.Job = (0, mongoose_1.model)('Job', jobSchema, 'ofertas');
