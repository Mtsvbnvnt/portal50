import { Router } from 'express';
import {
  crearSolicitudEmpleo,
  getSolicitudesEjecutivo,
  getSolicitudesEmpresa,
  revisarSolicitud,
  crearJobDesdeSolicitud,
  responderCorrecciones,
  getSolicitudById,
  getEstadisticasSolicitudes
} from '../controllers/solicitudEmpleo.controller';

const router = Router();

/**
 * @swagger
 * /api/solicitudes-empleo/empresa/{empresaId}:
 *   post:
 *     summary: Crear nueva solicitud de empleo
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: empresaId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               modalidad:
 *                 type: string
 *                 enum: [presencial, remota, híbrida]
 *               jornada:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               salario:
 *                 type: string
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: string
 *               preguntas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pregunta:
 *                       type: string
 *                     obligatoria:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *       404:
 *         description: Empresa no encontrada
 */
router.post('/empresa/:empresaId', crearSolicitudEmpleo);

/**
 * @swagger
 * /api/solicitudes-empleo/ejecutivo/{ejecutivoId}:
 *   get:
 *     summary: Obtener solicitudes asignadas a un ejecutivo
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: ejecutivoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: estado
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pendiente, en_revision, aprobada, rechazada, con_correcciones, publicada]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
router.get('/ejecutivo/:ejecutivoId', getSolicitudesEjecutivo);

/**
 * @swagger
 * /api/solicitudes-empleo/empresa/{empresaId}/lista:
 *   get:
 *     summary: Obtener solicitudes de una empresa
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: empresaId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: estado
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de solicitudes de la empresa
 */
router.get('/empresa/:empresaId/lista', getSolicitudesEmpresa);

/**
 * @swagger
 * /api/solicitudes-empleo/{solicitudId}/revisar:
 *   put:
 *     summary: Revisar solicitud (Ejecutivo)
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: solicitudId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accion:
 *                 type: string
 *                 enum: [aprobar, rechazar, solicitar_correcciones]
 *               comentarios:
 *                 type: string
 *               ejecutivoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Solicitud revisada exitosamente
 */
router.put('/:solicitudId/revisar', revisarSolicitud);

/**
 * @swagger
 * /api/solicitudes-empleo/{solicitudId}/crear-job:
 *   post:
 *     summary: Crear job desde solicitud aprobada
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: solicitudId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ejecutivoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job creado exitosamente
 */
router.post('/:solicitudId/crear-job', crearJobDesdeSolicitud);

/**
 * @swagger
 * /api/solicitudes-empleo/{solicitudId}/correcciones:
 *   put:
 *     summary: Responder a correcciones solicitadas
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: solicitudId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empresaId:
 *                 type: string
 *               comentarios:
 *                 type: string
 *               datosActualizados:
 *                 type: object
 *     responses:
 *       200:
 *         description: Correcciones enviadas exitosamente
 */
router.put('/:solicitudId/correcciones', responderCorrecciones);

/**
 * @swagger
 * /api/solicitudes-empleo/{solicitudId}:
 *   get:
 *     summary: Obtener solicitud por ID
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: solicitudId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la solicitud
 *       404:
 *         description: Solicitud no encontrada
 */
router.get('/:solicitudId', getSolicitudById);

/**
 * @swagger
 * /api/solicitudes-empleo/ejecutivo/{ejecutivoId}/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de solicitudes para ejecutivo
 *     tags: [Solicitudes de Empleo]
 *     parameters:
 *       - name: ejecutivoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estadísticas de solicitudes
 */
router.get('/ejecutivo/:ejecutivoId/estadisticas', getEstadisticasSolicitudes);

export default router;