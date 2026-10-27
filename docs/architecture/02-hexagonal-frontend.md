# 02 - Hexagonal Frontend (Ports & Adapters)

## Overview

We borrow from Alistair Cockburn's Hexagonal Architecture to decouple our UI from external concerns. On the frontend, this keeps business logic pure and makes integrations (APIs, payment providers, PDF generation) swappable.

## Mapping

| Hexagonal Concept | Frontend Equivalent | Description |
|-------------------|---------------------|-------------|
| **The Hexagon** | `modules/<module>/domain/` + `modules/<module>/application/` | Core business logic. Pure TypeScript, no React/Next imports. Contains entities, value objects, policies, and use case interfaces. |
| **Driver Port (In)** | `modules/<module>/application/ports/in/` | Interface describing a use case the UI needs. Examples: `GetCustomerListUseCase`, `CreateInvoiceUseCase`. Often consumed via React Query hooks. |
| **Driven Port (Out)** | `modules/<module>/application/ports/out/` | Interface describing what the hexagon needs from outside. Examples: `CustomerRepository`, `PaymentProviderPort`, `PdfGeneratorPort`. |
| **Driver Adapter** | `modules/<module>/adapters/in/ui/` or route components | Things that drive the application - pages, forms, tables, drawers. They call hooks/use cases. |
| **Driven Adapter** | `modules/<module>/adapters/out/api/`, `adapters/out/external/` | Things the hexagon drives - API clients (axios), payment SDKs, PDF libraries, file uploads. They implement driven ports. |
| **Composition Root** | `src/core/di/`, `src/providers/`, module bootstrap | Wires adapters to ports. In React, this is often done via hooks and providers. |

## Example: Invoicing Module

```text
modules/invoicing/
├── domain/
│   ├── entities/
│   │   ├── Invoice.ts           # Pure entity with business rules
│   │   └── InvoiceLine.ts
│   ├── value-objects/
│   │   ├── Money.ts            # Money calculation with rounding
│   │   └── InvoiceNumber.ts
│   └── services/
│       └── TaxCalculator.ts    # Pure tax calculation logic
│
├── application/
│   ├── ports/
│   │   ├── in/
│   │   │   ├── GetInvoiceUseCase.ts
│   │   │   ├── CreateInvoiceUseCase.ts
│   │   │   └── GeneratePdfUseCase.ts
│   │   └── out/
│   │       ├── InvoiceRepository.ts  # Port to data source
│   │       └── PdfGeneratorPort.ts   # Port to PDF generation
│   └── services/
│       └── InvoiceService.ts         # Orchestrates use cases
│
├── adapters/
│   ├── in/ui/
│   │   ├── InvoiceListPage.tsx
│   │   ├── InvoiceForm.tsx
│   │   └── InvoicePreview.tsx
│   └── out/
│       ├── api/
│       │   └── invoice-api.adapter.ts  # Implements InvoiceRepository
│       └── external/
│           └── pdfmake.adapter.ts      # Implements PdfGeneratorPort
│
├── hooks/
│   ├── use-invoices.ts           # React Query wrapper
│   └── use-generate-pdf.ts
└── manifest.ts
```

## Flow Example

1. **User Action** - User clicks "Create Invoice" in `InvoiceForm.tsx` (Driver Adapter)
2. **Hook** - `useCreateInvoice()` called, validates with Zod schema
3. **Port Call** - Hook calls through use case contract or directly to adapter
4. **Adapter** - `invoice-api.adapter.ts` (Driven Adapter) makes HTTP call via `core/http/client.ts`
5. **Response** - Data comes back, mapped to domain entity
6. **Update UI** - React Query updates cache, UI re-renders

## When to Use Full Hexagonal vs Hexagonal-Lite

| Scenario | Approach | Notes |
|----------|----------|-------|
| **Simple CRUD** | Hexagonal-Lite | Just `adapters/in/ui/`, `adapters/out/api/`, `hooks/`. Skip ports if no volatility. |
| **Complex business rules** | Full Hexagonal | Use domain services, value objects, ports. Good for Sales pricing, tax calculations. |
| **External integrations** | Full Hexagonal | Always use ports for Payment providers, PDF, file storage - highly swappable. |
| **Data-heavy with calculations** | Full Hexagonal | Invoicing totals, inventory stock calculations benefit from pure domain logic. |

## Guidelines

- **Keep domain pure** - No `import React`, `import axios`, `import next/*` in `domain/`
- **Ports are interfaces** - Define contracts, don't implement them
- **Adapters implement ports** - Concrete implementations live in `adapters/`
- **Don't over-engineer** - Apply full pattern where there's I/O volatility or complex rules
- **Composition over inheritance** - Wire via hooks/factories in composition root

## Benefits

- **Testability** - Domain logic tested without UI or network
- **Flexibility** - Swap API for mock, or PDF library without touching UI
- **Clarity** - Clear separation of concerns
- **Maintainability** - Easier to reason about and refactor

## Related Documentation

- [01 - Modular Monolith](./01-modular-monolith.md)
- [07 - Plugins & Integrations](./07-plugins-integrations.md)
- [ADR-004 - Hexagonal-Lite for Frontend](../decisions/ADR-004-hexagonal-lite-for-frontend.md)
- [ADR-005 - External Adapters Pattern](../decisions/ADR-005-external-adapters-pattern.md)
