// src/utils/statusColor.ts

// 🌟 Solución Definitiva: Añadimos REJECTED y COMPLETED para cubrir todo el contrato del Backend
export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";

/**
 * Retorna las clases de Tailwind CSS correspondientes al estado de la reserva
 * para renderizar Badges unificados con estética opaca/vidrio moderna.
 */
export const getStatusBadgeStyles = (status: ReservationStatus): string => {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "CANCELLED":
    case "REJECTED":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "COMPLETED": // 🌟 Estética azul para turnos finalizados con éxito
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "PENDING":
    default:
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }
};

/**
 * Retorna la traducción directa del estado al español.
 */
export const getStatusText = (status: ReservationStatus): string => {
  switch (status) {
    case "CONFIRMED":
      return "Confirmada";
    case "CANCELLED":
      return "Cancelada";
    case "REJECTED":
      return "Rechazada";
    case "COMPLETED": // 🌟 Traducción para el estado completado
      return "Completada";
    case "PENDING":
    default:
      return "Pendiente";
  }
};