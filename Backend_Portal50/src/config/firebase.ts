// src/config/firebase.ts
import admin from "firebase-admin";

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG as string);
} catch (e) {
  console.warn("⚠️ No se pudo parsear FIREBASE_CONFIG, Firebase no se inicializará");
}

if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase inicializado");
} else {
  console.log("⚠️ La aplicación funcionará sin Firebase");
}

export default admin;
