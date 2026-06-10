import { http } from "./http";

export type Resource = {
  id: number;
  name: string;
  type: string;
  description?: string;
  capacity?: number;
  pricePerHour?: number;
  imageUrl?: string;
  status: string;
  openingHour?: string;
  closingHour?: string;
  businessId?: number;
  businessName?: string;
};

export type CreateResourceDto = {
  name: string;
  type: string;
  description?: string;
  capacity?: number;
  pricePerHour?: number;
  imageUrl?: string;
  status?: string;
  openingHour?: string;
  closingHour?: string;
  businessId?: number;
};

export type UpdateResourceDto = Partial<CreateResourceDto>;

export const resourcesApi = {
  list: () => http<Resource[]>("/resources"),
  getById: (id: number) => http<Resource>(`/resources/${id}`),
  create: (dto: CreateResourceDto) =>
    http<Resource>("/resources", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  update: (id: number, dto: UpdateResourceDto) =>
    http<Resource>(`/resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
  remove: (id: number) =>
    http<void>(`/resources/${id}`, { method: "DELETE" }),
  getByBusiness: (businessId: number) =>
    http<Resource[]>(`/resources/business/${businessId}`),
  getAvailability: (id: number, date: string) =>
    http<string[]>(`/resources/${id}/availability?date=${date}`),
};
