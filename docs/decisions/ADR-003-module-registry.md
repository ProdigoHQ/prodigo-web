# ADR-003: Module Registry

**Status:** Accepted  
**Date:** 2026-10-26  
**Deciders:** Development Team  
**Tags:** modules, registry, plugins, extensibility

## Context

We need a central way to:
- Register business modules with their metadata
- Build navigation dynamically
- Gate routes based on subscriptions and permissions
- Support future plugin loading
- Know module dependencies
- Provide widgets for dashboard

## Decision

We will implement a **ModuleRegistry** singleton that:
- Stores module manifests in a Map
- Provides methods to filter by enabled modules and permissions
- Builds navigation, routes, and widgets
- Supports registration at app bootstrap
- Will be extended for plugin loading later

## Implementation

```typescript
// core/registry/module-registry.ts
class ModuleRegistry {
  private manifests = new Map<string, ModuleManifest>();

  register(manifest: ModuleManifest): void {
    this.manifests.set(manifest.key, manifest);
  }

  get(key: string): ModuleManifest | undefined {
    return this.manifests.get(key);
  }

  getAll(): ModuleManifest[] {
    return Array.from(this.manifests.values());
  }

  getEnabledFor(enabledModuleKeys: string[], userPermissions: string[]): ModuleManifest[] {
    return this.getAll().filter((m) => {
      if (!enabledModuleKeys.includes(m.key)) return false;
      if (!m.requiredPermissions?.length) return true;
      return m.requiredPermissions.some((p) => userPermissions.includes(p));
    });
  }

  getNav(enabledModuleKeys: string[], userPermissions: string[]) { ... }
  getRoutes(enabledModuleKeys: string[], userPermissions: string[]) { ... }
}

export const moduleRegistry = new ModuleRegistry();
```

## Module Manifest Structure

Each module exports a manifest:
```typescript
export interface ModuleManifest {
  key: ModuleKey;
  name: string;
  description?: string;
  version: string;
  icon?: ComponentType;
  requiredPermissions?: string[];
  navItems: ModuleNavItem[];
  routes: ModuleRoute[];
  widgets?: Widget[];
  dependencies?: ModuleKey[];
  enabledByDefault?: boolean;
}
```

## Consequences

### Positive
- **Centralized** - Single source of truth for modules
- **Decoupled** - Modules self-declare, registry collects
- **Dynamic** - Can filter based on runtime state
- **Extensible** - Easy to add plugin loading
- **Type-safe** - Strong TypeScript types
- **Testable** - Can mock registry in tests
- **Performance** - Simple in-memory Map

### Negative
- **Global singleton** - Need to be careful with state
- **Bootstrap order** - Must register before use
- **Hard to code-split initially** - All manifests imported at bootstrap
- **Memory** - All manifests loaded upfront

### Mitigations
- **Register in ModuleProvider** - Clear bootstrap point
- **Use dynamic imports later** - For plugins/code-splitting
- **Keep manifests lightweight** - Just metadata and references
- **Tree-shaking friendly** - ES modules

## Alternatives Considered

### Alternative 1: File-based routing discovery
- **Pros:** Automatic
- **Cons:** Hard to attach metadata (permissions, nav), doesn't work well with Next.js App Router structure
- **Rejected:** Not flexible enough

### Alternative 2: API-driven registry
- **Pros:** Backend controls everything
- **Cons:** Extra request, slower, less flexible for frontend-only concerns
- **Rejected:** Mix of concerns, /me already provides enabled modules

### Alternative 3: Hardcoded in layout
- **Pros:** Simple
- **Cons:** Not scalable, duplicates logic
- **Rejected:** Doesn't support plugins

## Future Enhancements

1. **Plugin loading** - Load manifests from plugins/ or remote
2. **Lazy registration** - Register on demand
3. **Module Federation** - Remote modules
4. **Dependency resolution** - Validate dependencies
5. **Feature flags** - Per-module flags

## References
- [05 - Module System](../architecture/05-module-system.md)
- [07 - Plugins & Integrations](../architecture/07-plugins-integrations.md)
- [ADR-001 - Frontend Modular Structure](./ADR-001-frontend-modular-structure.md)
- [ADR-002 - Permission-Driven Navigation](./ADR-002-permission-driven-navigation.md)
