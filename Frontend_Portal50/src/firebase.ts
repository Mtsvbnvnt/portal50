// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCR_lQcycAQIM4cq9CfDbu4Sfhe12wNMGc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portal50-81af7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portal50-81af7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portal50-81af7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "115968238719",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:115968238719:web:328aa3db9839a869f84b4a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WJSJNFDSFQ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta auth listo para usar
export const auth = getAuth(app);
