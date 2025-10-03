import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx';
import { AuthProvider } from "./context/AuthContext.tsx";
import {UserProvider} from "./context/UserContext.tsx";
import './i18n'; // Importar configuración de i18n


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);