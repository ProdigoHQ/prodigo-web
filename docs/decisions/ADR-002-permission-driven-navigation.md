# ADR-002: Permission-Driven Navigation

**Status:** Accepted  
**Date:** 2026-10-26  
**Deciders:** Development Team  
**Tags:** rbac, navigation, permissions, ux

## Context

The sidebar navigation currently shows all modules. With RBAC and module subscriptions:
- Users should only see modules they have permission to access
- Users should only see modules their tenant is subscribed to
- Navigation must respect both `enabledModules[]` and `permissions[]`
- Different roles need different navigation views
- Platform admins need different navigation

## Decision

We will build navigation dynamically from the **ModuleRegistry**, filtered by:
1. **Module subscription** - Module must be in tenant's `enabledModules[]`
2. **Module permissions** - User must have `requiredPermissions` for the module (or any of them)
3. **Navigation item permissions** - Each nav item can have specific permissions

Navigation is computed as: `moduleRegistry.getNav(enabledModules, userPermissions)`

## Implementation

```typescript
// core/registry/module-registry.ts
getNav(
  enabledModuleKeys: string[],
  userPermissions: string[]
): Array<ModuleNavItem & { moduleKey: string }> {
  const modules = this.getEnabledFor(enabledModuleKeys, userPermissions);
  return modules
    .flatMap((m) => m.navItems.map((n) => ({ ...n, moduleKey: m.key })))
    .filter((n) => 
      !n.permissions?.length || n.permissions.some((p) => userPermissions.includes(p))
    )
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}
```

## Consequences

### Positive
- **Secure by default** - Can't see what you can't access
- **Clean UX** - No confusing disabled menu items
- **Dynamic** - Adapts to role and subscription changes
- **Maintainable** - Navigation defined in module manifests
- **Scalable** - Easy to add modules with their own nav
- **Consistent** - Same logic everywhere

### Negative
- **Empty sidebar possible** - User with no permissions sees nothing
- **Need to handle empty state** - Show message or redirect
- **Manifest discipline** - Must declare nav items correctly
- **More complex** - Can't just hardcode links

### Mitigations
- **Empty state UI** - Show helpful message
- **Dashboard always accessible** - If user has basic access
- **Test coverage** - Test different permission combinations
- **Fallback** - Ensure core routes always work

## Alternatives Considered

### Alternative 1: Hardcode navigation with guards
- **Pros:** Simple
- **Cons:** Duplicates logic, easy to forget, not scalable
- **Rejected:** Doesn't scale

### Alternative 2: Show all, disable items
- **Pros:** Shows what's available
- **Cons:** Confusing, suggests access exists, security through obscurity bad UX
- **Rejected:** Poor UX and misleading

### Alternative 3: Fetch navigation from API
- **Pros:** Backend controlled
- **Cons:** Extra API call, less flexible, harder to do client-side routing
- **Rejected:** Can derive from /me data we already have

## Validation

- User without CRM permission doesn't see CRM in sidebar
- User with CRM subscription but no permission doesn't see CRM
- User without CRM subscription doesn't see CRM
- Platform admin sees ERP admin menu (if implemented)
- Navigation updates when permissions change

## References
- [04 - RBAC & Permissions](../architecture/04-rbac.md)
- [05 - Module System](../architecture/05-module-system.md)
- [ADR-001 - Frontend Modular Structure](./ADR-001-frontend-modular-structure.md)
