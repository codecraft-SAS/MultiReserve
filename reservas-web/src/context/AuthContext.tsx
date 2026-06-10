import { createContext, useContext, useState, type ReactNode } from "react";
import { authApi, type LoginDto, type RegisterDto } from "../api/auth";

type AuthUser = {
  token: string;
  fullName: string;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  login: (dto: LoginDto) => Promise<AuthUser>;
  register: (dto: RegisterDto) => Promise<AuthUser>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    return null;
  });

  async function login(dto: LoginDto) {
    const data = await authApi.login(dto);
    const authUser = {
      token: data.token,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(authUser));
    localStorage.setItem("token", data.token);
    setUser(authUser);
    return authUser;
  }

  async function register(dto: RegisterDto) {
    const data = await authApi.register(dto);
    const authUser = {
      token: data.token,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(authUser));
    localStorage.setItem("token", data.token);
    setUser(authUser);
    return authUser;
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
