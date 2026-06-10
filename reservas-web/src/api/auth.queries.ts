import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginDto, type RegisterDto, type UpdateProfileDto } from "./auth";

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => authApi.updateProfile(dto),
  });
}
