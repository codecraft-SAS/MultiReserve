import api from "../api/axios";
import type { Reservation } from "../types/Reservation";

// ============================================================================
// MÓDULO COMPARTIDO / CLIENTE
// ============================================================================

/**
 * Obtener todas las reservas.
 * Para el rol CLIENT filtra automáticamente por su pertenencia en la BD.
 * Para el rol ADMIN trae la lista global.
 */
export const getReservations = async (): Promise<Reservation[]> => {
  const response = await api.get<Reservation[]>("/reservations");
  return response.data;
};

/**
 * Obtener una reserva específica por su ID.
 * Respeta las reglas de Ownership Security del backend.
 */
export const getReservationById = async (id: number): Promise<Reservation> => {
  const response = await api.get<Reservation>(`/reservations/${id}`);
  return response.data;
};

/**
 * Crear una nueva reserva en el sistema.
 * 🌟 Sincronizado estrictamente con CreateReservationRequest de Spring Boot
 * para evitar errores de validación de argumentos (MethodArgumentNotValidException).
 */
export const createReservation = async (reservationData: {
  resourceId: number;
  resourceName: string;       // 🌟 Requerido por @NotBlank en Java
  resourceType: string;       // 🌟 Requerido por @NotNull en Java (Ej: "DEPORTIVO")
  customerName: string;       // 🌟 Requerido por @NotBlank en Java
  reservationDate: string;    // 🌟 Requerido por @NotNull en Java (Formato: YYYY-MM-DD)
  startTime: string;          // Formato ISO string para LocalDateTime (Ej: "2026-06-08T14:00:00")
  endTime: string;            // Formato ISO string para LocalDateTime
  purpose?: string;           // Opcional
}): Promise<Reservation> => {
  const response = await api.post<Reservation>("/reservations", reservationData);
  return response.data;
};

/**
 * Cancelación autónoma por parte del Cliente.
 * ✅ Sincronizado: Consume el endpoint @PatchMapping("/{id}/status") real de Spring Boot.
 */
export const cancelReservation = async (id: number): Promise<Reservation> => {
  const response = await api.patch<Reservation>(`/reservations/${id}/status?value=CANCELLED`);
  return response.data;
};

/**
 * Consultar los bloques de horarios ocupados de un recurso para una fecha específica.
 * Evita el double-booking directamente desde la interfaz de usuario.
 */
export const getResourceAvailability = async (resourceId: number, date: string): Promise<string[]> => {
  const response = await api.get<string[]>(`/resources/${resourceId}/availability`, {
    params: { date }
  });
  return response.data;
};

// ============================================================================
// MÓDULO EXCLUSIVO PARA EL ROL EMPLEADO / ADMIN
// ============================================================================

/**
 * Confirmar y aprobar una reserva en estado de espera (PENDING).
 */
export const confirmReservation = async (id: number): Promise<Reservation> => {
  const response = await api.patch<Reservation>(`/reservations/${id}/confirm`);
  return response.data;
};

/**
 * Cambiar dinámicamente el estado operativo de una reserva mediante Query Params.
 * Envía el valor al método service.changeStatus() del backend.
 */
export const changeReservationStatus = async (id: number, status: string): Promise<Reservation> => {
  const response = await api.patch<Reservation>(`/reservations/${id}/status?value=${status}`);
  return response.data;
};