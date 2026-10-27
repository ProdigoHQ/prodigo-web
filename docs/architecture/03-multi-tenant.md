# 03 - Multi-Tenancy

## Overview

Prodigo is multi-tenant SaaS where each company (tenant) has completely isolated data. The frontend must respect tenant boundaries and always display the correct workspace context.

## Tenant Model

```text
Entreprise A                    Entreprise B
    │                              │
    ├── Users                      ├── Users
    ├── Products                   ├── Products
    ├── Customers                  └── Customers
    └── Invoices
```

Each tenant has:
- **Isolated data** - Users, products, customers, invoices never shared
- **Own settings** - Theme, modules, roles, permissions
- **Subscriptions** - Module subscriptions per tenant
- **Users** - Can belong to one tenant (or managed separately)

## Frontend Responsibilities

| Responsibility | Implementation | Notes |
|----------------|----------------|-------|
| **Tenant Context** | `core/tenant/` | Store current tenant info from `/me` response |
| **Workspace Display** | App header/sidebar | Always show current tenant/company name |
| **Tenant-Aware Requests** | `core/http/client.ts` | Backend handles isolation, but we must send correct auth |
| **Route Protection** | `TenantGuard` | Ensure user belongs to valid tenant, tenant not suspended |
| **Theme Application** | `core/theme/` | Apply tenant's white-label theme |
| **No Cross-Tenant Leaks** | Throughout app | Never cache data across tenant switches |

## Data Flow

```text
1. User logs in
   ↓
2. GET /me returns user + tenant + roles + permissions + enabledModules + theme
   ↓
3. Hydrate core/auth, core/tenant, core/rbac stores
   ↓
4. Apply theme via ThemeProvider
   ↓
5. All subsequent API calls go through authenticated client
   ↓
6. Backend enforces tenant isolation via TenantContext + RLS
```

## Implementation

### Tenant Store

```typescript
// core/tenant/store/tenant-store.ts
interface TenantState {
  tenant: Tenant | null;
  theme: TenantTheme | null;
  setTenant: (tenant: Tenant) => void;
  setTheme: (theme: TenantTheme) => void;
  clear: () => void;
}
```

### TenantGuard

```typescript
// core/guards/tenant-guard.tsx
export function TenantGuard({ children }: { children: React.ReactNode }) {
  const { tenant } = useTenantStore();
  const { user } = useAuthStore();
  
  if (!tenant) return <LoadingState />;
  if (tenant.status === 'SUSPENDED' || tenant.status === 'INACTIVE') {
    return <TenantBlockedView status={tenant.status} />;
  }
  if (!user) return null;
  
  return <>{children}</>;
}
```

### Tenant in UI

Always display workspace context:

```tsx
// shared/layouts/app-header.tsx
const { tenant } = useTenantStore();
<span>{tenant?.name || tenant?.companyName}</span>
```

## Security Notes

- **Backend is source of truth** - Frontend never enforces tenant isolation, backend does via `TenantContext`, Hibernate filters, and RLS
- **Never trust client** - Don't filter by tenantId on frontend, let API handle it
- **Session scoping** - Auth token is scoped to tenant
- **401 on invalid tenant** - Backend will reject if tenant access invalid
- **Logout on tenant changes** - If tenant becomes inactive/suspended, force logout

## Best Practices

1. **Fetch /me on app load** - Get complete tenant context
2. **Show tenant name prominently** - Users must always know which workspace
3. **Clear cache on tenant switch** - If multi-tenant switcher exists, invalidate all queries
4. **Handle tenant errors gracefully** - Show clear messages for suspended/inactive
5. **Don't hardcode tenant data** - Everything comes from API/context

## Related Documentation

- [04 - RBAC & Permissions](./04-rbac.md)
- [06 - White-Labeling](./06-white-labeling.md)
- [08 - API Contract](./08-api-contract.md)
