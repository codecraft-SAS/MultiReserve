import { http } from "./http";

export type Business = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  category?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  active: boolean;
  ownerId?: number;
};

export type CreateBusinessDto = {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  category?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
};

export type UpdateBusinessDto = Partial<CreateBusinessDto>;

export const businessesApi = {
  list: () => http<Business[]>("/businesses"),
  getById: (id: number) => http<Business>(`/businesses/${id}`),
  create: (dto: CreateBusinessDto) =>
    http<Business>("/businesses", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  update: (id: number, dto: UpdateBusinessDto) =>
    http<Business>(`/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
  remove: (id: number) =>
    http<void>(`/businesses/${id}`, { method: "DELETE" }),
  getActive: () => http<Business[]>("/businesses/active"),
  getByOwner: (ownerId: number) =>
    http<Business[]>(`/businesses/owner/${ownerId}`),
  getByCategory: (category: string) =>
    http<Business[]>(`/businesses/category/${category}`),
  getByCity: (city: string) => http<Business[]>(`/businesses/city/${city}`),
  search: (keyword: string) =>
    http<Business[]>(`/businesses/search?keyword=${encodeURIComponent(keyword)}`),
  toggleStatus: (id: number) =>
    http<Business>(`/businesses/${id}/status`, { method: "PATCH" }),
};
