"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerEvaluacionesUsuario = exports.listarUsuarios = void 0;
const user_model_1 = require("../models/user.model");
const evaluacion_model_1 = __importDefault(require("../models/evaluacion.model"));
const listarUsuarios = async (req, res) => {
    try {
        const { rol, nombre, email } = req.query;
        const filtros = {};
        if (rol)
            filtros.rol = rol;
        if (nombre)
            filtros.nombre = { $regex: new RegExp(nombre.toString(), 'i') };
        if (email)
            filtros.email = { $regex: new RegExp(email.toString(), 'i') };
        const usuarios = await user_model_1.User.find(filtros);
        res.status(200).json(usuarios);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al listar usuarios' });
    }
};
exports.listarUsuarios = listarUsuarios;
const obtenerEvaluacionesUsuario = async (req, res) => {
    try {
        const { userId } = req.params;
        const evaluaciones = await evaluacion_model_1.default.find({ evaluadoId: userId })
            .populate('evaluadorId', 'nombre email')
            .populate('cursoId', 'titulo');
        const promedio = evaluaciones.reduce((acc, e) => acc + e.estrellas, 0) / (evaluaciones.length || 1);
        res.status(200).json({ promedio: Number(promedio.toFixed(1)), evaluaciones });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener evaluaciones' });
    }
};
exports.obtenerEvaluacionesUsuario = obtenerEvaluacionesUsuario;
