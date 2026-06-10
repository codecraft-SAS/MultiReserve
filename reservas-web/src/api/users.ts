import { http } from "./http";

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  businessId?: number;
};

export type CreateUserDto = {
  fullName: string;
  email: string;
  password: string;
  role: string;
  businessId?: number;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export const usersApi = {
  list: () => http<User[]>("/admin/users"),
  create: (dto: CreateUserDto) =>
    http<User>("/admin/users", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  update: (id: number, dto: UpdateUserDto) =>
    http<User>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
  remove: (id: number) =>
    http<void>(`/admin/users/${id}`, { method: "DELETE" }),
};
