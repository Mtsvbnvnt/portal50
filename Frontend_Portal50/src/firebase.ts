// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🚨 Tus datos reales de Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyCR_lQcycAQIM4cq9CfDbu4Sfhe12wNMGc",
  authDomain: "portal50-81af7.firebaseapp.com",
  projectId: "portal50-81af7",
  storageBucket: "portal50-81af7.firebasestorage.app",
  messagingSenderId: "115968238719",
  appId: "1:115968238719:web:328aa3db9839a869f84b4a",
  measurementId: "G-WJSJNFDSFQ"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta auth listo para usar
export const auth = getAuth(app);
