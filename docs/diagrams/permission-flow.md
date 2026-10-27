# Permission Flow Diagram

## Overview

This diagram shows how permissions flow from authentication to UI rendering.

## Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant App as App Router
    participant AuthGuard
    participant TenantGuard
    participant ModuleGuard
    participant PermGuard as PermissionGuard
    participant Store as Auth/Tenant Store
    participant API as prodigo-api
    participant UI as Component/UI
    
    User->>App: Navigate to protected route
    App->>AuthGuard: Check authentication
    AuthGuard->>Store: Get auth state
    alt Not authenticated
        AuthGuard->>User: Redirect to /login
    else Authenticated
        AuthGuard->>TenantGuard: Continue
        TenantGuard->>Store: Get tenant
        alt Tenant invalid/suspended
            TenantGuard->>User: Show tenant blocked
        else Valid tenant
            TenantGuard->>API: GET /me (on load)
            API->>Store: Hydrate user, tenant, roles, permissions, enabledModules, theme
            Store->>ModuleGuard: Check module access
            alt Module not enabled
                ModuleGuard->>User: Show "Module not subscribed"
            else Module enabled
                ModuleGuard->>PermGuard: Check permissions
                alt No permission
                    PermGuard->>User: Show 403 Forbidden
                else Has permission
                    PermGuard->>UI: Render component
                    UI->>User: Display UI
                end
            end
        end
    end
```

## Permission Check Levels

```mermaid
graph TD
    Start[User Action] --> Route[Route Level]
    Route --> RG{ModuleGuard + AuthGuard + TenantGuard}
    RG -->|Pass| Page[Page Component]
    RG -->|Fail| Block[Blocked View]
    
    Page --> Nav[Navigation]
    Nav --> NG{Permission check in registry}
    NG -->|Pass| Show[Show menu item]
    NG -->|Fail| Hide[Hide menu item]
    
    Page --> Action[Action/Button]
    Action --> AG{PermissionGuard}
    AG -->|Pass| Enable[Enable button]
    AG -->|Fail| Hidden[Hidden/Disabled]
    
    Action --> Click[User clicks]
    Click --> API[API Call]
    API --> Backend[Backend checks permissions]
    Backend -->|403| Error[Show error]
    Backend -->|200| Success[Update UI]
```

## Permission Types

```mermaid
graph LR
    Perm[Permissions] --> ERP[ERP.* - Platform]
    Perm --> Module[<module>.* - Module]
    
    ERP --> SuperAdmin[Super Admin only]
    ERP --> PlatformOps[Platform operations]
    
    Module --> Read[read]
    Module --> Create[create]
    Module --> Update[update]
    Module --> Delete[delete]
    Module --> Custom[custom actions]
```

## Data Sources

| Source | What it provides | Used for |
|--------|------------------|----------|
| **GET /me** | user, tenant, roles, permissions[], enabledModules[], theme | Hydration on app load |
| **useAuthStore** | accessToken, user, isAuthenticated | Auth state |
| **useTenantStore** | tenant, tenantTheme | Tenant context |
| **usePermissions()** | hasPermission, hasModule, etc. | Permission checks |
| **moduleRegistry** | Manifests, filtered nav/routes | Navigation & routing |

## Key Points

1. **Backend is authoritative** - All permission checks must be enforced server-side
2. **Frontend is for UX** - Hide/show for better experience, not security
3. **Multiple layers** - Route, navigation, component, action levels
4. **Fail securely** - Default deny, show 403 on missing permission
5. **Module gate** - Subscription checked before permission
6. **Theme applied** - After tenant loaded

## Testing Scenarios

- [ ] Unauthenticated user → redirected to login
- [ ] Suspended tenant → blocked
- [ ] Unsubscribed module → module not subscribed page
- [ ] No permission → 403
- [ ] Has permission but wrong tenant → backend 403
- [ ] Inactive user → denied
- [ ] Platform admin with ERP.* → can access admin routes
