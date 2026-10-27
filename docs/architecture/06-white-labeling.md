# 06 - White-Labeling

## Overview

White-labeling allows each tenant to customize the ERP's appearance with their own brand colors and logo, creating a personalized experience while using the same platform.

## Features

- **Custom primary/secondary colors** - Brand colors applied throughout UI
- **Custom logo** - Displayed in sidebar, login, emails
- **Tenant name** - Shown in workspace switcher
- **Consistent theming** - Applied to all components via CSS variables

## Data Model

From backend (`GET /tenant/theme` and included in `GET /me`):

```typescript
interface TenantTheme {
  primaryColor: string;      // Hex color, e.g., "#3B82F6"
  secondaryColor: string;    // Hex color
  logoUrl?: string;          // URL to uploaded logo
  logoKey?: string;          // Storage key
  borderRadius?: string;     // e.g., "0.5rem"
  fontFamily?: string;       // Optional custom font
}
```

## Implementation

### Theme Provider

```typescript
// core/theme/theme-provider.tsx
'use client';

import { useEffect } from 'react';
import { useTenantStore } from '@/core/tenant/store/tenant-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { tenantTheme } = useTenantStore();

  useEffect(() => {
    const root = document.documentElement;

    if (tenantTheme) {
      // Apply custom colors
      if (tenantTheme.primaryColor) {
        root.style.setProperty('--color-primary', tenantTheme.primaryColor);
        root.style.setProperty('--color-primary-foreground', getContrastColor(tenantTheme.primaryColor));
      }
      
      if (tenantTheme.secondaryColor) {
        root.style.setProperty('--color-secondary', tenantTheme.secondaryColor);
      }
      
      if (tenantTheme.borderRadius) {
        root.style.setProperty('--radius', tenantTheme.borderRadius);
      }
      
      if (tenantTheme.logoUrl) {
        root.dataset.tenantLogo = tenantTheme.logoUrl;
      }
    } else {
      // Fallback to defaults
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--radius');
      delete root.dataset.tenantLogo;
    }
  }, [tenantTheme]);

  return <>{children}</>;
}

function getContrastColor(hex: string): string {
  // Calculate contrast color (black or white)
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}
```

### CSS Variables

In `app/globals.css`, define defaults:

```css
@layer base {
  :root {
    --color-primary: oklch(0.55 0.15 250);
    --color-primary-foreground: oklch(0.98 0 0);
    --color-secondary: oklch(0.95 0 0);
    --color-secondary-foreground: oklch(0.2 0 0);
    --radius: 0.5rem;
  }
}
```

Tailwind v4 uses these via `@theme inline` or direct CSS variable usage.

### Logo Component

```tsx
// components/shared/logo.tsx
import Image from 'next/image';
import { useTenantStore } from '@/core/tenant/store/tenant-store';

export function Logo({ className }: { className?: string }) {
  const { tenantTheme } = useTenantStore();
  
  if (tenantTheme?.logoUrl) {
    return (
      <Image
        src={tenantTheme.logoUrl}
        alt="Logo"
        width={120}
        height={40}
        className={className}
      />
    );
  }
  
  return <ProdigoLogo className={className} />;
}
```

## Flow

```text
1. User logs in
   ↓
2. GET /me returns tenant.theme
   ↓
3. Store in useTenantStore
   ↓
4. ThemeProvider applies CSS variables to document
   ↓
5. All components use CSS variables (primary, secondary, etc.)
   ↓
6. Logo component reads from store
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /tenant/theme` | GET | Get current theme |
| `PUT /tenant/theme` | PUT | Update theme (requires permissions) |
| `POST /tenant/theme/logo` | POST | Upload logo |

## Settings UI (Future)

Theme customization will be in `Settings > Appearance`:
- Color pickers for primary/secondary
- Logo upload with preview
- Border radius selector
- Reset to defaults
- Live preview

## Validation

Backend validates:
- Colors must be valid hex format
- Logo must be image (jpg, png, svg, webp)
- File size limits
- Only authorized users can update

## Best Practices

1. **Use CSS variables everywhere** - Don't hardcode colors, use `bg-primary`, `text-primary-foreground`
2. **Provide good defaults** - App should look great without custom theme
3. **Calculate contrast** - Ensure text readable on primary buttons
4. **Optimize logo** - Use Next/Image with proper sizes
5. **Cache theme** - Store in zustand to avoid flash
6. **Respect system preferences** - Only if no custom theme set (future)
7. **Preview before save** - In settings UI
8. **Fallback gracefully** - If logo fails to load, show default

## Notes

- Theme is applied client-side for instant feedback
- Logo uploaded through `FileStoragePort` on backend
- Theme included in `/me` for single-request hydration
- CSS variables work with Tailwind v4 seamlessly

## Related Documentation

- [03 - Multi-Tenancy](./03-multi-tenant.md)
- [04 - RBAC & Permissions](./04-rbac.md)
- [07 - Plugins & Integrations](./07-plugins-integrations.md)
