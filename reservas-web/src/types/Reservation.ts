// src/types/Reservation.ts

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";

export interface Reservation {
  id: number;
  customerName: string;
  reservationDate: string; // 📅 Nombre real que viene del Backend
  startTime: string;
  endTime: string;
  status: ReservationStatus; // 💡 Tipado estricto para evitar el error 2367
  amount: number;          // 💵 Equivalente a pricePaid / valor total
  businessName: string;
  resourceName: string;
}