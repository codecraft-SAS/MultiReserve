import api from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

// ◄ INTERFAZ PARA LA PETICIÓN DE PERFIL
export interface UpdateProfileRequest {
  fullName: string;
  email: string;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// 🚀 FUNCIÓN CORREGIDA: Adjunta el token JWT para evitar el error 401 Unauthorized
export const updateProfile = async (data: UpdateProfileRequest) => {
  // 1. Recuperamos el token del almacenamiento local (asegúrate de que se guarde con la clave 'token')
  const token = localStorage.getItem("token");

  // 2. Enviamos la petición PUT inyectando el Bearer Token en los Headers
  const response = await api.put("/auth/update-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data; // Retorna el AuthResponse con los datos actualizados y el nuevo token
};