import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { Reservation } from "../types/Reservation";
import { 
  getReservations, 
  createReservation, 
  cancelReservation, 
  changeReservationStatus 
} from "../services/reservationService";

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener las reservas (Ownership Security: Clientes solo ven las suyas)
  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservations();
      setReservations(data);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "No se pudieron cargar las reservas.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // MÓDULO CLIENTE: Crear una nueva reserva con validación estricta de DTO de Spring Boot
  const createNewReservation = async (reservationData: {
    resourceId: number;
    resourceName: string;       // 🌟 Añadido para cumplir con @NotBlank de Java
    resourceType: string;       // 🌟 Añadido para cumplir con @NotNull de Java
    customerName: string;       // 🌟 Añadido para cumplir con @NotBlank de Java
    reservationDate: string;    // 🌟 Añadido para cumplir con @NotNull de Java (YYYY-MM-DD)
    startTime: string;          // Formato ISO string para LocalDateTime
    endTime: string;            // Formato ISO string para LocalDateTime
    purpose?: string;
    // 💳 NUEVOS CAMPOS DE PAGO INTEGRADOS:
    amountPaid: number;
    paymentMethod: string;
  }) => {
    try {
      setError(null);
      const newRes = await createReservation(reservationData);
      setReservations((prev) => [newRes, ...prev]);
      toast.success("¡Reserva solicitada con éxito!");
      return { success: true, data: newRes };
    } catch (err: any) {
      // Captura los códigos 400 y 409 de excepciones controladas de Spring Boot (Double-booking, error de abono, etc.)
      const backendMessage = err.response?.data?.message || "Error al procesar el pago o la reserva.";
      setError(backendMessage);
      toast.error(backendMessage);
      return { success: false, error: backendMessage };
    }
  };

  // MÓDULO CLIENTE: Cancelación autónoma si está en estado PENDING
  const cancelExistingReservation = async (id: number) => {
    try {
      setError(null);
      await cancelReservation(id);
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: "CANCELLED" } : res))
      );
      toast.success("Reserva cancelada correctamente.");
      return true;
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || "No se pudo cancelar la reserva.";
      toast.error(backendMessage);
      return false;
    }
  };

  // MÓDULO EMPLEADO / ADMIN: Mutador de estados operativos (Confirmar/Rechazar/Completar)
  const updateReservationStatus = async (id: number, nextStatus: "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED") => {
    try {
      setError(null);
      await changeReservationStatus(id, nextStatus);
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, status: nextStatus } : res))
      );
      toast.success(`Reserva marcada como ${nextStatus.toLowerCase()}`);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || "Error al actualizar el estado de la reserva.";
      toast.error(backendMessage);
      console.error("Error en updateReservationStatus:", err);
    }
  };

  // Carga inicial automática al montar el componente
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    createNewReservation,
    cancelExistingReservation,
    updateReservationStatus,
    refresh: fetchReservations
  };
};