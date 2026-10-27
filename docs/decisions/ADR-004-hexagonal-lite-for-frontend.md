# ADR-004: Hexagonal-Lite for Frontend

**Status:** Accepted  
**Date:** 2026-10-26  
**Deciders:** Development Team  
**Tags:** hexagonal, architecture, ports-adapters

## Context

Alistair Cockburn's Hexagonal Architecture provides excellent separation of concerns and testability. However, applying it fully to every CRUD component in a frontend can be:
- Over-engineering for simple cases
- Verbose with too many files/interfaces
- Slows down development
- Hard to learn for team members

We need a pragmatic approach that gives us benefits where they matter.

## Decision

We will use **Hexagonal-Lite** - apply full hexagonal pattern only where there's volatility or complexity:

### When to use FULL Hexagonal
- **External integrations** - Payment providers (MTN, Orange), PDF generation, file storage
- **Complex business rules** - Pricing calculations, tax calculations, stock movements
- **High volatility** - APIs that might change or have multiple implementations
- **Need for testability** - Critical business logic that needs unit tests in isolation

### When to use LITE (or skip)
- **Simple CRUD** - Basic list/create/edit/delete with minimal rules
- **Straight API calls** - Direct mapping to backend endpoints
- **Presentational components** - No business logic

## Structure

### Lite Structure (Most modules)
```text
modules/<module>/
├── adapters/in/ui/    # Pages/components
├── adapters/out/api/  # API calls
├── hooks/             # React Query hooks
├── schemas/           # Zod schemas
└── manifest.ts
```

### Full Structure (Complex modules)
```text
modules/<module>/
├── domain/            # Entities, value objects, services (pure)
├── application/
│   ├── ports/in/
│   └── ports/out/
├── adapters/in/ui/
├── adapters/out/api/
├── adapters/out/external/
├── hooks/
└── manifest.ts
```

## Example: Invoicing (Full)
- Domain: `Money`, `Invoice`, `TaxCalculator` (pure logic)
- Ports: `InvoiceRepository`, `PdfGeneratorPort`
- Adapters: API adapter, PDF library adapter
- Benefits: Can swap PDF library, test tax calculations

## Example: CRM Customers (Lite)
- Direct API calls, simple forms
- No complex domain rules
- Faster to develop

## Consequences

### Positive
- **Pragmatic** - Right tool for the job
- **Faster development** - Less boilerplate for simple cases
- **Easier to learn** - Not dogmatic
- **Still testable** - Complex parts are isolated
- **Flexible** - Can evolve to full hexagonal if needed

### Negative
- **Inconsistent** - Different patterns across modules
- **Decision fatigue** - Need to decide per case
- **Risk of mixing** - Need discipline
- **Harder to enforce** - Less prescriptive

### Mitigations
- **Clear guidelines** - This document defines when to use what
- **Code reviews** - Check if pattern fits
- **Start lite, refactor** - If complexity grows, refactor to full
- **Document in module** - Add comment if using full pattern

## Guidelines

Ask these questions:
1. Is there complex business logic? (calculations, rules, workflows)
2. Are there external dependencies that might be swapped? (payment, PDF, storage)
3. Is this critical and needs isolated unit tests?
4. Will this logic be reused elsewhere?

If yes to any → consider full hexagonal.

## References
- [02 - Hexagonal Frontend](../architecture/02-hexagonal-frontend.md)
- [07 - Plugins & Integrations](../architecture/07-plugins-integrations.md)
- [ADR-005 - External Adapters Pattern](./ADR-005-external-adapters-pattern.md)
- Alistair Cockburn - Hexagonal Architecture
