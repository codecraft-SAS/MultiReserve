export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";

export interface Reservation {
  id: number;
  customerName: string;
  resourceType?: string;
  resourceName: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: string;
  amount?: number;
  amountPaid?: number;
  paymentMethod?: string;
  purpose?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  businessId?: number;
  businessName?: string;
  resourceId?: number;
}