import { Request, Response } from 'express';
import { Job } from '../models/job.model';
import { User } from '../models/user.model';
import { createJobSchema, updateJobSchema } from '../validators/job.validator';
import { AuthRequest } from '../middlewares/auth.middleware';

//Crear una oferta
export const createJob = async (req: AuthRequest, res: Response) => {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
  }

  try {
    // Verificar que solo ejecutivos puedan crear jobs directamente
    if (req.user) {
      const usuario = await User.findOne({ uid: req.user.uid });
      if (usuario && usuario.rol === 'empresa') {
        return res.status(403).json({ 
          message: 'Las empresas deben crear solicitudes de empleo, no publicar ofertas directamente',
          redirect: '/empresa/crear-solicitud'
        });
      }
    }

    const job = new Job(parsed.data);
    await job.save();
    res.status(201).json({ message: 'Oferta creada correctamente', job });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ message: 'Error al crear oferta' });
  }
};

//Obtener todas las ofertas
export const getAllJobs = async (_: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ofertas' });
  }
};

//Obtener datos de Oferta
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la oferta' });
  }
};

//Actualizar Oferta
export const updateJob = async (req: AuthRequest, res: Response) => {
  const parsed = updateJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
  }
  

  try {
    const updated = await Job.findByIdAndUpdate(req.params.jobId, parsed.data, { new: true });
    if (!updated) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.status(200).json({ message: 'Oferta actualizada', job: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la oferta' });
  }
};

// Borrar ofertas
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.jobId);
    if (!deleted) return res.status(404).json({ message: 'Oferta no encontrada' });
    res.status(200).json({ message: 'Oferta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la oferta' });
  }
};

// ✅ Actualizar preguntas de una oferta
export const updateJobQuestions = async (req: Request, res: Response) => {
  const { preguntas } = req.body;

  if (!Array.isArray(preguntas)) {
    return res.status(400).json({ message: 'Preguntas inválidas, se espera un arreglo.' });
  }

  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.jobId,
      { preguntas },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
    }

    res.status(200).json({
      message: 'Preguntas actualizadas correctamente',
      job: updated
    });
  } catch (error) {
    console.error('❌ Error actualizando preguntas:', error);
    res.status(500).json({ message: 'Error al actualizar preguntas' });
  }
};
