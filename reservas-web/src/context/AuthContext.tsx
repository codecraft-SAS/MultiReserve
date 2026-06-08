import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react"; 
import { login as loginService, register as registerService } from "../services/authService";

export interface User {
  token: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "CLIENT" | "EMPLOYEE";
}

// Interfaz para las credenciales que espera el backend
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // 🌟 Agregado para que PrivateRoute sepa cuándo frenar el rebote
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (fullName: string, email: string, password: string, role: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 🌟 Arranca en true para proteger la carga inicial

  // 🌟 Efecto encargado de leer de manera segura el almacenamiento persistente al montar la app
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error al restaurar la sesión desde el almacenamiento local:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // 🌟 Sincronización completada con éxito
    }
  }, []);

  // Implementación del login
  const login = async (credentials: LoginCredentials): Promise<User> => {
    const data = await loginService(credentials); 
    
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    
    return data;
  };

  // Implementación del registro
  const register = async (
    fullName: string,
    email: string,
    password: string,
    role: string
  ): Promise<User> => {
    const data = await registerService({
      fullName,
      email,
      password,
      role
    });
    
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    
    return data;
  };

  // Cierre de sesión y limpieza de almacenamiento
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};