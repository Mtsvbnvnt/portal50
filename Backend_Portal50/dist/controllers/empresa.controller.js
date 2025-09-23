"use strict";
// src/controllers/empresa.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmpresa = exports.uploadEmpresaFotoPerfil = exports.getProfesionalesActivos = exports.getEmpresaById = exports.getEmpresasActivas = exports.desactivarEmpresa = exports.updateEjecutivo = exports.addEjecutivo = exports.getEmpresaByUid = exports.createEmpresa = void 0;
const empresa_model_1 = require("../models/empresa.model");
const user_model_1 = require("../models/user.model");
// ✅ Crear nueva empresa
const createEmpresa = async (req, res) => {
    try {
        const { uid, nombre, telefono, direccion, email, experiencia, rol } = req.body;
        const exists = await empresa_model_1.Empresa.findOne({ uid });
        if (exists)
            return res.status(409).json({ message: 'Empresa ya existe' });
        const nueva = await empresa_model_1.Empresa.create({
            uid,
            nombre,
            email,
            telefono,
            direccion,
            experiencia,
            ejecutivos: [],
            videoPresentacion: "",
            rol,
            activo: true
        });
        res.status(201).json({ message: 'Empresa creada', empresa: nueva });
    }
    catch (err) {
        console.error('❌ Error creando empresa:', err);
        res.status(500).json({ message: 'Error creando empresa' });
    }
};
exports.createEmpresa = createEmpresa;
// ✅ Obtener empresa por UID Firebase (solo activas)
const getEmpresaByUid = async (req, res) => {
    try {
        const empresa = await empresa_model_1.Empresa.findOne({ uid: req.params.uid, activo: true })
            .populate('ejecutivos', 'nombre email rol telefono uid');
        if (!empresa)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        res.status(200).json(empresa);
    }
    catch (err) {
        console.error('❌ Error obteniendo empresa:', err);
        res.status(500).json({ message: 'Error obteniendo empresa' });
    }
};
exports.getEmpresaByUid = getEmpresaByUid;
// ✅ Agregar ejecutivo — versión legacy compatible
const addEjecutivo = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const { userId } = req.body;
        // Busca por uid (Firebase) — no por _id directo
        const user = await user_model_1.User.findOne({ uid: userId });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        if (user.rol !== 'profesional') {
            return res.status(400).json({ message: 'Solo usuarios con rol profesional pueden ser ejecutivos' });
        }
        const empresa = await empresa_model_1.Empresa.findByIdAndUpdate(empresaId, { $addToSet: { ejecutivos: user._id } }, { new: true }).populate('ejecutivos', 'nombre email rol telefono uid');
        if (!empresa)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        res.status(200).json({ message: 'Ejecutivo agregado', empresa });
    }
    catch (err) {
        console.error('❌ Error agregando ejecutivo:', err);
        res.status(500).json({ message: 'Error agregando ejecutivo' });
    }
};
exports.addEjecutivo = addEjecutivo;
// ✅ Actualizar ejecutivo
const updateEjecutivo = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const { userId, action } = req.body;
        const user = await user_model_1.User.findOne({ uid: userId });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        let empresa;
        if (action === 'remove') {
            // Quita de empresa
            empresa = await empresa_model_1.Empresa.findByIdAndUpdate(empresaId, { $pull: { ejecutivos: user._id } }, { new: true }).populate('ejecutivos', 'nombre email rol telefono uid');
            await user_model_1.User.findByIdAndUpdate(user._id, { isEjecutivo: false });
            if (!empresa)
                return res.status(404).json({ message: 'Empresa no encontrada' });
            return res.status(200).json({ message: 'Ejecutivo removido', empresa });
        }
        else {
            if (user.rol !== 'profesional') {
                return res.status(400).json({ message: 'Solo usuarios con rol profesional pueden ser ejecutivos' });
            }
            // Agrega a empresa
            empresa = await empresa_model_1.Empresa.findByIdAndUpdate(empresaId, { $addToSet: { ejecutivos: user._id } }, { new: true }).populate('ejecutivos', 'nombre email rol telefono uid');
            // 🔑 Marcar isEjecutivo = true
            await user_model_1.User.findByIdAndUpdate(user._id, { isEjecutivo: true });
            if (!empresa)
                return res.status(404).json({ message: 'Empresa no encontrada' });
            return res.status(200).json({ message: 'Ejecutivo agregado (update)', empresa });
        }
    }
    catch (err) {
        console.error('❌ Error actualizando ejecutivo:', err);
        res.status(500).json({ message: 'Error actualizando ejecutivo' });
    }
};
exports.updateEjecutivo = updateEjecutivo;
// ✅ Desactivar empresa (soft delete)
const desactivarEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const empresa = await empresa_model_1.Empresa.findByIdAndUpdate(empresaId, { activo: false }, { new: true });
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        res.status(200).json({ message: 'Empresa desactivada', empresa });
    }
    catch (error) {
        console.error('❌ Error al desactivar empresa:', error);
        res.status(500).json({ message: 'Error al desactivar empresa' });
    }
};
exports.desactivarEmpresa = desactivarEmpresa;
// ✅ Obtener todas las empresas activas
const getEmpresasActivas = async (_req, res) => {
    try {
        const empresas = await empresa_model_1.Empresa.find({ activo: true })
            .populate('ejecutivos', 'nombre email rol telefono uid fotoPerfil');
        res.status(200).json(empresas);
    }
    catch (error) {
        console.error('❌ Error al obtener empresas activas:', error);
        res.status(500).json({ message: 'Error al obtener empresas activas' });
    }
};
exports.getEmpresasActivas = getEmpresasActivas;
//Obtener empresa por _id (para vista pública de ofertas)
const job_model_1 = require("../models/job.model");
const postulacion_model_1 = __importDefault(require("../models/postulacion.model"));
const getEmpresaById = async (req, res) => {
    try {
        const empresa = await empresa_model_1.Empresa.findById(req.params.empresaId)
            .populate('ejecutivos', 'nombre email rol telefono uid');
        if (!empresa) {
            return res.status(404).json({ message: "Empresa no encontrada" });
        }
        // Buscar ofertas de la empresa
        const ofertas = await job_model_1.Job.find({ empresaId: empresa._id });
        // Para cada oferta, buscar postulaciones y agregarlas
        const ofertasConPostulantes = await Promise.all(ofertas.map(async (oferta) => {
            const postulaciones = await postulacion_model_1.default.find({ ofertaId: oferta._id })
                .populate('usuarioId', 'nombre email telefono');
            return {
                ...oferta.toObject(),
                postulantes: postulaciones.map(post => {
                    const usuario = post.usuarioId;
                    return {
                        _id: usuario._id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        telefono: usuario.telefono,
                        estado: post.estado
                    };
                })
            };
        }));
        res.status(200).json({
            ...empresa.toObject(),
            ofertas: ofertasConPostulantes
        });
    }
    catch (err) {
        console.error("❌ Error obteniendo empresa por ID:", err);
        res.status(500).json({ message: "Error obteniendo empresa" });
    }
};
exports.getEmpresaById = getEmpresaById;
const getProfesionalesActivos = async (_req, res) => {
    try {
        const users = await user_model_1.User.find({
            activo: true,
            rol: 'profesional'
        }).select('nombre experiencia modalidadPreferida cv');
        res.status(200).json(users);
    }
    catch (error) {
        console.error('❌ Error listando profesionales:', error);
        res.status(500).json({ message: 'Error listando profesionales' });
    }
};
exports.getProfesionalesActivos = getProfesionalesActivos;
// ✅ Subida de imagen de perfil de empresa (corregido)
const uploadEmpresaFotoPerfil = async (req, res) => {
    try {
        const empresa = await empresa_model_1.Empresa.findByIdAndUpdate(req.params.empresaId, { fotoPerfil: `/uploads/fotos_perfil/${req.file?.filename}` }, { new: true });
        if (!empresa)
            return res.status(404).json({ message: 'Empresa no encontrada' });
        res.status(200).json({
            message: 'Foto de perfil actualizada',
            fotoPerfil: empresa.fotoPerfil
        });
    }
    catch (err) {
        console.error('❌ Error actualizando foto de perfil de empresa:', err);
        res.status(500).json({ message: 'Error actualizando foto de perfil de empresa' });
    }
};
exports.uploadEmpresaFotoPerfil = uploadEmpresaFotoPerfil;
const updateEmpresa = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;
    try {
        const empresa = await empresa_model_1.Empresa.findByIdAndUpdate(id, { nombre, telefono, direccion }, { new: true });
        if (!empresa) {
            return res.status(404).json({ message: "Empresa no encontrada" });
        }
        return res.status(200).json(empresa);
    }
    catch (err) {
        console.error("❌ Error actualizando empresa:", err);
        return res.status(500).json({ message: "Error al actualizar empresa" });
    }
};
exports.updateEmpresa = updateEmpresa;
