# ADR-001: Frontend Modular Structure (Kernel + Modules)

**Status:** Accepted  
**Date:** 2026-10-26  
**Deciders:** Development Team  
**Tags:** architecture, modular-monolith, structure

## Context

The Prodigo ERP frontend is growing with multiple business modules (CRM, Inventory, Sales, Invoicing, POS, HR, etc.). The current `src/features/` structure is good but needs to evolve to:
- Better mirror the backend's modular monolith architecture
- Support permission-based and subscription-based access control
- Prepare for future plugins and `prodigo-os`
- Maintain clear boundaries as the codebase scales
- Support extensibility for external integrations

## Decision

We will adopt a **Kernel + Modules** architecture:

```text
src/
├── core/      # Kernel - Infrastructure (auth, rbac, guards, registry, tenant, theme, http)
├── modules/   # Business Modules - Domain features mirroring backend
├── shared/    # Shared UI/logic across modules
├── plugins/   # Future external modules
└── app/       # Routing shell only
```

### Key Principles

1. **Core is the framework** - Provides cross-cutting concerns, no dependencies on modules
2. **Modules are self-contained** - Each business domain in its own module
3. **App router is thin** - Only routing, layout, guards
4. **Shared for common UI** - Components used by >=2 modules
5. **Mirror backend structure** - Module keys match `prodigo-api` modules

## Consequences

### Positive
- **Clear separation** - Easy to understand boundaries
- **Scalable** - Add modules without affecting existing code
- **Testable** - Modules can be tested in isolation
- **Aligned with backend** - Consistent mental model across repos
- **Plugin-ready** - Same structure for future extensions
- **Better for teams** - Multiple developers can work on different modules
- **Prepares for micro-frontends** - Easier to extract later if needed

### Negative
- **More folders/files** - Initial overhead
- **Learning curve** - Team needs to understand new structure
- **Migration effort** - Need to gradually move from `features/`
- **Risk of over-engineering** - Need discipline to not over-abstract

### Mitigations
- **Gradual migration** - Move module by module, keep backward compat
- **Hexagonal-lite** - Don't force full hexagonal on simple CRUD
- **Clear documentation** - This ADR and folder conventions
- **Lint rules** - Consider `eslint-plugin-boundaries` later
- **Pilot first** - Test with Inventory module

## Alternatives Considered

### Alternative 1: Keep features/ structure
- **Pros:** Familiar, less change
- **Cons:** Doesn't scale well, doesn't align with backend, harder to add module system
- **Rejected:** Not future-proof enough

### Alternative 2: Micro-frontends from start
- **Pros:** Ultimate isolation
- **Cons:** Over-complex for current needs, harder to share auth/tenant/theme
- **Rejected:** Premature optimization

### Alternative 3: Flat structure
- **Pros:** Simple
- **Cons:** Becomes unmaintainable quickly
- **Rejected:** Doesn't scale

## Implementation Plan

1. Create new folders alongside existing
2. Move core infrastructure (http, auth) to `core/`
3. Build ModuleRegistry in `core/registry/`
4. Pilot with Inventory module in `modules/inventory/`
5. Migrate other modules gradually
6. Update app router to use thin pages
7. Deprecate old structure over time

## References
- [01 - Modular Monolith](../architecture/01-modular-monolith.md)
- [09 - Folder Conventions](../architecture/09-folder-conventions.md)
- Backend: Modular Monolith architecture
