"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobQuestions = exports.deleteJob = exports.updateJob = exports.getJobById = exports.getAllJobs = exports.createJob = void 0;
const job_model_1 = require("../models/job.model");
const job_validator_1 = require("../validators/job.validator");
//Crear una oferta
const createJob = async (req, res) => {
    const parsed = job_validator_1.createJobSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
    }
    try {
        const job = new job_model_1.Job(parsed.data);
        await job.save();
        res.status(201).json({ message: 'Oferta creada correctamente', job });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear oferta' });
    }
};
exports.createJob = createJob;
//Obtener todas las ofertas
const getAllJobs = async (_, res) => {
    try {
        const jobs = await job_model_1.Job.find();
        res.status(200).json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener ofertas' });
    }
};
exports.getAllJobs = getAllJobs;
//Obtener datos de Oferta
const getJobById = async (req, res) => {
    try {
        const job = await job_model_1.Job.findById(req.params.jobId);
        if (!job)
            return res.status(404).json({ message: 'Oferta no encontrada' });
        res.status(200).json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la oferta' });
    }
};
exports.getJobById = getJobById;
//Actualizar Oferta
const updateJob = async (req, res) => {
    const parsed = job_validator_1.updateJobSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
    }
    try {
        const updated = await job_model_1.Job.findByIdAndUpdate(req.params.jobId, parsed.data, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Oferta no encontrada' });
        res.status(200).json({ message: 'Oferta actualizada', job: updated });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la oferta' });
    }
};
exports.updateJob = updateJob;
// Borrar ofertas
const deleteJob = async (req, res) => {
    try {
        const deleted = await job_model_1.Job.findByIdAndDelete(req.params.jobId);
        if (!deleted)
            return res.status(404).json({ message: 'Oferta no encontrada' });
        res.status(200).json({ message: 'Oferta eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la oferta' });
    }
};
exports.deleteJob = deleteJob;
// ✅ Actualizar preguntas de una oferta
const updateJobQuestions = async (req, res) => {
    const { preguntas } = req.body;
    if (!Array.isArray(preguntas)) {
        return res.status(400).json({ message: 'Preguntas inválidas, se espera un arreglo.' });
    }
    try {
        const updated = await job_model_1.Job.findByIdAndUpdate(req.params.jobId, { preguntas }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Oferta no encontrada' });
        }
        res.status(200).json({
            message: 'Preguntas actualizadas correctamente',
            job: updated
        });
    }
    catch (error) {
        console.error('❌ Error actualizando preguntas:', error);
        res.status(500).json({ message: 'Error al actualizar preguntas' });
    }
};
exports.updateJobQuestions = updateJobQuestions;
