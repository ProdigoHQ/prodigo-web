---
name: erp-ui
description: Build consistent Prodigo ERP application screens — dashboards, data tables, filters, search, pagination, drawers, modals, KPI cards, and business module CRUD. Use when working on the dashboard or any ERP module UI (customers, products, invoices, orders, inventory, crm, sales, ...).
metadata:
  product: Prodigo ERP
  category: erp
---

# Prodigo ERP Application UI

Always load and follow `prodigo-design-system`.

ERP screens prioritize: clarity, efficiency, data readability, consistency, accessibility, visual polish — in that order. Do not sacrifice usability for decoration.

## Standard Page Structure

Breadcrumb → page header → page description → primary actions → filters → KPI cards (where useful) → main content.

## Page Header

Heading + one-line description + actions aligned right. Example:

```
Produits                          [Importer] [Ajouter un produit]
"Gérez les produits et le stock de votre entreprise."
```

## KPI Cards

Use when metrics help users understand the page (total products, low stock, inventory value, overdue invoices, ...). White cards, 12px radius, subtle shadow, strong number, small label.

## Filters

Common filters: search, status, category, date range, warehouse, assigned user. Filter bars sit above the table. Prefer URL params for shareable filter state where practical.

## Tables

Consistent header, rows, actions, pagination, selection, empty/loading/error states. Rows 52–60px, header gray-50, hover gray-50, selected primary-light, actions right-aligned. Support sorting and pagination.

## Forms / CRUD

- Use drawers for quick create/edit.
- Use full pages for complex workflows.
- Use modals only for confirmations, small forms, and destructive actions.

## Business UX

Destructive actions (delete, cancel invoice, deactivate, remove user) always require confirmation. Loading, empty, and error states are mandatory — never a blank page or unhandled failure.

## Status

Use consistent semantic status badges (see design system). Never invent new colors for statuses.

## Data Formatting

Currency, dates, and numbers must be formatted consistently per the tenant's locale/currency — never hardcode presentation formatting across components. Extract formatters into shared helpers.

## Module-Aware UI

- **Respect subscriptions**: Only show UI for modules in tenant's `enabledModules`. Use `ModuleGuard` for routes.
- **Respect permissions**: Hide/show actions based on permissions via `PermissionGuard` or `usePermissions()`. Never rely solely on hiding.
- **Navigation**: Build from `moduleRegistry.getNav()` filtered by subscriptions + permissions.
- **Tenant context**: Always display current workspace/tenant name.

## Code Organization

- **Preferred (new code)**: Put business UI in `src/modules/<moduleKey>/adapters/in/ui/` with manifest, routes, hooks in the module
- **Legacy**: Feature code may still live under `src/features/<feature>/` during migration — follow existing patterns but prefer the kernel+modules structure for new modules
- Data comes from the Spring Boot API through `core/http/client.ts` — never hardcode responses
- Use shared components from `src/shared/components/` or `src/components/shared/` when used across modules
