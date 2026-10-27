# 01 - Modular Monolith (Frontend)

## Why Modular Monolith?

As the ERP grows with modules like CRM, Inventory, Sales, Invoicing, POS, HR, E-commerce, etc., we need an architecture that:
- **Scales without chaos** - Clear boundaries prevent cross-module spaghetti
- **Mirrors the backend** - `prodigo-api` uses Modular Monolith + Hexagonal, so frontend should align
- **Enables parallel development** - Teams can work on modules independently
- **Prepares for extraction** - If needed later, modules can be split into micro-frontends
- **Supports plugins** - Future marketplace needs isolated, loadable modules

## Core Concepts

### Kernel vs Modules

```text
src/
├── core/      # KERNEL - Framework of the app (shared infrastructure)
├── modules/   # BUSINESS MODULES - Feature capabilities
├── shared/    # SHARED KERNEL UI - Cross-module reusable components
└── plugins/   # PLUGINS - Future external modules
```

| Layer | Responsibility | Can Import |
|-------|---------------|------------|
| **core/** | Auth, tenancy, RBAC, guards, registry, theme, HTTP client, config | Nothing from `modules/` or `plugins/` |
| **shared/** | Generic UI components, hooks, layouts used by >=2 modules | Can import from `core/` and `ui/` |
| **modules/** | Business logic, UI, API calls for a specific domain | Can import from `core/`, `shared/`, `ui/` |
| **plugins/** | Third-party/extensible modules | Can import from `core/`, `shared/`, `ui/` (restricted) |
| **app/** | Next.js routing shell ONLY | Can import from anywhere to compose |

### Module Independence

Each module in `modules/<moduleKey>/` should be:
- **Self-contained** - Has its own UI, API adapters, hooks, schemas, types
- **Loosely coupled** - Communicates through core services or facades, not direct imports from other modules' internals
- **Permission-aware** - Declares required permissions in manifest
- **Subscription-aware** - Only accessible if tenant subscribed

## Module Structure

Every business module follows this structure:

```text
modules/<moduleKey>/
├── adapters/
│   ├── in/ui/           # Driver adapters - Pages, forms, tables, components
│   └── out/api/         # Driven adapters - API calls to backend
├── application/
│   ├── ports/in/        # Driver ports - Use case contracts
│   └── ports/out/       # Driven ports - Repository/provider contracts
├── domain/              # Entities, value objects, policies, enums (pure TS)
├── hooks/               # React Query hooks wrapping adapters/ports
├── schemas/             # Zod validation schemas
├── manifest.ts          # ModuleManifest for registry
├── routes.tsx           # Route definitions (optional)
└── index.ts             # Public API of module
```

## Rules

1. **No cross-module deep imports** - Don't import `modules/crm/adapters/in/ui/CustomerForm` from `modules/sales/`. Use facades or shared components.
2. **App router is thin** - `src/app/` only does layout, guards, and delegates to module components
3. **Business logic in domain/application** - Keep UI components presentational where possible
4. **Mirror API modules** - `moduleKey` should match backend module keys (`crm`, `inventory`, `sales`, etc.)
5. **Public API via index.ts** - Modules export what others can consume through `index.ts`

## Benefits

- **Clarity** - Easy to find code by business domain
- **Testability** - Modules can be tested in isolation
- **Scalability** - Add modules without affecting others
- **Onboarding** - New developers understand structure quickly
- **Future-proof** - Ready for micro-frontends or plugin system

## Related Documentation

- [02 - Hexagonal Frontend](./02-hexagonal-frontend.md)
- [05 - Module System](./05-module-system.md)
- [09 - Folder Conventions](./09-folder-conventions.md)
- [ADR-001 - Frontend Modular Structure](../decisions/ADR-001-frontend-modular-structure.md)
