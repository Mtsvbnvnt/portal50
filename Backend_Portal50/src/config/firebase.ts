// src/config/firebase.ts
import admin from "firebase-admin";
import path from "path";

let serviceAccount;

// Configuración para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  try {
    // Intentar cargar desde archivo local (desarrollo)
    const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
    serviceAccount = require(serviceAccountPath);
    console.log("🔧 Usando serviceAccountKey.json para desarrollo local");
  } catch (e) {
    console.warn("⚠️ No se encontró serviceAccountKey.json para desarrollo local");
    
    // Fallback: configuración mínima para desarrollo
    serviceAccount = {
      type: "service_account",
      project_id: "portal50-dev",
      private_key_id: "dev-key-id",
      private_key: "-----BEGIN PRIVATE KEY-----\nDEV_KEY\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk@portal50-dev.iam.gserviceaccount.com",
      client_id: "123456789",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token"
    };
    console.log("🔧 Usando configuración de desarrollo mock");
  }
} else {
  // Configuración para producción (Railway/Vercel)
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG as string);
    console.log("🚀 Usando FIREBASE_CONFIG para producción");
  } catch (e) {
    console.warn("⚠️ No se pudo parsear FIREBASE_CONFIG en producción");
  }
}

// Inicializar Firebase si tenemos configuración válida
if (serviceAccount && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK inicializado correctamente");
  } catch (error) {
    console.warn("⚠️ Error inicializando Firebase:", error);
    console.log("⚠️ La aplicación funcionará sin Firebase");
  }
} else if (!serviceAccount) {
  console.log("⚠️ No hay configuración de Firebase disponible");
  console.log("⚠️ La aplicación funcionará sin Firebase");
}

export default admin;
