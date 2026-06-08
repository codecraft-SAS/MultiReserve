import api from "../api/axios";
import type { Reservation } from "../types/Reservation";

export const getReservations = async (): Promise<Reservation[]> => {

  const response = await api.get("/reservations");

  return response.data;
};

export const getReservationById = async (
  id: number
): Promise<Reservation> => {

  const response = await api.get(
    `/reservations/${id}`
  );

  return response.data;
};

export const confirmReservation = async (
  id: number
) => {

  const response = await api.patch(
    `/reservations/${id}/confirm`
  );

  return response.data;
};

export const changeReservationStatus = async (
  id: number,
  status: string
) => {

  const response = await api.patch(
    `/reservations/${id}/status?value=${status}`
  );

  return response.data;
};