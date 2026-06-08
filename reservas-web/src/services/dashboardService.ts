import axios from "axios";

const API_URL = "http://localhost:5173/api/dashboard"; // Ajusta la URL base según tu proxy

export interface DashboardStats {
  totalBusinesses: number;
  totalResources: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  canceledReservations: number;
  businessesByCategory: { [key: string]: number };
  monthlyReservationFlow: { [key: string]: number }; // Ej: { "Ene": 80, "Feb": 110 }
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const token = localStorage.getItem("token"); // Si usas autenticación JWT
  const response = await axios.get(`${API_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};