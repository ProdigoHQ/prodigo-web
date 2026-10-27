# 07 - Plugins & Integrations

## Overview

As Prodigo evolves towards `prodigo-os` and an App Marketplace, we need a flexible system for:
- **External integrations** - MTN Mobile Money, Orange Money, SMTP, webhooks
- **Plugins** - Third-party modules that extend functionality
- **Third-party adapters** - Swappable implementations for external services

## Architecture Approach

We use the Hexagonal Architecture pattern with **Ports & Adapters** to abstract external dependencies. This makes them:
- **Swappable** - Easy to replace implementations
- **Testable** - Can use mock/fake adapters in tests
- **Extensible** - Add new providers without changing core logic

## Integrations vs Plugins

| Aspect | Integrations | Plugins |
|--------|--------------|---------|
| **Purpose** | Connect to external services (payment providers, email) | Add new business modules/features |
| **Scope** | Usually cross-cutting or module-specific service | Full module with UI, routes, permissions |
| **Configuration** | Enabled/configured per tenant in Settings | Installed/subscribed like modules |
| **Location** | `core/integrations/` or `modules/*/adapters/out/external/` | `plugins/` or loaded dynamically |
| **Example** | MTN MoMo, Orange Money, SMTP | Custom reporting, industry-specific module |

## External Adapters Pattern

### Payment Providers Example

```text
modules/payments/
├── application/
│   └── ports/
│       └── out/
│           └── payment-provider.port.ts  # Port interface
└── adapters/
    └── out/
        ├── api/
        │   └── payment-api.adapter.ts     # Default API adapter
        └── external/
            ├── mtn-momo.adapter.ts        # MTN implementation
            ├── orange-money.adapter.ts   # Orange implementation
            └── cash.adapter.ts           # Cash/manual
```

### Port Definition

```typescript
// modules/payments/application/ports/out/payment-provider.port.ts
export interface InitiatePaymentInput {
  invoiceId: string;
  amount: number;
  phoneNumber: string;
  provider: 'MTN' | 'ORANGE';
}

export interface InitiatePaymentResult {
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentUrl?: string;
}

export interface PaymentProviderPort {
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  verify(transactionId: string): Promise<VerifyPaymentResult>;
  refund?(transactionId: string, amount: number): Promise<RefundResult>;
}
```

### Adapter Implementation

```typescript
// modules/payments/adapters/out/external/mtn-momo.adapter.ts
import { PaymentProviderPort } from '@/modules/payments/application/ports/out/payment-provider.port';

export class MtnMomoAdapter implements PaymentProviderPort {
  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    // Call MTN API or go through backend proxy
    const response = await fetch('/api/proxy/mtn-momo/initiate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.json();
  }

  async verify(transactionId: string): Promise<VerifyPaymentResult> {
    // Implementation
  }
}
```

### Factory Pattern

```typescript
// modules/payments/adapters/out/payment-provider.factory.ts
import { PaymentProviderPort } from '../application/ports/out/payment-provider.port';
import { MtnMomoAdapter } from './external/mtn-momo.adapter';
import { OrangeMoneyAdapter } from './external/orange-money.adapter';
import { CashAdapter } from './external/cash.adapter';

export function getPaymentProvider(type: 'MTN' | 'ORANGE' | 'CASH'): PaymentProviderPort {
  switch (type) {
    case 'MTN':
      return new MtnMomoAdapter();
    case 'ORANGE':
      return new OrangeMoneyAdapter();
    case 'CASH':
      return new CashAdapter();
    default:
      throw new Error(`Unknown payment provider: ${type}`);
  }
}
```

## File Storage

```typescript
// core/storage/file-storage.port.ts
export interface UploadResult {
  url: string;
  key: string;
}

export interface FileStoragePort {
  upload(file: File, path: string): Promise<UploadResult>;
  getUrl(key: string): Promise<string>;
  delete(key: string): Promise<void>;
}
```

Implementations:
- `adapters/out/api/storage-api.adapter.ts` - Upload via backend presigned URL (recommended)
- `adapters/out/external/s3.adapter.ts` - Direct S3 upload (if needed)
- `adapters/out/local/mock.adapter.ts` - Dev/testing

## Notifications

```text
core/notifications/
├── notification.service.ts
├── types.ts
└── adapters/
    ├── in-app.adapter.ts      # Toast + notification center
    └── web-push.adapter.ts    # Future push notifications
```

```typescript
// core/notifications/notification.service.ts
export interface NotificationService {
  success(message: string, options?: NotificationOptions): void;
  error(message: string, options?: NotificationOptions): void;
  info(message: string, options?: NotificationOptions): void;
  warning(message: string, options?: NotificationOptions): void;
}
```

## Plugin System

### Plugin Contract

```typescript
// core/registry/module-manifest.ts (same as module)
export interface PluginManifest extends ModuleManifest {
  pluginId: string;
  author?: string;
  homepage?: string;
  permissions?: string[]; // Additional permissions
}
```

### Plugin Loader

```typescript
// core/registry/plugin-loader.ts
export type PluginEntry = () => Promise<{ manifest: PluginManifest }>;

const plugins: Record<string, PluginEntry> = {
  // Dynamic imports of plugins
  // 'acme-custom-report': () => import('@/plugins/acme-custom-report'),
};

export async function loadPlugins(pluginKeys: string[]): Promise<PluginManifest[]> {
  const results = await Promise.allSettled(
    pluginKeys.map((key) => {
      const loader = plugins[key];
      return loader ? loader() : Promise.reject(new Error(`Plugin ${key} not found`));
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value.manifest);
}
```

### Plugin Structure

```text
plugins/
├── _template/
│   ├── manifest.ts
│   ├── index.ts
│   ├── adapters/
│   ├── components/
│   └── README.md
└── acme-connector/        # Example plugin
    ├── manifest.ts
    ├── index.ts
    ├── routes.tsx
    └── components/
```

## Integration Registry

For configurable integrations managed in Settings:

```typescript
// core/integrations/integration-registry.ts
export type IntegrationKey = 
  | 'mtn-momo' 
  | 'orange-money' 
  | 'smtp' 
  | 'webhook'
  | 'file-storage';

export interface IntegrationConfig {
  key: IntegrationKey;
  enabled: boolean;
  configured: boolean;
  settings?: Record<string, any>;
  // Credentials never stored in client, managed via backend
}

export class IntegrationRegistry {
  private configs = new Map<IntegrationKey, IntegrationConfig>();

  setConfig(key: IntegrationKey, config: IntegrationConfig) {
    this.configs.set(key, config);
  }

  getConfig(key: IntegrationKey): IntegrationConfig | undefined {
    return this.configs.get(key);
  }

  isEnabled(key: IntegrationKey): boolean {
    return this.configs.get(key)?.enabled ?? false;
  }
}

export const integrationRegistry = new IntegrationRegistry();
```

## Rules for Plugins

1. **Follow module contract** - Must have valid `ModuleManifest`
2. **Respect permissions** - Cannot bypass guards
3. **Use core services** - Go through `core/http`, `core/notifications`, etc.
4. **Isolated styles** - Use CSS modules or scoped classes
5. **No core mutations** - Don't modify core stores directly
6. **API only** - All data through backend API
7. **Version compatibility** - Declare compatible app version
8. **Sandboxed** - Limited access to global state

## Security Considerations

- **Never expose secrets** - Credentials stay on backend
- **Validate manifests** - Check structure before loading
- **Permission checks** - Enforce at every level
- **CORS/CSRF** - Handled by backend
- **Idempotency** - Use for payment operations
- **Rate limiting** - Respect backend limits
- **Webhook verification** - Verify signatures for callbacks

## Future: Module Federation

For true runtime plugin loading across repos, we can use Module Federation (Webpack/Rspack). This would allow:
- Loading plugins from separate builds
- Sharing dependencies
- Independent deployment
- True marketplace

But for now, static imports are sufficient and simpler.

## Related Documentation

- [02 - Hexagonal Frontend](./02-hexagonal-frontend.md)
- [05 - Module System](./05-module-system.md)
- [ADR-004 - Hexagonal-Lite for Frontend](../decisions/ADR-004-hexagonal-lite-for-frontend.md)
- [ADR-005 - External Adapters Pattern](../decisions/ADR-005-external-adapters-pattern.md)
