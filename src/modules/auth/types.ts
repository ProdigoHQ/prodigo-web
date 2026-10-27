export interface AuthResponse {
  userId: number;
  tenantSlug: string | null;
  accessToken: string;
  roles: string[];
  permissions: string[];
}

export interface SelectedModule {
  moduleId: string;
  moduleName: string;
  moduleKey: string;
}

export interface FetchedPublicModule {
  id: string;
  name: string;
  description: string;
  moduleKey: string;
  price: number;
  currency: string;
}
export interface MessageResponse {
  message: string;
}
