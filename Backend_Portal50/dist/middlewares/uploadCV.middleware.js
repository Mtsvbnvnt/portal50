"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCV = void 0;
// src/middlewares/upload.middleware.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ✅ Resuelve SIEMPRE la raíz
const projectRoot = path_1.default.resolve(process.cwd());
const uploadRoot = path_1.default.join(projectRoot, 'uploads', 'cv_usuarios');
// 👇 Muestra siempre dónde está apuntando
console.log('[MULTER] Directorio raíz:', projectRoot);
console.log('[MULTER] Directorio CV:', uploadRoot);
// ✅ Si no existe lo crea
if (!fs_1.default.existsSync(uploadRoot)) {
    fs_1.default.mkdirSync(uploadRoot, { recursive: true });
    console.log('[MULTER] Carpeta creada:', uploadRoot);
}
else {
    console.log('[MULTER] Carpeta existente:', uploadRoot);
}
const storageCV = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadRoot);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilterCV = (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
        return cb(new Error('Formato no permitido'));
    }
    cb(null, true);
};
exports.uploadCV = (0, multer_1.default)({
    storage: storageCV,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilterCV,
});
