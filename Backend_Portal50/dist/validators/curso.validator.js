"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agendarClaseSchema = void 0;
const zod_1 = require("zod");
exports.agendarClaseSchema = zod_1.z.object({
    usuarioId: zod_1.z.string().length(24, 'ID inválido'),
    fecha: zod_1.z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
        message: 'Fecha inválida',
    }),
});
