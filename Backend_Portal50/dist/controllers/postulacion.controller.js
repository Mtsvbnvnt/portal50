"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarEstadoPostulacion = exports.obtenerPostulacionesPorOferta = exports.obtenerPostulacionesPorUsuario = exports.crearPostulacion = void 0;
const postulacion_model_1 = __importDefault(require("../models/postulacion.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const postulacion_validator_1 = require("../validators/postulacion.validator");
//Crear una postulacion
const crearPostulacion = async (req, res) => {
    const parsed = postulacion_validator_1.crearPostulacionSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
    }
    const { ofertaId, usuarioId } = parsed.data;
    // Evitar postulaciones duplicadas
    const yaExiste = await postulacion_model_1.default.findOne({ ofertaId, usuarioId });
    if (yaExiste) {
        return res.status(409).json({ message: 'Ya estás postulado a esta oferta' });
    }
    try {
        const nuevaPostulacion = new postulacion_model_1.default({
            ...parsed.data,
            estado: 'pendiente',
        });
        await nuevaPostulacion.save();
        res.status(201).json({ message: 'Postulación enviada correctamente', postulacion: nuevaPostulacion });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la postulación' });
    }
};
exports.crearPostulacion = crearPostulacion;
//Obtener Postulaciones
const obtenerPostulacionesPorUsuario = async (req, res) => {
    try {
        const usuarioObjectId = new mongoose_1.default.Types.ObjectId(req.params.userId);
        const postulaciones = await postulacion_model_1.default.find({ usuarioId: usuarioObjectId }).populate('ofertaId');
        res.status(200).json(postulaciones);
        //console.log(usuarioObjectId);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener postulaciones del usuario' });
    }
};
exports.obtenerPostulacionesPorUsuario = obtenerPostulacionesPorUsuario;
//Obtener postulaciones por oferta
const obtenerPostulacionesPorOferta = async (req, res) => {
    try {
        const ofertaObjectId = new mongoose_1.default.Types.ObjectId(req.params.jobId);
        const postulaciones = await postulacion_model_1.default.find({ ofertaId: ofertaObjectId }).populate('usuarioId');
        res.status(200).json(postulaciones);
        //console.log(ofertaObjectId);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener postulaciones de la oferta' });
    }
};
exports.obtenerPostulacionesPorOferta = obtenerPostulacionesPorOferta;
//Actualizar postulacion
const actualizarEstadoPostulacion = async (req, res) => {
    const parsed = postulacion_validator_1.actualizarEstadoSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
    }
    try {
        const actualizada = await postulacion_model_1.default.findByIdAndUpdate(req.params.postulacionId, parsed.data, { new: true });
        if (!actualizada) {
            return res.status(404).json({ message: 'Postulación no encontrada' });
        }
        res.status(200).json({ message: 'Estado actualizado', postulacion: actualizada });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar estado de postulación' });
    }
};
exports.actualizarEstadoPostulacion = actualizarEstadoPostulacion;
