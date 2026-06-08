export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

/**
 * Retorna las clases de Tailwind CSS correspondientes al estado de la reserva
 * para renderizar Badges unificados con estética opaca/vidrio moderna.
 */
export const getStatusBadgeStyles = (status: ReservationStatus): string => {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "CANCELLED":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
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
    case "PENDING":
    default:
      return "Pendiente";
  }
};