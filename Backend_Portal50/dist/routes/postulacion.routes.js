"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postulacion_controller_1 = require("../controllers/postulacion.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Postulaciones
 *   description: Gestión de postulaciones a ofertas de empleo
 */
/**
 * @swagger
 * /api/postulaciones:
 *   post:
 *     summary: Postular a una oferta de empleo
 *     tags: [Postulaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ofertaId
 *               - usuarioId
 *             properties:
 *               ofertaId:
 *                 type: string
 *               usuarioId:
 *                 type: string
 *               mensaje:
 *                 type: string
 *               documentosAdicionales:
 *                 type: array
 *                 items:
 *                   type: string
 *               preguntasRespondidas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pregunta:
 *                       type: string
 *                     respuesta:
 *                       type: string
 *     responses:
 *       201:
 *         description: Postulación creada exitosamente
 *       409:
 *         description: Ya estás postulado a esta oferta
 */
router.post('/', postulacion_controller_1.crearPostulacion);
/**
 * @swagger
 * /api/postulaciones/usuario/{userId}:
 *   get:
 *     summary: Obtener postulaciones de un usuario
 *     tags: [Postulaciones]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de postulaciones del usuario
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuario/:userId', postulacion_controller_1.obtenerPostulacionesPorUsuario);
/**
 * @swagger
 * /api/postulaciones/oferta/{jobId}:
 *   get:
 *     summary: Obtener postulaciones a una oferta (vista empresa)
 *     tags: [Postulaciones]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID de la oferta de empleo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de postulantes
 *       500:
 *         description: Error interno del servidor
 */
router.get('/oferta/:jobId', postulacion_controller_1.obtenerPostulacionesPorOferta);
/**
 * @swagger
 * /api/postulaciones/{postulacionId}:
 *   put:
 *     summary: Actualizar estado de una postulación
 *     tags: [Postulaciones]
 *     parameters:
 *       - name: postulacionId
 *         in: path
 *         required: true
 *         description: ID de la postulación
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, preseleccionado, rechazado, contratado]
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       404:
 *         description: Postulación no encontrada
 */
router.put('/:postulacionId', postulacion_controller_1.actualizarEstadoPostulacion);
exports.default = router;
