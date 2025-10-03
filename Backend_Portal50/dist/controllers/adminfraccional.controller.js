"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerEjecutivos = exports.crearAdminFraccional = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const user_model_1 = require("../models/user.model");
const nodemailer_1 = __importDefault(require("nodemailer"));
function generarPassword(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pass = '';
    for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}
const crearAdminFraccional = async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, rol } = req.body;
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ message: 'Faltan datos obligatorios: nombre, apellido, email y contraseña son requeridos' });
        }
        // Validar longitud de contraseña
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }
        // 1. Crear usuario en Firebase con la contraseña proporcionada
        const firebaseUser = await firebase_1.default.auth().createUser({
            email,
            password,
            displayName: `${nombre} ${apellido}`,
            emailVerified: false,
            disabled: false
        });
        // 2. Crear usuario en MongoDB
        const nuevoUsuario = new user_model_1.User({
            uid: firebaseUser.uid,
            nombre: `${nombre} ${apellido}`,
            email,
            telefono,
            rol: rol === 'ejecutivo' ? 'ejecutivo' : 'admin-fraccional',
            activo: true
        });
        await nuevoUsuario.save();
        // 3. Enviar correo de notificación (sin contraseña por seguridad)
        try {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });
            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: email,
                subject: rol === 'ejecutivo' ? 'Acceso Ejecutivo Fraccional Portal50+' : 'Acceso Administrador Fraccional Portal50+',
                html: `<h2>Bienvenido a Portal50+</h2>
        <p>Has sido registrado como <b>${rol === 'ejecutivo' ? 'Ejecutivo Fraccional' : 'Administrador Fraccional'}</b>.</p>
        <p><b>Nombre:</b> ${nombre} ${apellido}<br/>
        <b>Email:</b> ${email}<br/>
        <b>Teléfono:</b> ${telefono || 'No proporcionado'}</p>
        <p>Tu cuenta ha sido creada. Utiliza tus credenciales para acceder.</p>
        <p>Accede en: <a href="https://portal50.com/login">portal50.com/login</a></p>`
            });
        }
        catch (emailError) {
            console.warn('⚠️ Error enviando email de notificación:', emailError);
            // No fallar la creación si el email falla
        }
        res.status(201).json({
            message: `${rol === 'ejecutivo' ? 'Ejecutivo' : 'Administrador fraccional'} creado exitosamente`,
            uid: firebaseUser.uid,
            usuario: {
                nombre: `${nombre} ${apellido}`,
                email,
                telefono,
                rol: rol === 'ejecutivo' ? 'ejecutivo' : 'admin-fraccional'
            }
        });
    }
    catch (err) {
        if (err.code === 'auth/email-already-exists') {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }
        if (err.code === 'auth/invalid-email') {
            return res.status(400).json({ message: 'El formato del email no es válido' });
        }
        if (err.code === 'auth/weak-password') {
            return res.status(400).json({ message: 'La contraseña es muy débil' });
        }
        console.error('❌ Error creando admin fraccional:', err);
        res.status(500).json({ message: 'Error creando admin fraccional', error: err.message });
    }
};
exports.crearAdminFraccional = crearAdminFraccional;
const obtenerEjecutivos = async (req, res) => {
    try {
        // Buscar todos los usuarios con rol ejecutivo o admin-fraccional
        const ejecutivos = await user_model_1.User.find({
            rol: { $in: ['ejecutivo', 'admin-fraccional'] }
        }).select('nombre email telefono rol activo createdAt').sort({ createdAt: -1 });
        res.status(200).json(ejecutivos);
    }
    catch (err) {
        console.error('❌ Error obteniendo ejecutivos:', err);
        res.status(500).json({ message: 'Error obteniendo lista de ejecutivos', error: err.message });
    }
};
exports.obtenerEjecutivos = obtenerEjecutivos;
