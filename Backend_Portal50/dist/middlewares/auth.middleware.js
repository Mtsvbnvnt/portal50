"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFirebaseAuth = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const verifyFirebaseAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No se encontró token de autenticación." });
    }
    const idToken = authHeader.split(" ")[1];
    try {
        const decodedToken = await firebase_1.default.auth().verifyIdToken(idToken);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        next();
    }
    catch (error) {
        console.error("❌ Error verificando token:", error);
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};
exports.verifyFirebaseAuth = verifyFirebaseAuth;
