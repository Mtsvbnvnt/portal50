"use strict";
// src/validators/user.validator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    telefono: zod_1.z.string().min(8).max(20).optional(),
    pais: zod_1.z.string().min(2).refine((value) => !/^\d+$/.test(value), { message: "El país no puede ser un número" }).optional(),
    experiencia: zod_1.z.string().max(300).optional(),
    habilidades: zod_1.z.array(zod_1.z.string()).optional(),
    certificado: zod_1.z.boolean().optional(),
    videoPresentacion: zod_1.z.string().url().optional(),
    modalidadPreferida: zod_1.z.enum([
        'tiempo completo',
        'part time',
        'proyectos',
        'híbrida',
        'presencial',
        'remota'
    ]).optional()
});
