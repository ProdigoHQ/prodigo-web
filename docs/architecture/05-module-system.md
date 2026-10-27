# 05 - Module System

## Overview

The module system is the heart of Prodigo's extensibility. Tenants subscribe to modules, and access is controlled by both subscription status and permissions. The frontend uses a ModuleRegistry to dynamically build navigation and gate routes.

## Module Concepts

### ModuleKey
Unique identifier matching backend module keys:
- `auth`, `company`, `crm`, `inventory`, `sales`, `invoicing`, `payments`, `pos`, `hr`, `ecommerce`, `projects`, `reporting`, `notification`

### Module Subscription
- Tenants can subscribe/unsubscribe to modules
- Some modules have dependencies (e.g., `invoicing` requires `sales` and `inventory`)
- Subscriptions can have expiry dates
- Unsubscribing may block if other modules depend on it
- Data is preserved on unsubscribe (soft-disable)

### Module Manifest
Each module declares its capabilities via a manifest - see below.

## Module Manifest

```typescript
// core/registry/module-manifest.ts
export type ModuleKey = 
  | 'auth' | 'company' | 'crm' | 'inventory' | 'sales' 
  | 'invoicing' | 'payments' | 'pos' | 'hr' 
  | 'ecommerce' | 'projects' | 'reporting' | 'notification';

export interface ModuleNavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  permissions?: string[];      // Required permissions to see item
  order?: number;
  children?: ModuleNavItem[];
  badge?: () => React.ReactNode;
}

export interface ModuleRoute {
  path: string;
  component: React.ComponentType<any>;
  permissions?: string[];
  exact?: boolean;
}

export interface ModuleManifest {
  key: ModuleKey;
  name: string;
  description?: string;
  version: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiredPermissions?: string[]; // Minimum to access module
  navItems: ModuleNavItem[];       // Sidebar navigation
  routes: ModuleRoute[];           // Module routes
  widgets?: Array<{ id: string; component: React.ComponentType<any> }>;
  dependencies?: ModuleKey[];      // Module dependencies
  enabledByDefault?: boolean;
}
```

## Module Registry

Central registry that collects all manifests and filters based on tenant state.

```typescript
// core/registry/module-registry.ts
class ModuleRegistry {
  private manifests = new Map<string, ModuleManifest>();

  register(manifest: ModuleManifest): void {
    this.manifests.set(manifest.key, manifest);
  }

  getAll(): ModuleManifest[] {
    return Array.from(this.manifests.values());
  }

  get(key: string): ModuleManifest | undefined {
    return this.manifests.get(key);
  }

  getEnabledFor(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): ModuleManifest[] {
    return this.getAll().filter((m) => {
      // Check if module is subscribed/enabled
      if (!enabledModuleKeys.includes(m.key)) return false;
      
      // Check if user has required permissions
      if (!m.requiredPermissions?.length) return true;
      return m.requiredPermissions.some((p) => userPermissions.includes(p));
    });
  }

  getNav(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): Array<ModuleNavItem & { moduleKey: string }> {
    const modules = this.getEnabledFor(enabledModuleKeys, userPermissions);
    return modules
      .flatMap((m) => 
        m.navItems.map((n) => ({ ...n, moduleKey: m.key }))
      )
      .filter((n) => 
        !n.permissions?.length || n.permissions.some((p) => userPermissions.includes(p))
      )
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  getRoutes(
    enabledModuleKeys: string[],
    userPermissions: string[]
  ): ModuleRoute[] {
    const modules = this.getEnabledFor(enabledModuleKeys, userPermissions);
    return modules.flatMap((m) => m.routes);
  }
}

export const moduleRegistry = new ModuleRegistry();
```

## Module Example

```typescript
// modules/crm/manifest.ts
import { Users } from 'lucide-react';
import { ModuleManifest } from '@/core/registry/module-manifest';

export const crmManifest: ModuleManifest = {
  key: 'crm',
  name: 'CRM',
  description: 'Gérer les clients, prospects et pipeline',
  version: '1.0.0',
  icon: Users,
  dependencies: ['company'],
  requiredPermissions: ['crm.customer.read'],
  navItems: [
    {
      id: 'crm-dashboard',
      label: 'Tableau de bord',
      href: '/crm',
      permissions: ['crm.customer.read'],
      order: 1,
    },
    {
      id: 'crm-customers',
      label: 'Clients',
      href: '/crm/customers',
      permissions: ['crm.customer.read'],
      order: 10,
    },
    {
      id: 'crm-leads',
      label: 'Prospects',
      href: '/crm/leads',
      permissions: ['crm.lead.read'],
      order: 20,
    },
  ],
  routes: [
    { path: '/crm', component: CrmDashboard },
    { path: '/crm/customers', component: CustomerList, permissions: ['crm.customer.read'] },
    { path: '/crm/customers/:id', component: CustomerDetail, permissions: ['crm.customer.read'] },
  ],
};
```

## Bootstrap & Registration

```typescript
// providers/module-provider.tsx
import { crmManifest } from '@/modules/crm/manifest';
import { inventoryManifest } from '@/modules/inventory/manifest';
import { salesManifest } from '@/modules/sales/manifest';
import { invoicingManifest } from '@/modules/invoicing/manifest';
import { moduleRegistry } from '@/core/registry/module-registry';

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register all modules
    moduleRegistry.register(crmManifest);
    moduleRegistry.register(inventoryManifest);
    moduleRegistry.register(salesManifest);
    moduleRegistry.register(invoicingManifest);
    // ... other modules
  }, []);

  return <>{children}</>;
}
```

## Navigation Building

```tsx
// shared/layouts/app-sidebar.tsx
import { usePermissions } from '@/core/rbac/use-permissions';
import { moduleRegistry } from '@/core/registry/module-registry';

export function AppSidebar() {
  const { enabledModules, permissions } = usePermissions();
  const navItems = moduleRegistry.getNav(enabledModules, permissions);

  return (
    <Sidebar>
      {navItems.map((item) => (
        <SidebarItem
          key={item.id}
          href={item.href}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </Sidebar>
  );
}
```

## Module Gate

Routes must be protected by `ModuleGuard`:

```tsx
// app/(app)/invoicing/layout.tsx
import { ModuleGuard } from '@/core/guards/module-guard';

export default function InvoicingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleGuard moduleKey="invoicing" requiredPermissions={['invoicing.invoice.read']}>
      {children}
    </ModuleGuard>
  );
}
```

## API Endpoints (Backend)

The frontend consumes these endpoints for module management:

| Endpoint | Purpose |
|----------|---------|
| `GET /tenant/modules` | Get enabled modules for tenant |
| `GET /tenant/modules/available` | Get available modules to subscribe |
| `GET /tenant/modules/{moduleKey}` | Get module details |
| `POST /tenant/modules/{moduleKey}/subscribe` | Subscribe to module(s) |
| `POST /tenant/modules/{moduleKey}/unsubscribe` | Unsubscribe from module |
| `GET /tenant/subscriptions/history` | Subscription history |
| `GET /tenant/entitlements` | Tenant limits and entitlements |

## Flow

```text
1. User authenticates
   ↓
2. GET /me returns enabledModules[]
   ↓
3. ModuleProvider registers all manifests
   ↓
4. Guards check if module in enabledModules
   ↓
5. Sidebar shows only enabled + permitted modules
   ↓
6. Routes protected by ModuleGuard
   ↓
7. If disabled → ModuleNotSubscribed view with link to subscription
```

## Best Practices

1. **Mirror backend module keys** - Keep consistent
2. **Declare dependencies** - Helps with UX and validation
3. **Check permissions in manifest** - Filter nav items and routes
4. **Soft-disable only** - Never delete data on unsubscribe
5. **Show upgrade prompts** - Guide users to subscribe to modules
6. **Cache module state** - From `/me` response
7. **Test module gating** - Ensure unsubscribed modules are not accessible

## Related Documentation

- [01 - Modular Monolith](./01-modular-monolith.md)
- [04 - RBAC & Permissions](./04-rbac.md)
- [07 - Plugins & Integrations](./07-plugins-integrations.md)
- [ADR-003 - Module Registry](../decisions/ADR-003-module-registry.md)
