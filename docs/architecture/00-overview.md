# 00 - Overview

## Vision

Prodigo is a modern multi-tenant cloud ERP designed for businesses, with initial focus on Cameroonian and West African markets. The goal is to build a premium enterprise SaaS product that feels as polished as Stripe, Linear, Vercel, and Notion.

## Ecosystem

Prodigo is split across three independent repositories:

```text
                         PRODIGO ECOSYSTEM
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
       prodigo-api         prodigo-web        prodigo-os
       Backend/API         ERP Responsive      Desktop OS
             │                  │                  │
             │                  └────────┬─────────┘
             │                           │
             └────────── REST/API ───────┘
                         OpenAPI
```

| Repository | Role | Description |
|------------|------|-------------|
| **prodigo-api** | Source of Truth | Spring Boot Modular Monolith with Hexagonal Architecture. Handles business logic, authentication, authorization, multi-tenancy, RBAC, modules, subscriptions, and all ERP functionality. |
| **prodigo-web** | Universal ERP | Responsive Next.js frontend for desktop, tablet, and mobile. Provides the standard web-based ERP experience with sidebar navigation. |
| **prodigo-os** | Desktop Environment | Desktop OS-like experience with window manager, taskbar, app launcher, and ERP apps as windows. Shares the same API. |

**Key Principle:** All three frontends are independent clients of the same API. The API contract (OpenAPI) is the single source of truth for communication.

## Core Concepts

### Multi-Tenancy
- Each company (tenant) has completely isolated data
- Shared database schema with tenant-scoped filtering
- Tenant context propagated through every request
- Users belong to a specific tenant/workspace

### Role-Based Access Control (RBAC)
- Users assigned roles, roles have permissions
- Two permission types:
  - **Platform permissions:** `ERP.<RESOURCE>.<ACTION>` for super admin
  - **Module permissions:** `<module>.<resource>.<action>` for tenant operations
- Permissions enforced at route, menu, and action levels

### Module Subscriptions
- Tenants subscribe to specific ERP modules (CRM, Inventory, Sales, etc.)
- Features only accessible if module is enabled and subscribed
- Dependencies between modules enforced (e.g., Invoicing requires Sales/Stock)
- Module gating prevents access to unlicensed functionality

### White-Labeling
- Per-tenant theme customization (colors, logo)
- Applied dynamically via CSS variables
- Branding consistent across the platform

## Technology Stack (prodigo-web)

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | App Router, `src/` directory |
| **React 19** | UI framework |
| **TypeScript (strict)** | Type safety |
| **Tailwind CSS v4** | Styling + `tw-animate-css` |
| **@base-ui/react + shadcn/ui** | Component primitives |
| **lucide-react** | Icons |
| **zod** | Validation |
| **@tanstack/react-query** | Server state management |
| **zustand** | Client state (auth, tenant) with persistence |
| **axios** | HTTP client |

## Goals

1. **Mirror Backend Architecture** - Follow Modular Monolith principles, keep structure aligned with `prodigo-api` modules
2. **Permission-First** - Every UI element respects RBAC and module subscriptions
3. **Extensible** - Prepare for plugins, integrations, and future `prodigo-os`
4. **Maintainable** - Clear boundaries, easy to scale as modules grow
5. **Premium UX** - Professional, clean, responsive across all devices
6. **API-Driven** - No Next.js API routes, all data from Spring Boot backend

## Related Documentation

- [01 - Modular Monolith](./01-modular-monolith.md)
- [04 - RBAC & Permissions](./04-rbac.md)
- [05 - Module System](./05-module-system.md)
- [08 - API Contract](./08-api-contract.md)
