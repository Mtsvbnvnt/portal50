// src/controllers/empresa.controller.ts

import { Request, Response } from 'express';
import { Empresa } from '../models/empresa.model';
import { User } from '../models/user.model';

// ✅ Crear nueva empresa
export const createEmpresa = async (req: Request, res: Response) => {
  try {
    const { uid, nombre, telefono, direccion, email, experiencia, rol } = req.body;

    const exists = await Empresa.findOne({ uid });
    if (exists) return res.status(409).json({ message: 'Empresa ya existe' });

    const nueva = await Empresa.create({
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
  } catch (err) {
    console.error('❌ Error creando empresa:', err);
    res.status(500).json({ message: 'Error creando empresa' });
  }
};

// ✅ Obtener empresa por UID Firebase (solo activas)
export const getEmpresaByUid = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findOne({ uid: req.params.uid, activo: true })
      .populate('ejecutivos', 'nombre apellido email rol telefono uid');
    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

    res.status(200).json(empresa);
  } catch (err) {
    console.error('❌ Error obteniendo empresa:', err);
    res.status(500).json({ message: 'Error obteniendo empresa' });
  }
};

// ✅ Agregar ejecutivo — versión legacy compatible
export const addEjecutivo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { userId } = req.body;

    // Busca por uid (Firebase) — no por _id directo
    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.rol !== 'profesional') {
      return res.status(400).json({ message: 'Solo usuarios con rol profesional pueden ser ejecutivos' });
    }

    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { $addToSet: { ejecutivos: user._id } },
      { new: true }
    ).populate('ejecutivos', 'nombre apellido email rol telefono uid');

    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

    res.status(200).json({ message: 'Ejecutivo agregado', empresa });
  } catch (err) {
    console.error('❌ Error agregando ejecutivo:', err);
    res.status(500).json({ message: 'Error agregando ejecutivo' });
  }
};

// ✅ Actualizar ejecutivo
export const updateEjecutivo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { userId, action } = req.body;

    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let empresa;

    if (action === 'remove') {
      // Quita de empresa
      empresa = await Empresa.findByIdAndUpdate(
        empresaId,
        { $pull: { ejecutivos: user._id } },
        { new: true }
      ).populate('ejecutivos', 'nombre apellido email rol telefono uid');

      await User.findByIdAndUpdate(user._id, { isEjecutivo: false });

      if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

      return res.status(200).json({ message: 'Ejecutivo removido', empresa });
    } else {
      if (user.rol !== 'profesional') {
        return res.status(400).json({ message: 'Solo usuarios con rol profesional pueden ser ejecutivos' });
      }

      // Agrega a empresa
      empresa = await Empresa.findByIdAndUpdate(
        empresaId,
        { $addToSet: { ejecutivos: user._id } },
        { new: true }
      ).populate('ejecutivos', 'nombre email rol telefono uid');

      // 🔑 Marcar isEjecutivo = true
      await User.findByIdAndUpdate(user._id, { isEjecutivo: true });

      if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

      return res.status(200).json({ message: 'Ejecutivo agregado (update)', empresa });
    }
  } catch (err) {
    console.error('❌ Error actualizando ejecutivo:', err);
    res.status(500).json({ message: 'Error actualizando ejecutivo' });
  }
};

// ✅ Desactivar empresa (soft delete)
export const desactivarEmpresa = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { activo: false },
      { new: true }
    );

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    res.status(200).json({ message: 'Empresa desactivada', empresa });
  } catch (error) {
    console.error('❌ Error al desactivar empresa:', error);
    res.status(500).json({ message: 'Error al desactivar empresa' });
  }
};

// ✅ Obtener todas las empresas activas
export const getEmpresasActivas = async (_req: Request, res: Response) => {
  try {
    const empresas = await Empresa.find({ activo: true })
      .populate('ejecutivos', 'nombre apellido email rol telefono uid fotoPerfil');

    res.status(200).json(empresas);
  } catch (error) {
    console.error('❌ Error al obtener empresas activas:', error);
    res.status(500).json({ message: 'Error al obtener empresas activas' });
  }
};

//Obtener empresa por _id (para vista pública de ofertas)
export const getEmpresaById = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findById(req.params.empresaId).select("nombre fotoPerfil");
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
    res.status(200).json(empresa);
  } catch (err) {
    console.error("❌ Error obteniendo empresa por ID:", err);
    res.status(500).json({ message: "Error obteniendo empresa" });
  }
};

export const getProfesionalesActivos = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({
      activo: true,
      rol: 'profesional'
    }).select('nombre experiencia modalidadPreferida cv');

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error listando profesionales:', error);
    res.status(500).json({ message: 'Error listando profesionales' });
  }
};

// ✅ Subida de imagen de perfil de empresa (corregido)
export const uploadEmpresaFotoPerfil = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findByIdAndUpdate(
      req.params.empresaId,
      { fotoPerfil: `/uploads/fotos_perfil/${req.file?.filename}` },
      { new: true }
    );

    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

    res.status(200).json({
      message: 'Foto de perfil actualizada',
      fotoPerfil: empresa.fotoPerfil
    });
  } catch (err) {
    console.error('❌ Error actualizando foto de perfil de empresa:', err);
    res.status(500).json({ message: 'Error actualizando foto de perfil de empresa' });
  }
};

export const updateEmpresa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, telefono, direccion } = req.body;

  try {
    const empresa = await Empresa.findByIdAndUpdate(
      id,
      { nombre, telefono, direccion },
      { new: true }
    );

    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    return res.status(200).json(empresa);
  } catch (err) {
    console.error("❌ Error actualizando empresa:", err);
    return res.status(500).json({ message: "Error al actualizar empresa" });
  }
};

// ✅ Asignar ejecutivo por ID de MongoDB (nuevo)
export const asignarEjecutivo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { ejecutivoId } = req.body;

    // Verificar que el ejecutivo exista y tenga el rol correcto
    const ejecutivo = await User.findById(ejecutivoId);
    if (!ejecutivo) {
      return res.status(404).json({ message: 'Ejecutivo no encontrado' });
    }

    if (ejecutivo.rol !== 'ejecutivo') {
      return res.status(400).json({ message: 'El usuario seleccionado no es un ejecutivo' });
    }

    // Verificar que el ejecutivo no esté ya asignado a esta empresa específica
    const empresaConEjecutivo = await Empresa.findOne({ 
      _id: empresaId,
      ejecutivos: ejecutivo._id,
      activo: true 
    });
    
    if (empresaConEjecutivo) {
      return res.status(400).json({ 
        message: `El ejecutivo ya está asignado a esta empresa` 
      });
    }

    // Asignar ejecutivo a la empresa
    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { $addToSet: { ejecutivos: ejecutivo._id } },
      { new: true }
    ).populate('ejecutivos', 'nombre apellido email telefono uid');

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Marcar al ejecutivo como asignado a esta empresa
    await User.findByIdAndUpdate(ejecutivo._id, { 
      $addToSet: { empresasAsignadas: empresa._id },
      isEjecutivo: true 
    });

    res.status(200).json({ 
      message: 'Ejecutivo asignado exitosamente', 
      empresa 
    });
  } catch (err) {
    console.error('❌ Error asignando ejecutivo:', err);
    res.status(500).json({ message: 'Error asignando ejecutivo' });
  }
};

// ✅ Desasignar ejecutivo de una empresa específica
export const desasignarEjecutivo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { ejecutivoId } = req.body;

    // Verificar que el ejecutivo exista
    const ejecutivo = await User.findById(ejecutivoId);
    if (!ejecutivo) {
      return res.status(404).json({ message: 'Ejecutivo no encontrado' });
    }

    // Remover ejecutivo de la empresa
    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { $pull: { ejecutivos: ejecutivo._id } },
      { new: true }
    ).populate('ejecutivos', 'nombre apellido email telefono uid');

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Remover empresa del array de empresas asignadas del ejecutivo
    await User.findByIdAndUpdate(ejecutivo._id, { 
      $pull: { empresasAsignadas: empresa._id }
    });

    // Si el ejecutivo ya no tiene empresas asignadas, remover isEjecutivo
    const ejecutivoActualizado = await User.findById(ejecutivo._id);
    if (!ejecutivoActualizado?.empresasAsignadas || ejecutivoActualizado.empresasAsignadas.length === 0) {
      await User.findByIdAndUpdate(ejecutivo._id, { isEjecutivo: false });
    }

    res.status(200).json({ 
      message: 'Ejecutivo desasignado exitosamente', 
      empresa 
    });
  } catch (err) {
    console.error('❌ Error desasignando ejecutivo:', err);
    res.status(500).json({ message: 'Error desasignando ejecutivo' });
  }
};