# 04 - RBAC & Permissions

## Overview

Role-Based Access Control (RBAC) in Prodigo uses a flexible permission model where users are assigned roles, and roles contain permissions. Permissions control access to resources, actions, and modules.

## Permission Model

### Permission Naming Convention

| Type | Format | Example | Purpose |
|------|--------|---------|---------|
| **Platform/Super Admin** | `ERP.<RESOURCE>.<ACTION>` | `ERP.TENANT.READ`, `ERP.MODULE.UPDATE`, `ERP.SUBSCRIPTION.SUSPEND` | Platform-level operations across all tenants |
| **Module Level** | `<module>.<resource>.<action>` | `crm.customer.create`, `inventory.product.update`, `sales.order.read` | Tenant-scoped operations within modules |

### Standard Actions

Common actions across resources: `read`, `create`, `update`, `delete`, `export`, `approve`, etc.

### Examples

```text
crm.customer.read      # View customers
crm.customer.create    # Create customers
crm.customer.update    # Edit customers
crm.customer.delete    # Delete customers

inventory.product.read
inventory.stock.adjust
inventory.warehouse.manage

sales.order.approve
invoicing.invoice.void
```

## Permission Flow

```text
User
 │
 ├── Roles (e.g., Admin, Manager, Salesperson)
 │   │
 │   └── Permissions
 │
 └── Tenant Context
     │
     └── Enabled Modules
```

## Frontend Implementation

### Core RBAC (`src/core/rbac/`)

```text
core/rbac/
├── permission-map.ts      # Helpers to parse permissions
├── use-permissions.ts     # Hook to check permissions
└── types.ts               # Permission-related types
```

### Permission Helpers

```typescript
// permission-map.ts
export const isErpPermission = (p: string): boolean => p.startsWith('ERP.');
export const getModuleFromPermission = (p: string): string => 
  isErpPermission(p) ? 'platform' : p.split('.')[0];
export const getResourceFromPermission = (p: string): string => {
  const parts = p.split('.');
  return isErpPermission(p) ? parts[1] : parts[1];
};
export const getActionFromPermission = (p: string): string => {
  const parts = p.split('.');
  return parts[parts.length - 1];
};
```

### usePermissions Hook

```typescript
// use-permissions.ts
export function usePermissions() {
  const { user } = useAuthStore();
  const permissions = user?.permissions ?? [];
  const enabledModules = user?.enabledModules ?? [];
  const roles = user?.roles ?? [];

  const hasPermission = (perm: string | string[]): boolean => {
    if (Array.isArray(perm)) {
      return perm.some((p) => permissions.includes(p));
    }
    return permissions.includes(perm);
  };

  const hasAllPermissions = (perms: string[]): boolean => 
    perms.every((p) => permissions.includes(p));

  const hasAnyPermission = (perms: string[]): boolean => 
    perms.some((p) => permissions.includes(p));

  const hasModule = (moduleKey: string): boolean => 
    enabledModules.includes(moduleKey);

  const isPlatformAdmin = (): boolean => 
    permissions.some((p) => isErpPermission(p));

  return { 
    permissions, 
    enabledModules, 
    roles,
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission,
    hasModule,
    isPlatformAdmin
  };
}
```

## Guards

All guards live in `src/core/guards/`.

### AuthGuard
Ensures user is authenticated. Redirects to `/login` if not.

```typescript
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) {
    redirect('/login');
    return null;
  }
  
  return <>{children}</>;
}
```

### TenantGuard
Ensures valid tenant, checks tenant status.

```typescript
export function TenantGuard({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenantStore();
  
  if (!tenant) return <FullPageLoader />;
  if (tenant.status !== 'ACTIVE') {
    return <TenantBlockedView />;
  }
  
  return <>{children}</>;
}
```

### ModuleGuard
Ensures module is subscribed/enabled and user has required permissions.

```typescript
export function ModuleGuard({ 
  moduleKey, 
  requiredPermissions = [],
  children 
}: ModuleGuardProps) {
  const { hasModule, hasPermission } = usePermissions();
  
  if (!hasModule(moduleKey)) {
    return <ModuleNotSubscribed moduleKey={moduleKey} />;
  }
  
  if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return <ForbiddenView />;
  }
  
  return <>{children}</>;
}
```

### PermissionGuard
Component-level permission checking.

```typescript
export function PermissionGuard({ 
  permission, 
  fallback = null,
  children 
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
```

## Usage Examples

### Route Protection
```tsx
// app/(app)/crm/layout.tsx or in page
<ModuleGuard moduleKey="crm" requiredPermissions={['crm.customer.read']}>
  <CrmLayout>{children}</CrmLayout>
</ModuleGuard>
```

### Action Button
```tsx
<PermissionGuard permission="crm.customer.create">
  <Button onClick={handleCreate}>New Customer</Button>
</PermissionGuard>
```

### Conditional Rendering
```tsx
const { hasPermission } = usePermissions();

{hasPermission('crm.customer.delete') && (
  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
)}
```

### Navigation (Sidebar)
Navigation is built from ModuleRegistry filtered by permissions - see [05 - Module System](./05-module-system.md).

## Security Rules

1. **Never trust UI alone** - Backend must enforce all permissions. UI hiding is for UX only.
2. **Check at multiple levels** - Route guards, component guards, and action guards
3. **Filter ERP.* from tenant UI** - Platform permissions only visible to super admins
4. **Use exact permission strings** - Must match backend seed data exactly
5. **Handle 403 gracefully** - Show clear forbidden messages
6. **Test permission edges** - Missing permission, wrong role, inactive user

## System Roles

| Role | Purpose | Permissions |
|------|---------|-------------|
| **Owner** | Initial admin of tenant | All tenant permissions (cannot be deleted) |
| **Admin** | Tenant administrator | Most permissions except some system-level |
| **Member** | Regular user | Limited based on role assignment |
| **SuperAdmin** | Platform admin | Has `ERP.*` permissions across tenants |

## Related Documentation

- [03 - Multi-Tenancy](./03-multi-tenant.md)
- [05 - Module System](./05-module-system.md)
- [ADR-002 - Permission-Driven Navigation](../decisions/ADR-002-permission-driven-navigation.md)
