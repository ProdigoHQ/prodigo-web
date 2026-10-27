# Refactor Log - Kernel + Modules Architecture Migration

Date: $(date -Iseconds)

## Summary
Migrated frontend towards the documented architecture: Kernel + Modules (Modular Monolith), with Module Registry, RBAC helpers, guards, and hexagonal-lite scaffolding. Maintained backward compatibility with existing `src/features/`, `src/components/`, `src/lib/`.

## Changes

### 1. New Structure Created
- `src/core/` - Kernel (auth, rbac, guards, registry, http, config, utils)
- `src/modules/` - Business modules (auth, company, crm, inventory, sales, invoicing, payments, pos, hr, ecommerce, projects, reporting, notification) with manifests
- `src/shared/` - Re-exports for cross-module shared components
- `src/plugins/_template/` - Plugin template scaffold
- `src/providers/module-provider.tsx` - Bootstraps module registry

### 2. Core Infrastructure
- `src/core/registry/module-manifest.ts` - ModuleManifest types
- `src/core/registry/module-registry.ts` - Central registry with filtering by permissions/modules
- `src/core/rbac/use-permissions.ts` - Permission/role helpers
- `src/core/guards/auth-guard.tsx`, `permission-guard.tsx`, `module-guard.tsx` - Route/component guards
- `src/core/http/client.ts` - Re-export/wrapper aligned with architecture
- `src/core/http/api-error.ts` - Re-export from lib/http
- `src/core/auth/store/auth-store.ts` - Re-export from features/auth
- `src/core/index.ts` - Kernel barrel export

### 3. Module Manifests (pilot)
- `src/modules/crm/manifest.ts`
- `src/modules/inventory/manifest.ts`
- `src/modules/sales/manifest.ts`
- `src/modules/invoicing/manifest.ts`

### 4. Integration
- Updated `src/app/layout.tsx` to wrap app with `ModuleProvider`

### 5. Shared Exports
- `src/shared/index.ts` re-exports existing shared components

## Architecture Alignment
- Follows `docs/architecture/01-modular-monolith.md`, `02-hexagonal-frontend.md`, `04-rbac.md`, `05-module-system.md`, `09-folder-conventions.md`
- ADRs in `docs/decisions/` guide implementation
- Permission naming: `ERP.*` (platform) and `<module>.<resource>.<action>` (module)
- App Router remains thin; business logic moves to modules over time
- No Next.js API routes created; all calls go through axios client to Spring Boot API

## Migration Notes
- Existing `src/features/` remains intact for backward compatibility
- `src/lib/http/` and `src/components/` unchanged
- New code should prefer `src/modules/` and `src/core/`
- Guards and registry ready for use; enhanced with `enabledModules` from `/me` when available

## Verification
- Structure created successfully
- No breaking changes to existing imports
- TypeScript paths unchanged (`@/*` -> `./src/*`)
