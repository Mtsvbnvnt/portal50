"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerConversacion = exports.enviarMensaje = void 0;
const mensaje_model_1 = __importDefault(require("../models/mensaje.model"));
// Enviar mensaje
const enviarMensaje = async (req, res) => {
    try {
        const nuevoMensaje = new mensaje_model_1.default({
            remitenteId: req.body.remitenteId,
            destinatarioId: req.body.destinatarioId,
            relacionadoA: req.body.relacionadoA,
            relacionadoId: req.body.relacionadoId,
            mensaje: req.body.mensaje,
        });
        await nuevoMensaje.save();
        res.status(201).json({ message: 'Mensaje enviado con éxito', data: nuevoMensaje });
    }
    catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
        res.status(500).json({ message: 'Error al enviar mensaje' });
    }
};
exports.enviarMensaje = enviarMensaje;
// Obtener conversación entre dos usuarios
const obtenerConversacion = async (req, res) => {
    const { userA, userB } = req.params;
    try {
        const mensajes = await mensaje_model_1.default.find({
            $or: [
                { remitenteId: userA, destinatarioId: userB },
                { remitenteId: userB, destinatarioId: userA }
            ]
        }).sort({ fecha: 1 }); // Orden cronológico
        res.status(200).json(mensajes);
    }
    catch (error) {
        console.error('❌ Error al obtener conversación:', error);
        res.status(500).json({ message: 'Error al obtener la conversación' });
    }
};
exports.obtenerConversacion = obtenerConversacion;
