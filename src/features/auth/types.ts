export interface AuthResponse {
  userId: number;
  tenantSlug: string | null;
  accessToken: string;
  roles: string[];
  permissions: string[];
}

export interface SelectedModule {
  moduleId: number;
  moduleName: string;
  moduleKey: string;
}

export interface MessageResponse {
  message: string;
}
