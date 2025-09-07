"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/users/uid/{uid}:
 *   get:
 *     summary: Obtener perfil de un usuario por UID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         description: UID de Firebase del usuario a consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/uid/:uid', user_controller_1.getUser);
/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Actualizar perfil de un usuario por _id
 *     tags: [Usuarios]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario en Mongo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               experiencia:
 *                 type: string
 *               disponibilidad:
 *                 type: string
 *                 enum: [disponible, con condiciones, no disponible]
 *                 description: Estado de disponibilidad del profesional
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:userId', user_controller_1.updateUser);
/**
 * @swagger
 * /api/users/{userId}/desactivar:
 *   put:
 *     summary: Desactiva un usuario por _id
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario en Mongo
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:userId/desactivar', user_controller_1.desactivarUsuario);
/**
 * @swagger
 * /api/users/{userId}/upload-video:
 *   post:
 *     summary: Subir video de presentación de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario en Mongo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videoPresentacion:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video subido exitosamente
 *       400:
 *         description: Archivo no válido
 */
router.post('/:userId/upload-video', upload_middleware_1.uploadUsuario.single('videoPresentacion'), user_controller_1.uploadVideoPresentacion);
/**
 * @swagger
 * /api/users/{userId}/upload-cv:
 *   post:
 *     summary: Subir CV del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario en Mongo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV subido exitosamente
 *       400:
 *         description: Archivo inválido
 */
router.post('/:userId/upload-cv', upload_middleware_1.uploadCV.single('cv'), user_controller_1.uploadCVUsuario);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario (UID Firebase)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *               pais:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       409:
 *         description: Usuario ya existe
 *       500:
 *         description: Error del servidor
 */
router.post('/', auth_middleware_1.verifyFirebaseAuth, upload_middleware_1.uploadUsuario.fields([
    { name: 'videoPresentacion', maxCount: 1 },
    { name: 'cv', maxCount: 1 }
]), user_controller_1.createUser);
router.get('/trabajadores', user_controller_1.getTrabajadores);
/**
 * @swagger
 * /api/users/download/{filename}:
 *   get:
 *     summary: Descargar CV del usuario (forzado)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo CV a descargar
 *     responses:
 *       200:
 *         description: Archivo descargado correctamente
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/download/:filename', (req, res) => {
    const filePath = path_1.default.join(process.cwd(), 'uploads/cv_usuarios', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error('❌ Error enviando archivo:', err);
            res.status(500).json({ message: 'Error descargando archivo' });
        }
    });
});
/**
 * @swagger
 * /api/users/{userId}/upload-foto-perfil:
 *   post:
 *     summary: Subir imagen de perfil del usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario en Mongo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fotoPerfil:
 *                   type: string
 *                   example: https://tuservidor.com/uploads/fotoPerfil123.jpg
 *       400:
 *         description: Archivo inválido
 *       500:
 *         description: Error del servidor
 */
router.post('/:userId/upload-foto-perfil', upload_middleware_1.uploadUsuario.single('fotoPerfil'), user_controller_1.uploadFotoPerfil);
exports.default = router;
