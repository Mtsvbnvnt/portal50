"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresa = void 0;
const mongoose_1 = require("mongoose");
const empresaSchema = new mongoose_1.Schema({
    uid: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: String,
    direccion: String,
    videoPresentacion: String,
    ejecutivos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    rol: { type: String, required: true },
    activo: { type: Boolean, default: true },
    fotoPerfil: { type: String, default: "" }
});
exports.Empresa = (0, mongoose_1.model)('Empresa', empresaSchema, 'empresas');
