export interface Permission {
  id: string;
  code: string;
  description: string;
  action: string;
  resource: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: Permission[];
}
