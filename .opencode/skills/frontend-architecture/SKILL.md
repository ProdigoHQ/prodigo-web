---
name: frontend-architecture
description: Maintain the Prodigo frontend architecture — kernel + modules structure (mirroring prodigo-api), component reuse, TypeScript patterns, API integration, module/permission system, and state management. Use when adding new features/modules, integrating API calls, deciding where code belongs, or refactoring the codebase.
metadata:
  product: Prodigo ERP
  category: architecture
---

# Frontend Architecture

Prioritize maintainability. Follow the folder structure and conventions documented in `AGENTS.md` and `docs/architecture/` — they are authoritative. The target architecture is **Kernel + Modules** (Modular Monolith) with **Hexagonal-lite** principles.

## Core Principles

Prefer:

- **Kernel + Modules**: `src/core/` (infrastructure), `src/modules/` (business), `src/shared/` (cross-module UI), `src/plugins/` (future)
- Reusable components (`src/components/ui/`, `src/components/shared/`)
- Strong TypeScript with explicit types (no `any` unless unavoidable)
- Small components with a single responsibility
- Typed API boundaries
- Permission-first and subscription-aware design
- Mirror backend module structure (`moduleKey` matches `prodigo-api`)

Avoid:

- Giant monolithic components
- Duplicate UI when an existing component can be reused
- Business logic inside presentational components
- `any` unless unavoidable
- Hardcoded API responses / mock data in components
- Direct cross-module imports (use facades/public API via `index.ts`)

## Target Structure

```text
src/
├── app/           # Routing shell ONLY (route groups like (auth), (app))
├── core/          # Kernel: auth, rbac, guards, registry, tenant, theme, http, config
├── modules/       # Business modules mirroring prodigo-api (crm, inventory, sales, ...)
├── shared/        # Shared UI/components/hooks used by >=2 modules
├── plugins/       # Future external plugins
├── components/ui/ # shadcn/ui primitives (DO NOT restructure)
└── providers/     # App providers
```

See `docs/architecture/01-modular-monolith.md`, `docs/architecture/09-folder-conventions.md` for full details.

## Routing

- `src/app/` contains routing only (route groups like `(auth)`, `(app)`).
- Pages are thin and delegate to module components (`modules/<module>/adapters/in/ui/`).
- Never create `src/app/api/` route handlers — the backend is Spring Boot.
- Protect routes with guards from `core/guards/` (`AuthGuard`, `TenantGuard`, `ModuleGuard`, `PermissionGuard`).

## Module System

- Each business module has a `manifest.ts` implementing `ModuleManifest` (see `core/registry/module-manifest.ts`)
- Modules register with `moduleRegistry` at bootstrap
- Navigation is built dynamically via `moduleRegistry.getNav()` filtered by `enabledModules` + permissions
- Module access requires subscription (`enabledModules`) AND permissions
- Dependencies between modules are declared in manifests

See `docs/architecture/05-module-system.md`.

## RBAC & Permissions

- Permission naming: `ERP.<RESOURCE>.<ACTION>` for platform, `<module>.<resource>.<action>` for modules
- Use `usePermissions()` from `core/rbac/` to check permissions
- Apply guards at route level and `PermissionGuard` at component/action level
- Backend is always the source of truth for authorization
- Never rely solely on hiding UI

See `docs/architecture/04-rbac.md`.

## API layer

- All requests go through the shared axios client `core/http/client.ts` (base URL from `core/config/env.ts`, attaches Bearer token, normalizes errors to `ApiError`)
- Module API calls live in `modules/<module>/adapters/out/api/` or `modules/<module>/api/`
- API functions only forward typed payloads; validate with zod schemas at the form boundary
- Response entities / DTOs live in module's `types.ts` or `domain/`
- Follow API conventions in `docs/architecture/08-api-contract.md`

## Server state

- Use `@tanstack/react-query` for server state. Hooks live in `modules/<module>/hooks/` or feature hooks.
- Queries use stable `queryKey` arrays; mutations exposed as `useXxxMutation()`

## Client state

- Use zustand stores (with `persist`) only for genuinely global client state — e.g. auth session (`core/auth/store/auth-store.ts`), tenant (`core/tenant/store/tenant-store.ts`)
- Do not put server state or transient UI state into a global store

## Forms & validation

- zod schemas live in `modules/<module>/schemas/` or feature schemas
- Map API validation errors (`ApiError.fieldErrors`) to form fields
- Keep form logic in module components, not in pages

## Hexagonal-lite

- **Simple CRUD**: `adapters/in/ui/`, `adapters/out/api/`, `hooks/` is often enough
- **Complex business logic / external integrations**: Use ports/adapters (`application/ports/`, `adapters/out/external/`, `domain/`)
- Keep domain pure (no React/Next imports)
- See `docs/architecture/02-hexagonal-frontend.md`, `ADR-004`

## Multi-tenancy & Theming

- Hydrate from `GET /me` (user, tenant, roles, permissions, enabledModules, theme)
- Use `TenantGuard` and display tenant context in UI
- Apply white-label theme via `ThemeProvider` using CSS variables
- Never leak data between tenants

See `docs/architecture/03-multi-tenant.md`, `docs/architecture/06-white-labeling.md`

## Reusability

Before creating a component: search `src/components/ui/`, `src/components/shared/`, `src/shared/`, and existing modules. If equivalent exists, reuse or extend. Do not create duplicates. Follow the design system.
