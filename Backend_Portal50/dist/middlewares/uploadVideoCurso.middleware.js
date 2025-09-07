"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideoCurso = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storageCurso = multer_1.default.diskStorage({
    destination: 'uploads/videos_cursos',
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilterCurso = (_req, file, cb) => {
    const allowedTypes = ['.mp4', '.mov', '.avi'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (!allowedTypes.includes(ext)) {
        return cb(new Error('Formato de video no permitido'));
    }
    cb(null, true);
};
exports.uploadVideoCurso = (0, multer_1.default)({
    storage: storageCurso,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    fileFilter: fileFilterCurso,
});
