import { Request, Response } from 'express';
import { SolicitudEmpleo } from '../models/solicitudEmpleo.model';
import { Job } from '../models/job.model';
import { Empresa } from '../models/empresa.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

// Crear nueva solicitud de empleo (Empresa)
export const crearSolicitudEmpleo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const solicitudData = req.body;

    console.log('🏢 Creando solicitud para empresa:', empresaId);
    console.log('📝 Datos de solicitud:', solicitudData);

    // Verificar que la empresa existe
    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Buscar ejecutivo asignado a la empresa
    const ejecutivo = await User.findOne({ 
      empresasAsignadas: empresaId,
      rol: 'ejecutivo',
      activo: true 
    });

    console.log('👨‍💼 Ejecutivo encontrado:', ejecutivo ? ejecutivo.nombre : 'ninguno');

    const nuevaSolicitud = new SolicitudEmpleo({
      ...solicitudData,
      empresaId,
      ejecutivoId: ejecutivo?._id,
      estado: 'pendiente',
      historial: [{
        fecha: new Date(),
        estado: 'pendiente',
        comentario: 'Solicitud creada por la empresa',
        usuario: empresaId,
        tipoUsuario: 'empresa'
      }]
    });

    await nuevaSolicitud.save();
    console.log('✅ Solicitud creada con ID:', nuevaSolicitud._id);

    res.status(201).json({
      message: 'Solicitud de empleo creada exitosamente',
      solicitud: nuevaSolicitud
    });
  } catch (error) {
    console.error('❌ Error creando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener solicitudes para un ejecutivo
export const getSolicitudesEjecutivo = async (req: Request, res: Response) => {
  try {
    const { ejecutivoId } = req.params;
    const { estado } = req.query;

    console.log('📋 getSolicitudesEjecutivo - Params:', { ejecutivoId, estado });

    let filtro: any = {};
    
    if (estado) {
      filtro.estado = estado;
    } else {
      // Si no se especifica estado, mostrar solicitudes relevantes para el ejecutivo
      filtro.$or = [
        { ejecutivoId: ejecutivoId }, // Solicitudes ya asignadas al ejecutivo
        { estado: 'pendiente' }       // Solicitudes pendientes (sin asignar)
      ];
    }

    // Si se especifica un estado específico y el ejecutivo, filtrar por ambos
    if (estado && estado !== 'pendiente') {
      filtro = { ejecutivoId, estado };
    } else if (estado === 'pendiente') {
      filtro = { estado: 'pendiente' };
    }

    console.log('📋 Filtro aplicado:', filtro);

    const solicitudes = await SolicitudEmpleo.find(filtro)
      .populate('empresaId', 'nombre email telefono')
      .populate('ejecutivoId', 'nombre email')
      .sort({ fechaSolicitud: -1 });

    console.log('📋 Solicitudes encontradas:', solicitudes.length);

    res.json(solicitudes);
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener solicitudes para una empresa
export const getSolicitudesEmpresa = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { estado } = req.query;

    let filtro: any = { empresaId };
    if (estado) {
      filtro.estado = estado;
    }

    const solicitudes = await SolicitudEmpleo.find(filtro)
      .populate('ejecutivoId', 'nombre email')
      .sort({ fechaSolicitud: -1 });

    res.json(solicitudes);
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Revisar solicitud (Ejecutivo)
export const revisarSolicitud = async (req: Request, res: Response) => {
  try {
    const { solicitudId } = req.params;
    const { accion, comentarios, ejecutivoId } = req.body;

    const solicitud = await SolicitudEmpleo.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    let nuevoEstado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'con_correcciones' | 'publicada';
    let debeAsignarEjecutivo = false;

    switch (accion) {
      case 'tomar_revision':
        if (solicitud.estado !== 'pendiente') {
          return res.status(400).json({ message: 'Solo se pueden tomar solicitudes pendientes' });
        }
        nuevoEstado = 'en_revision';
        debeAsignarEjecutivo = true;
        break;
      case 'aprobar':
        // Verificar que el ejecutivo tenga acceso a esta solicitud
        if (solicitud.ejecutivoId?.toString() !== ejecutivoId) {
          return res.status(403).json({ message: 'No tienes permisos para revisar esta solicitud' });
        }
        nuevoEstado = 'aprobada';
        break;
      case 'rechazar':
        // Verificar que el ejecutivo tenga acceso a esta solicitud
        if (solicitud.ejecutivoId?.toString() !== ejecutivoId) {
          return res.status(403).json({ message: 'No tienes permisos para revisar esta solicitud' });
        }
        nuevoEstado = 'rechazada';
        break;
      case 'solicitar_correcciones':
        // Verificar que el ejecutivo tenga acceso a esta solicitud
        if (solicitud.ejecutivoId?.toString() !== ejecutivoId) {
          return res.status(403).json({ message: 'No tienes permisos para revisar esta solicitud' });
        }
        nuevoEstado = 'con_correcciones';
        break;
      default:
        return res.status(400).json({ message: 'Acción no válida' });
    }

    solicitud.estado = nuevoEstado;
    if (debeAsignarEjecutivo) {
      solicitud.ejecutivoId = ejecutivoId;
    }
    if (comentarios) {
      solicitud.comentariosEjecutivo = comentarios;
    }
    solicitud.fechaRevision = new Date();

    // Agregar al historial
    solicitud.historial.push({
      fecha: new Date(),
      estado: nuevoEstado,
      comentario: comentarios || '',
      usuario: ejecutivoId,
      tipoUsuario: 'ejecutivo'
    });

    await solicitud.save();

    res.json({
      message: 'Solicitud revisada exitosamente',
      solicitud
    });
  } catch (error) {
    console.error('Error revisando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear job desde solicitud aprobada (Ejecutivo)
export const crearJobDesdeSolicitud = async (req: Request, res: Response) => {
  try {
    const { solicitudId } = req.params;
    const { ejecutivoId } = req.body;

    const solicitud = await SolicitudEmpleo.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (solicitud.estado !== 'aprobada') {
      return res.status(400).json({ message: 'La solicitud debe estar aprobada para crear el empleo' });
    }

    // Crear el job
    const nuevoJob = new Job({
      empresaId: solicitud.empresaId,
      titulo: solicitud.titulo,
      descripcion: solicitud.descripcion,
      modalidad: solicitud.modalidad,
      jornada: solicitud.jornada,
      ubicacion: solicitud.ubicacion,
      salario: solicitud.salario,
      etiquetas: solicitud.etiquetas,
      preguntas: solicitud.preguntas,
      estado: 'pendiente_aprobacion', // Nuevo estado para que la empresa revise
      moderada: true
    });

    await nuevoJob.save();

    // Actualizar la solicitud
    solicitud.jobId = nuevoJob._id;
    solicitud.estado = 'publicada';
    solicitud.fechaPublicacion = new Date();

    solicitud.historial.push({
      fecha: new Date(),
      estado: 'publicada',
      comentario: 'Job creado y enviado para revisión de la empresa',
      usuario: ejecutivoId,
      tipoUsuario: 'ejecutivo'
    });

    await solicitud.save();

    res.json({
      message: 'Empleo creado exitosamente',
      job: nuevoJob,
      solicitud
    });
  } catch (error) {
    console.error('Error creando job:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Responder a correcciones (Empresa)
export const responderCorrecciones = async (req: Request, res: Response) => {
  try {
    const { solicitudId } = req.params;
    const { empresaId, comentarios, datosActualizados } = req.body;

    const solicitud = await SolicitudEmpleo.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (solicitud.empresaId.toString() !== empresaId) {
      return res.status(403).json({ message: 'No tienes permisos para modificar esta solicitud' });
    }

    if (solicitud.estado !== 'con_correcciones') {
      return res.status(400).json({ message: 'La solicitud no está en estado de correcciones' });
    }

    // Actualizar los datos de la solicitud
    Object.assign(solicitud, datosActualizados);
    solicitud.estado = 'en_revision';
    solicitud.comentariosEmpresa = comentarios;

    solicitud.historial.push({
      fecha: new Date(),
      estado: 'en_revision',
      comentario: comentarios || 'Correcciones aplicadas por la empresa',
      usuario: empresaId,
      tipoUsuario: 'empresa'
    });

    await solicitud.save();

    res.json({
      message: 'Correcciones enviadas exitosamente',
      solicitud
    });
  } catch (error) {
    console.error('Error respondiendo correcciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener solicitud por ID
export const getSolicitudById = async (req: Request, res: Response) => {
  try {
    const { solicitudId } = req.params;

    const solicitud = await SolicitudEmpleo.findById(solicitudId)
      .populate('empresaId', 'nombre email telefono')
      .populate('ejecutivoId', 'nombre email')
      .populate('jobId');

    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json(solicitud);
  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Estadísticas para ejecutivo
export const getEstadisticasSolicitudes = async (req: Request, res: Response) => {
  try {
    const { ejecutivoId } = req.params;

    // Obtener estadísticas de solicitudes asignadas al ejecutivo
    const estadisticasAsignadas = await SolicitudEmpleo.aggregate([
      { $match: { ejecutivoId: ejecutivoId } },
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 }
        }
      }
    ]);

    // Obtener solicitudes pendientes (disponibles para todos los ejecutivos)
    const solicitudesPendientes = await SolicitudEmpleo.countDocuments({ estado: 'pendiente' });

    // Crear objeto de estadísticas
    const estadisticas: any = {
      pendientes: solicitudesPendientes,
      aprobadas: 0,
      rechazadas: 0,
      con_correcciones: 0,
      en_revision: 0,
      publicadas: 0
    };

    // Llenar con las estadísticas del ejecutivo
    estadisticasAsignadas.forEach(stat => {
      estadisticas[stat._id] = stat.count;
    });

    const totalAsignadas = await SolicitudEmpleo.countDocuments({ ejecutivoId });

    res.json({
      total: totalAsignadas,
      pendientes: solicitudesPendientes,
      aprobadas: estadisticas.aprobadas || 0,
      rechazadas: estadisticas.rechazadas || 0,
      con_correcciones: estadisticas.con_correcciones || 0,
      en_revision: estadisticas.en_revision || 0,
      publicadas: estadisticas.publicadas || 0
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};