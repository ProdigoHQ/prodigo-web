# 09 - Folder Conventions

## Overview

This document defines the folder structure, naming conventions, import rules, and best practices for `prodigo-web`.

## Target Structure

```text
src/
├── app/                    # Next.js App Router (ROUTING SHELL ONLY)
│   ├── (auth)/             # Auth routes
│   ├── (app)/              # Authenticated app routes
│   ├── layout.tsx
│   └── page.tsx
│
├── core/                   # KERNEL - Cross-cutting infrastructure
│   ├── auth/
│   ├── config/
│   ├── di/
│   ├── guards/
│   ├── http/
│   ├── rbac/
│   ├── registry/
│   ├── tenant/
│   ├── theme/
│   ├── utils/
│   └── notifications/
│
├── modules/                # BUSINESS MODULES - Mirror backend modules
│   └── <moduleKey>/
│       ├── adapters/
│       │   ├── in/ui/
│       │   └── out/api/
│       ├── application/
│       │   ├── ports/in/
│       │   └── ports/out/
│       ├── domain/
│       ├── hooks/
│       ├── schemas/
│       ├── manifest.ts
│       ├── routes.tsx
│       └── index.ts
│
├── shared/                 # SHARED KERNEL UI
│   ├── components/
│   ├── forms/
│   ├── hooks/
│   ├── layouts/
│   └── types/
│
├── plugins/                # FUTURE - External plugins
│   └── _template/
│
├── components/             # EXISTING - Keep for now (migrate gradually)
│   └── ui/                 # shadcn/ui primitives - DO NOT MOVE
│
├── providers/              # App providers
└── lib/                    # EXISTING - Migrate to core/ gradually
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Folders** | kebab-case | `user-profile/`, `payment-provider/` |
| **Components** | PascalCase | `CustomerList.tsx`, `InvoiceForm.tsx` |
| **Hooks** | camelCase with `use-` prefix | `use-customers.ts`, `use-permissions.ts` |
| **Utils/Helpers** | kebab-case or camelCase | `format-currency.ts`, `date-utils.ts` |
| **Types/Interfaces** | PascalCase | `Customer`, `InvoiceDto`, `ApiError` |
| **Constants** | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| **Stores (Zustand)** | kebab-case with `-store` | `auth-store.ts`, `tenant-store.ts` |
| **Manifests** | `manifest.ts` | `crm/manifest.ts` |
| **Schemas (Zod)** | kebab-case with `-schema` | `customer-schema.ts` |
| **API adapters** | kebab-case with `.api.ts` or `.adapter.ts` | `customer.api.ts` |

## File Organization Rules

### app/ - Routing Shell Only
- **Keep thin** - Max 50-100 lines per page
- **No business logic** - Delegate to module components
- **Use guards** - Protect routes at layout level
- **Compose** - Import from modules/shared

```tsx
// app/(app)/crm/customers/page.tsx
import { CustomerListPage } from '@/modules/crm/adapters/in/ui/customer-list-page';

export default function Page() {
  return <CustomerListPage />;
}
```

### core/ - Kernel
- **Framework-agnostic where possible** - Some parts will need React
- **No module imports** - Core cannot depend on modules
- **Singleton services** - Registry, http client
- **Shared infrastructure** - Auth, tenancy, RBAC, guards

### modules/ - Business Modules
- **Self-contained** - All module code here
- **Public API via index.ts** - Export only what's needed
- **Mirror API structure** - Use same moduleKey as backend
- **Hexagonal when needed** - Use ports/adapters for volatile parts

### shared/ - Cross-Module UI
- **Pure/presentational** - Generic components
- **Used by >=2 modules** - If used by only 1, put in module
- **No business logic** - Just UI patterns

### components/ui/ - Primitives
- **NEVER modify structure** - These are shadcn/ui
- **Only add via CLI** - Use `npx shadcn@latest add`
- **Single source of truth** - For base components

## Import Rules

### Path Aliases
```json
{
  "@/*": ["./src/*"],
  "@/core/*": ["./src/core/*"],
  "@/modules/*": ["./src/modules/*"],
  "@/shared/*": ["./src/shared/*"],
  "@/ui/*": ["./src/components/ui/*"]
}
```

### Import Guidelines

1. **Use absolute imports** - Prefer `@/modules/crm/...` over relative
2. **Import from public API** - Use `@/modules/crm` (via index.ts) when crossing boundaries
3. **Core imports first** - Group imports logically
4. **No deep cross-module imports** - Don't reach into `modules/sales/adapters/...` from `modules/crm/...`
5. **UI primitives from ui/** - Use `@/components/ui/button` or `@/ui/button`
6. **Shared components from shared/** - For cross-module UI

### Allowed Dependencies

```text
app/ → core, modules, shared, components/ui, providers
modules/ → core, shared, components/ui
shared/ → core, components/ui
core/ → components/ui (minimal), lib/utils
plugins/ → core, shared, components/ui (restricted)
```

### Forbidden

- ❌ `modules/A` importing from `modules/B` internals
- ❌ `core/` importing from `modules/`
- ❌ `shared/` importing from `modules/`
- ❌ Business logic in `app/`
- ❌ Direct axios/fetch outside `core/http/`

## Component Guidelines

### Component Structure
```tsx
'use client'; // Only if needed

import { ... } from '...';

interface ComponentNameProps {
  // Props
}

export function ComponentName({ ...props }: ComponentNameProps) {
  // Hooks
  // Logic
  // Render
  return <div>...</div>;
}
```

### Server vs Client Components
- **Default to Server Components** in App Router
- **Use 'use client'** only when needed: hooks, event handlers, browser APIs
- **Keep client components small** - Push to leaves

### Presentational vs Container
- **Presentational** - Pure UI, receives props, no data fetching
- **Container/Smart** - Fetches data, manages state, passes to presentational

Put containers in `adapters/in/ui/`, presentational can be co-located or in `components/`.

## State Management

| Type | Tool | Usage |
|------|------|-------|
| **Server State** | React Query | API data, caching, sync |
| **Client State (Global)** | Zustand | Auth, tenant, UI preferences |
| **Form State** | React Hook Form + Zod | Forms |
| **URL State** | Next.js searchParams | Filters, pagination, tabs |
| **Local State** | useState/useReducer | Component-specific |

## Code Style

- **TypeScript strict** - No `any` unless absolutely necessary
- **Functional components** - No class components
- **Named exports** - Prefer named over default exports (except pages)
- **Early returns** - For guards and conditions
- **Destructuring** - For props and objects
- **Const over let** - Use const by default

## Migration Strategy

### Phase 1: Create Structure
- [ ] Create `core/`, `modules/`, `shared/`, `plugins/` folders
- [ ] Set up path aliases in tsconfig
- [ ] Create base files

### Phase 2: Migrate Core
- [ ] Move `lib/http/` → `core/http/`
- [ ] Move auth store → `core/auth/`
- [ ] Create guards, rbac, registry
- [ ] Update imports

### Phase 3: Migrate Features to Modules
- [ ] Convert `features/auth/` (or keep in core)
- [ ] Convert `features/landing/` to shared or keep
- [ ] Create pilot module (Inventory)
- [ ] Gradually convert others

### Phase 4: Clean Up
- [ ] Remove old folders when empty
- [ ] Update all imports
- [ ] Run lint and build

## Best Practices

1. **Thin app router** - Pages just compose
2. **Colocate related code** - Keep module code together
3. **Reuse UI** - Check `components/ui/` and `shared/` first
4. **Type everything** - Props, API responses, etc.
5. **Follow module boundaries** - Respect import rules
6. **Document complex logic** - Add comments where needed
7. **Keep it simple** - Don't over-abstract prematurely
8. **Test critical paths** - Guards, permissions, module gates
9. **Consistent naming** - Follow conventions strictly
10. **Lint before commit** - Run `pnpm lint && pnpm build`

## Related Documentation

- [01 - Modular Monolith](./01-modular-monolith.md)
- [02 - Hexagonal Frontend](./02-hexagonal-frontend.md)
- [ADR-001 - Frontend Modular Structure](../decisions/ADR-001-frontend-modular-structure.md)
