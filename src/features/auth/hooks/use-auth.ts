"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/modules/auth/api/auth-api";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "@/modules/auth/schemas/auth-schema";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
  });
}

export function useModulesQuery(enabled = true) {
  return useQuery({
    queryKey: ["modules"],
    queryFn: authApi.fetchModules,
    enabled,
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
  });
}
