"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCursosPorUsuario = exports.crearCurso = exports.uploadVideoCurso = exports.agendarClase = exports.getCursoById = exports.getCursos = void 0;
const curso_model_1 = __importDefault(require("../models/curso.model"));
const clase_model_1 = __importDefault(require("../models/clase.model"));
const getCursos = async (_req, res) => {
    const cursos = await curso_model_1.default.find().populate('profesionalId', 'nombre profesion fotoPerfil uid');
    res.status(200).json(cursos);
};
exports.getCursos = getCursos;
const getCursoById = async (req, res) => {
    const curso = await curso_model_1.default.findById(req.params.cursoId).populate('profesionalId');
    if (!curso)
        return res.status(404).json({ message: 'Curso no encontrado' });
    res.status(200).json(curso);
};
exports.getCursoById = getCursoById;
const agendarClase = async (req, res) => {
    const { aprendizId, fecha } = req.body;
    const curso = await curso_model_1.default.findById(req.params.cursoId);
    if (!curso)
        return res.status(404).json({ message: 'Curso no encontrado' });
    const clase = await clase_model_1.default.create({
        cursoId: curso._id,
        profesionalId: curso.profesionalId,
        aprendizId,
        fecha,
        estado: 'pendiente',
        pagado: true,
        feedback: '',
    });
    res.status(201).json({ message: 'Clase agendada', clase });
};
exports.agendarClase = agendarClase;
const uploadVideoCurso = async (req, res) => {
    const videoPath = `/uploads/cursos/${req.file?.filename}`;
    const curso = await curso_model_1.default.findByIdAndUpdate(req.params.cursoId, { videoIntro: videoPath }, { new: true });
    res.status(200).json({ message: 'Video de curso subido', curso });
};
exports.uploadVideoCurso = uploadVideoCurso;
const crearCurso = async (req, res) => {
    try {
        const { profesionalId, titulo, descripcion, categoria, precio, tipoPago, duracionMinutos, agendaDisponible, } = req.body;
        if (!profesionalId || !titulo || !precio || !tipoPago) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
        const nuevoCurso = new curso_model_1.default({
            profesionalId,
            titulo,
            descripcion,
            categoria,
            precio,
            tipoPago,
            duracionMinutos,
            agendaDisponible,
        });
        const cursoGuardado = await nuevoCurso.save();
        res.status(201).json(cursoGuardado);
    }
    catch (error) {
        console.error("❌ Error al crear curso:", error.message);
        console.error("Stack:", error.stack);
        res.status(500).json({ error: "Error al crear el curso" });
    }
};
exports.crearCurso = crearCurso;
const getCursosPorUsuario = async (req, res) => {
    try {
        const cursos = await curso_model_1.default.find({ profesionalId: req.params.usuarioId });
        res.json(cursos);
    }
    catch (error) {
        console.error("Error al obtener cursos por usuario:", error);
        res.status(500).json({ error: "Error al obtener cursos del usuario" });
    }
};
exports.getCursosPorUsuario = getCursosPorUsuario;
