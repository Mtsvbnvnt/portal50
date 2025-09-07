"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarEstadoSchema = exports.crearPostulacionSchema = void 0;
const zod_1 = require("zod");
exports.crearPostulacionSchema = zod_1.z.object({
    ofertaId: zod_1.z.string().length(24),
    usuarioId: zod_1.z.string().length(24),
    mensaje: zod_1.z.string().max(500).optional(),
    documentosAdicionales: zod_1.z.array(zod_1.z.string().url()).optional(),
    preguntasRespondidas: zod_1.z
        .array(zod_1.z.object({
        pregunta: zod_1.z.string(),
        respuesta: zod_1.z.string()
    }))
        .optional()
});
exports.actualizarEstadoSchema = zod_1.z.object({
    estado: zod_1.z.enum(['pendiente', 'preseleccionado', 'rechazado', 'contratado']),
    observaciones: zod_1.z.string().optional()
});
