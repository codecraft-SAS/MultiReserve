import api from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export const login = async (
  data: LoginRequest
) => {

  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterRequest
) => {

  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};