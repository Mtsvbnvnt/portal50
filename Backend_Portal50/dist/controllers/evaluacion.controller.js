"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearEvaluacion = exports.obtenerEvaluacionesUsuario = void 0;
const evaluacion_model_1 = __importDefault(require("../models/evaluacion.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// Obtener evaluaciones
const obtenerEvaluacionesUsuario = async (req, res) => {
    const { userId } = req.params;
    try {
        const evaluaciones = await evaluacion_model_1.default.find({ evaluadoId: new mongoose_1.default.Types.ObjectId(userId) });
        if (!evaluaciones.length) {
            return res.status(404).json({ message: 'No se encontraron evaluaciones para este usuario' });
        }
        const promedio = evaluaciones.reduce((acc, curr) => acc + curr.estrellas, 0) / evaluaciones.length;
        res.status(200).json({
            promedio: parseFloat(promedio.toFixed(2)),
            total: evaluaciones.length,
            evaluaciones
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener evaluaciones', error });
    }
};
exports.obtenerEvaluacionesUsuario = obtenerEvaluacionesUsuario;
// Crear una evaluacion
const crearEvaluacion = async (req, res) => {
    try {
        const { evaluadorId, evaluadoId, cursoId, tipo, comentario, estrellas } = req.body;
        if (!evaluadorId || !evaluadoId || !cursoId || !tipo || !estrellas) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }
        const nuevaEvaluacion = new evaluacion_model_1.default({
            evaluadorId,
            evaluadoId,
            cursoId,
            tipo,
            comentario,
            estrellas,
            fecha: new Date(),
        });
        await nuevaEvaluacion.save();
        res.status(201).json({ message: 'Evaluación registrada correctamente', evaluacion: nuevaEvaluacion });
    }
    catch (error) {
        console.error('❌ Error al crear evaluación:', error);
        res.status(500).json({ message: 'Error al crear evaluación' });
    }
};
exports.crearEvaluacion = crearEvaluacion;
