"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCurso = exports.uploadCV = exports.uploadUsuario = void 0;
// src/middlewares/upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// --- Crea rutas si no existen
const root = path_1.default.resolve(process.cwd(), 'uploads');
const ensureDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
        console.log('[MULTER] Creada carpeta:', dir);
    }
};
ensureDir(path_1.default.join(root, 'cursos'));
ensureDir(path_1.default.join(root, 'usuarios'));
ensureDir(path_1.default.join(root, 'cv_usuarios'));
ensureDir(path_1.default.join(root, 'fotos_perfil'));
ensureDir(path_1.default.join(root, 'otros'));
// --- Almacenamiento general
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'videoCurso') {
            cb(null, path_1.default.join(root, 'cursos'));
        }
        else if (file.fieldname === 'videoPresentacion') {
            cb(null, path_1.default.join(root, 'usuarios'));
        }
        else if (file.fieldname === 'cv') {
            cb(null, path_1.default.join(root, 'cv_usuarios'));
        }
        else if (file.fieldname === 'fotoPerfil') {
            cb(null, path_1.default.join(root, 'fotos_perfil'));
        }
        else {
            cb(null, path_1.default.join(root, 'otros'));
        }
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = path_1.default.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});
// --- Filtro de archivos por tipo
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const allowedVideo = ['.mp4', '.mov', '.avi'];
    const allowedDocs = ['.pdf', '.doc', '.docx'];
    const allowedImages = ['.jpg', '.jpeg', '.png'];
    if (file.fieldname === 'videoPresentacion' && !allowedVideo.includes(ext)) {
        return cb(new Error('Formato de video de usuario no válido'));
    }
    if (file.fieldname === 'videoCurso' && !allowedVideo.includes(ext)) {
        return cb(new Error('Formato de video de curso no válido'));
    }
    if (file.fieldname === 'cv' && !allowedDocs.includes(ext)) {
        return cb(new Error('Formato de CV no válido'));
    }
    if (file.fieldname === 'fotoPerfil' && !allowedImages.includes(ext)) {
        return cb(new Error('Formato de imagen de perfil no válido'));
    }
    cb(null, true);
};
// --- Multer configurado por campo
exports.uploadUsuario = (0, multer_1.default)({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB para video usuario
    fileFilter,
});
exports.uploadCV = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB para CV
    fileFilter,
});
exports.uploadCurso = (0, multer_1.default)({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB para video curso
    fileFilter,
});
