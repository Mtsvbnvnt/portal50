import { createContext, useState, useEffect } from "react";
import { getApiUrl } from "../config/api";

export interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  modalidadPreferida?: string;
  cv?: string;
  fotoPerfil?: string;
  disponibilidad?: "disponible" | "con condiciones" | "no disponible";
  rol?: "profesional" | "profesional-ejecutivo" | "empresa" | "admin-fraccional" | "ejecutivo";
  educaciones?: { institucion: string; titulo: string; desde: string; hasta: string }[];
  experiencias?: { empresa: string; cargo: string; desde: string; hasta: string }[];
  habilidades?: string[];
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.fotoPerfil && !parsed.fotoPerfil.startsWith("http")) {
        parsed.fotoPerfil = getApiUrl(parsed.fotoPerfil);
      }
      setUser(parsed);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
