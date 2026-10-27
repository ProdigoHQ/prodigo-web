import { httpClient } from "@/lib/http/client";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "@/modules/auth/schemas/auth-schema";
import type {
  AuthResponse,
  FetchedPublicModule,
  MessageResponse,
} from "@/modules/auth/types";

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>("/auth/login", {
      username: input.username,
      password: input.password,
    });
    return data;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>(
      "/auth/register",
      input,
    );
    return data;
  },

  async fetchModules(): Promise<FetchedPublicModule[]> {
    const { data } =
      await httpClient.get<FetchedPublicModule[]>("/modules/public");
    return data;
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<MessageResponse> {
    const { data } = await httpClient.post<MessageResponse>(
      "/auth/forgot-password",
      input,
    );
    return data;
  },
};
