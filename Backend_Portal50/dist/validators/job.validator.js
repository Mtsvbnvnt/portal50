"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobSchema = exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    empresaId: zod_1.z.string().length(24),
    titulo: zod_1.z.string().optional(),
    descripcion: zod_1.z.string().optional(),
    modalidad: zod_1.z.enum(['presencial', 'remota', 'híbrida']).optional(),
    jornada: zod_1.z.string().optional(),
    ubicacion: zod_1.z.string().optional(),
    salario: zod_1.z.string().optional(),
    etiquetas: zod_1.z.array(zod_1.z.string()).optional(),
    preguntas: zod_1.z.array(zod_1.z.object({
        pregunta: zod_1.z.string(),
        obligatoria: zod_1.z.boolean()
    })).optional(),
});
exports.updateJobSchema = exports.createJobSchema.partial();
