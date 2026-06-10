import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react"; 
// 💡 Importamos también updateProfile desde tu authService
import { 
  login as loginService, 
  register as registerService, 
  updateProfile as updateProfileService 
} from "../services/authService";

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

// 🛠️ CORRECCIÓN 1: Agregamos la firma de la función a la interfaz del contexto para evitar que TypeScript se queje
interface AuthContextType {
  user: User | null;
  loading: boolean; 
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (fullName: string, email: string, password: string, role: "ADMIN" | "CLIENT" | "EMPLOYEE") => Promise<User>;
  updateUser: (fullName: string, email: string) => Promise<void>; // ◄ ¡Añadido!
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  // Efecto encargado de leer de manera segura el almacenamiento persistente al montar la app
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
      setLoading(false); 
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
    role: "ADMIN" | "CLIENT" | "EMPLOYEE"
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

  // 🚀 CORRECCIÓN 2: Implementación real y segura de la actualización de perfil dentro del proveedor
  const updateUser = async (fullName: string, email: string): Promise<void> => {
    try {
      // Mandamos la petición a través de Axios usando tu servicio
      const freshData = await updateProfileService({ fullName, email });
      
      // Actualizamos el estado reactivo global (así se enteran de inmediato el Sidebar y el Header)
      setUser(freshData);
      
      // Sincronizamos localmente el almacenamiento para mantener los datos si refrescan la pestaña
      localStorage.setItem("user", JSON.stringify(freshData));
      if (freshData.token) {
        localStorage.setItem("token", freshData.token);
      }
    } catch (error) {
      console.error("Error al sincronizar el perfil actualizado en el contexto:", error);
      throw error; // Re-lanzamos el error para que la página del perfil pueda mostrar el toast de alerta
    }
  };

  // Cierre de sesión y limpieza completa de almacenamiento
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🛠️ CORRECCIÓN 3: Exponemos de forma oficial la propiedad "updateUser" en el Value del Contexto
  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};