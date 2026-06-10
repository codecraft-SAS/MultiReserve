import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  resourcesApi,
  type CreateResourceDto,
  type UpdateResourceDto,
} from "./resources";

const keys = {
  all: ["resources"] as const,
  byBusiness: (id: number) => ["resources", "business", id] as const,
  availability: (id: number, date: string) =>
    ["resources", "availability", id, date] as const,
};

export function useResources() {
  return useQuery({
    queryKey: keys.all,
    queryFn: resourcesApi.list,
  });
}

export function useResourcesByBusiness(businessId: number) {
  return useQuery({
    queryKey: keys.byBusiness(businessId),
    queryFn: () => resourcesApi.getByBusiness(businessId),
    enabled: !!businessId,
  });
}

export function useAvailability(resourceId: number, date: string) {
  return useQuery({
    queryKey: keys.availability(resourceId, date),
    queryFn: () => resourcesApi.getAvailability(resourceId, date),
    enabled: !!resourceId && !!date,
  });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateResourceDto) => resourcesApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateResourceDto }) =>
      resourcesApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resourcesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
