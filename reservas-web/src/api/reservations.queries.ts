import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  reservationsApi,
  type CreateReservationDto,
  type UpdateReservationDto,
} from "./reservations";

const keys = {
  all: ["reservations"] as const,
  byId: (id: number) => ["reservations", id] as const,
};

export function useReservations(customerName?: string) {
  return useQuery({
    queryKey: [...keys.all, customerName].filter(Boolean),
    queryFn: () => reservationsApi.list(customerName),
  });
}

export function useReservation(id: number) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => reservationsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReservationDto) => reservationsApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateReservationDto }) =>
      reservationsApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reservationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useConfirmReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reservationsApi.confirm(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useChangeReservationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      reservationsApi.changeStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
