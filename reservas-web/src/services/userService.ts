import api from "../api/axios";

export interface UserDTO {
  id?: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | "CLIENT";
  password?: string;
  businessId?: number | null;
}

// 🌟 Trae todos los usuarios del sistema
export const getAllUsers = async (): Promise<UserDTO[]> => {
  const response = await api.get("/admin/users");
  return response.data;
};

// 🌟 Guarda un nuevo registro desde el panel
export const createUserFromAdmin = async (user: UserDTO): Promise<UserDTO> => {
  const response = await api.post("/admin/users", user);
  return response.data;
};

// 🌟 Modifica datos existentes mediante el ID por URL
export const updateUserFromAdmin = async (id: number, user: UserDTO): Promise<UserDTO> => {
  const response = await api.put(`/admin/users/${id}`, user);
  return response.data;
};

// 🌟 Remueve permanentemente al usuario de la base de datos
export const deleteUserFromAdmin = async (id: number): Promise<void> => {
  // ✅ CORREGIDO: Dejamos una sola vez el prefijo del endpoint
  await api.delete(`/admin/users/${id}`); 
};