import { http } from "./http";

export type AuthResponse = {
  token: string;
  fullName: string;
  email: string;
  role: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  fullName: string;
  email: string;
  password: string;
  role: string;
};

export type UpdateProfileDto = {
  fullName: string;
  email: string;
};

export const authApi = {
  login: (dto: LoginDto) =>
    http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  register: (dto: RegisterDto) =>
    http<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
  updateProfile: (dto: UpdateProfileDto) =>
    http<AuthResponse>("/auth/update-profile", {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
};
