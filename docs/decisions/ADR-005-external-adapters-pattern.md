# ADR-005: External Adapters Pattern

**Status:** Accepted  
**Date:** 2026-10-26  
**Deciders:** Development Team  
**Tags:** adapters, integrations, payments, external-services

## Context

Prodigo will integrate with external services:
- Mobile Money (MTN MoMo, Orange Money)
- PDF generation
- File storage
- Email/SMS providers
- Webhooks
- Future third-party APIs

These are:
- Volatile (APIs change)
- Need to be swappable (different providers per region)
- Should be testable with mocks
- May need proxying through backend for security
- Require careful error handling and idempotency

## Decision

We will use the **Ports & Adapters (Hexagonal)** pattern for all external integrations:

1. **Define a Port** - Interface in `application/ports/out/` describing what we need
2. **Implement Adapters** - Concrete implementations in `adapters/out/external/`
3. **Use Factory** - Select adapter based on configuration/provider
4. **Prefer Backend Proxy** - For sensitive operations, go through `prodigo-api`

## Structure

```text
modules/<module>/
├── application/
│   └── ports/
│       └── out/
│           └── <service>.port.ts      # Interface
└── adapters/
    └── out/
        ├── api/                       # API adapter (default)
        └── external/
            ├── provider-a.adapter.ts
            ├── provider-b.adapter.ts
            └── fake.adapter.ts       # For testing/dev
```

## Examples

### Payment Provider
```typescript
// Port
export interface PaymentProviderPort {
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  verify(transactionId: string): Promise<VerifyPaymentResult>;
  refund?(transactionId: string, amount: number): Promise<RefundResult>;
}

// Adapter
export class MtnMomoAdapter implements PaymentProviderPort { ... }

// Factory
export function getPaymentProvider(type: ProviderType): PaymentProviderPort {
  switch (type) {
    case 'MTN': return new MtnMomoAdapter();
    case 'ORANGE': return new OrangeMoneyAdapter();
    case 'CASH': return new CashAdapter();
  }
}
```

### PDF Generator
```typescript
// Port
export interface PdfGeneratorPort {
  generateInvoice(input: InvoicePdfInput): Promise<Blob>;
}

// Adapters
// - api/pdf-api.adapter.ts (call backend)
// - external/html-to-pdf.adapter.ts (client-side)
// - external/pdfmake.adapter.ts
```

### File Storage
```typescript
// Port
export interface FileStoragePort {
  upload(file: File, path: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
}

// Prefer api/storage-api.adapter.ts using presigned URLs
```

## Security Considerations

1. **Never call providers directly** - Use backend proxy for credentials
2. **Idempotency keys** - Required for payments
3. **Webhook verification** - Verify signatures
4. **No secrets in frontend** - All keys on backend
5. **Rate limiting** - Respect provider limits
6. **Error handling** - Graceful failures with user feedback

## Consequences

### Positive
- **Testable** - Easy to mock with fake adapters
- **Swappable** - Change providers without touching business logic
- **Secure** - Credentials never in frontend
- **Maintainable** - Clear contracts
- **Flexible** - Support multiple providers
- **Type-safe** - Interfaces enforce contracts

### Negative
- **More code** - Ports + adapters + factory
- **Indirection** - Extra layer
- **Learning curve** - Team needs to understand pattern

### Mitigations
- **Only use when needed** - Not for simple API calls
- **Templates** - Create adapter templates
- **Documentation** - Clear examples
- **Start with API adapter** - Often simplest and most secure

## Recommendations

- **Default to backend proxy** - `prodigo-api` handles provider SDKs/auth
- **Use ports for anything external** - If it leaves our API boundary in a non-standard way
- **Fake adapters for dev** - Speed up development
- **Idempotency** - Critical for payments
- **Logging** - Log external calls (without sensitive data)

## References
- [02 - Hexagonal Frontend](../architecture/02-hexagonal-frontend.md)
- [07 - Plugins & Integrations](../architecture/07-plugins-integrations.md)
- [ADR-004 - Hexagonal-Lite for Frontend](./ADR-004-hexagonal-lite-for-frontend.md)
- Alistair Cockburn - Hexagonal Architecture
