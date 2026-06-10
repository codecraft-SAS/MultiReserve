import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  businessesApi,
  type CreateBusinessDto,
  type UpdateBusinessDto,
} from "./businesses";

const keys = {
  all: ["businesses"] as const,
  byId: (id: number) => ["businesses", id] as const,
  active: ["businesses", "active"] as const,
  byCategory: (cat: string) => ["businesses", "category", cat] as const,
};

export function useBusinesses() {
  return useQuery({
    queryKey: keys.all,
    queryFn: businessesApi.list,
  });
}

export function useBusiness(id: number) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => businessesApi.getById(id),
    enabled: !!id,
  });
}

export function useActiveBusinesses() {
  return useQuery({
    queryKey: keys.active,
    queryFn: businessesApi.getActive,
  });
}

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBusinessDto) => businessesApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateBusinessDto }) =>
      businessesApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => businessesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useToggleBusinessStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => businessesApi.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
