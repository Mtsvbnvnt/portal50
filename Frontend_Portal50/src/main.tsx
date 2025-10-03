import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx';
import { AuthProvider } from "./context/AuthContext.tsx";
import {UserProvider} from "./context/UserContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import './i18n'; // Importar configuración de i18n


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);