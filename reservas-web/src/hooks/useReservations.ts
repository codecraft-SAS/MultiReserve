import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Definición interna de la estructura de una reserva para consistencia del Hook
interface Reservation {
  id: number;
  businessName?: string; // Usado por el cliente
  clientName?: string;   // Usado por el empleado
  clientEmail?: string;  // Usado por el empleado
  resourceName: string;
  resourceType: string;
  city?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  pricePaid?: number;
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener las reservas desde la API de Spring Boot
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // NOTA: Si manejas endpoints separados (ej: /my-reservations o /admin/reservations),
      // puedes unificarlo o ajustar la ruta según las necesidades de tu sistema de autenticación JWT.
      const response = await fetch("http://localhost:8080/api/reservations", {
        headers: {
          // Si ya estás usando almacenamiento de JWT, descomenta la línea de abajo:
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Error al obtener el listado de reservas");
      
      const data = await response.json();
      setReservations(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  // Función mutadora para cambiar el estado (Aprobar / Cancelar / Rechazar)
  const updateReservationStatus = async (id: number, nextStatus: "CONFIRMED" | "CANCELLED") => {
    try {
      // Petición PATCH apuntando al controlador operativo de tu backend
      const response = await fetch(`http://localhost:8080/api/reservations/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) throw new Error("No se pudo actualizar el estado en el servidor");

      // Optimización en memoria: actualiza el estado local inmediatamente sin recargar todo de la API
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: nextStatus } : res))
      );
      
    } catch (err: any) {
      console.error("Error en updateReservationStatus:", err);
      throw err; // Re-lanzamos el error para que el 'toast.error' del componente lo capture
    }
  };

  // Carga inicial automática al montar el componente
  useEffect(() => {
    fetchReservations();
  }, []);

  return { 
    reservations, 
    loading, 
    error, 
    updateReservationStatus, 
    refresh: fetchReservations 
  };
};