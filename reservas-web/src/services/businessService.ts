import axios from "axios";
import type { Business } from "../types/Business";

// 🔑 Helper para adjuntar el token en cada request
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // o donde lo guardes
  return {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// =========================
// CRUD + Endpoints extra
// =========================

// Listar todos
export const getBusinesses = async (): Promise<Business[]> => {
  const response = await axios.get("/api/businesses", getAuthHeaders());
  return response.data;
};

// Obtener por ID
export const getBusinessById = async (id: number): Promise<Business> => {
  const response = await axios.get(`/api/businesses/${id}`, getAuthHeaders());
  return response.data;
};

// Crear
export const createBusiness = async (data: Partial<Business>): Promise<Business> => {
  const response = await axios.post("/api/businesses", data, getAuthHeaders());
  return response.data;
};

// Actualizar
export const updateBusiness = async (id: number, data: Partial<Business>): Promise<Business> => {
  const response = await axios.put(`/api/businesses/${id}`, data, getAuthHeaders());
  return response.data;
};

// Eliminar
export const deleteBusiness = async (id: number) => {
  await axios.delete(`/api/businesses/${id}`, getAuthHeaders());
};

// Cambiar estado (PATCH)
export const toggleBusinessStatus = async (id: number): Promise<Business> => {
  const response = await axios.patch(`/api/businesses/${id}/status`, {}, getAuthHeaders());
  return response.data;
};

// =========================
// Endpoints de filtros
// =========================

export const getActiveBusinesses = async (): Promise<Business[]> => {
  const response = await axios.get("/api/businesses/active", getAuthHeaders());
  return response.data;
};

export const getBusinessesByCategory = async (category: string): Promise<Business[]> => {
  const response = await axios.get(`/api/businesses/category/${category}`, getAuthHeaders());
  return response.data;
};

export const searchBusinesses = async (keyword: string): Promise<Business[]> => {
  const response = await axios.get(`/api/businesses/search?keyword=${keyword}`, getAuthHeaders());
  return response.data;
};

export const getBusinessKPIs = async () => {
  const response = await axios.get("/api/businesses/kpis", getAuthHeaders());
  return response.data;
};
