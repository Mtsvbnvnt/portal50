import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const verifyFirebaseAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No se encontró token de autenticación." });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // Verificar si Firebase Admin está disponible
    if (!admin.apps.length) {
      console.warn("⚠️ Firebase Admin no disponible, modo desarrollo");
      // En desarrollo, simular la verificación del token
      if (process.env.NODE_ENV !== 'production') {
        // Decodificar el token manualmente para obtener el UID (sin verificación)
        try {
          const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
          req.user = {
            uid: payload.user_id || payload.uid || 'dev-user',
            email: payload.email || 'dev@example.com'
          };
          console.log("🔧 Modo desarrollo: token procesado sin verificación");
          next();
          return;
        } catch (decodeError) {
          console.error("❌ Error decodificando token en desarrollo:", decodeError);
          return res.status(401).json({ message: "Token malformado." });
        }
      }
      return res.status(500).json({ message: "Firebase no está configurado correctamente." });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};
