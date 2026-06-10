import { http } from "./http";

export type Reservation = {
  id: number;
  customerName: string;
  resourceType: string;
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
};

export type CreateReservationDto = {
  customerName: string;
  resourceType: string;
  resourceName: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  amount?: number;
  businessId?: number;
  resourceId?: number;
  amountPaid?: number;
  paymentMethod?: string;
  purpose?: string;
};

export type UpdateReservationDto = Partial<CreateReservationDto>;

export const reservationsApi = {
  list: (customerName?: string) =>
    http<Reservation[]>(
      `/reservations${customerName ? `?customerName=${encodeURIComponent(customerName)}` : ""}`
    ),
  getById: (id: number) => http<Reservation>(`/reservations/${id}`),
  create: (dto: CreateReservationDto) =>
    http<Reservation>("/reservations", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  update: (id: number, dto: UpdateReservationDto) =>
    http<Reservation>(`/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
  remove: (id: number) =>
    http<void>(`/reservations/${id}`, { method: "DELETE" }),
  confirm: (id: number) =>
    http<Reservation>(`/reservations/${id}/confirm`, { method: "PATCH" }),
  changeStatus: (id: number, status: string) =>
    http<Reservation>(`/reservations/${id}/status?value=${status}`, {
      method: "PATCH",
    }),
};
