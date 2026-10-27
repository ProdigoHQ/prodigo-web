# Prodigo ERP Frontend - Documentation

This documentation covers the architecture, design decisions, and conventions for the Prodigo ERP frontend (`prodigo-web`).

## Overview

Prodigo is a modern multi-tenant cloud ERP for businesses, split across three repositories:
- **prodigo-api** - Spring Boot Modular Monolith (source of truth)
- **prodigo-web** - Next.js 16 responsive ERP frontend
- **prodigo-os** - Desktop OS-like environment (future)

## Documentation Structure

### Architecture
- [00 - Overview](./architecture/00-overview.md) - Ecosystem, goals, and vision
- [01 - Modular Monolith](./architecture/01-modular-monolith.md) - Why and how for the frontend
- [02 - Hexagonal Frontend](./architecture/02-hexagonal-frontend.md) - Ports & Adapters mapping
- [03 - Multi-Tenancy](./architecture/03-multi-tenant.md) - Tenant isolation and context
- [04 - RBAC & Permissions](./architecture/04-rbac.md) - Permission model and guards
- [05 - Module System](./architecture/05-module-system.md) - Subscriptions, registry, and gating
- [06 - White-Labeling](./architecture/06-white-labeling.md) - Theme system and branding
- [07 - Plugins & Integrations](./architecture/07-plugins-integrations.md) - Extensibility and external adapters
- [08 - API Contract](./architecture/08-api-contract.md) - Conventions and error handling
- [09 - Folder Conventions](./architecture/09-folder-conventions.md) - Structure, naming, and imports

### Architecture Decision Records (ADRs)
- [ADR-001 - Frontend Modular Structure](./decisions/ADR-001-frontend-modular-structure.md)
- [ADR-002 - Permission-Driven Navigation](./decisions/ADR-002-permission-driven-navigation.md)
- [ADR-003 - Module Registry](./decisions/ADR-003-module-registry.md)
- [ADR-004 - Hexagonal-Lite for Frontend](./decisions/ADR-004-hexagonal-lite-for-frontend.md)
- [ADR-005 - External Adapters Pattern](./decisions/ADR-005-external-adapters-pattern.md)

### Diagrams
- [Module Dependency Diagram](./diagrams/module-dependency.md)
- [Permission Flow Diagram](./diagrams/permission-flow.md)

### References
- [External References](./references/external-references.md)

## Quick Start

1. Read [00-overview.md](./architecture/00-overview.md) for context
2. Understand [01-modular-monolith.md](./architecture/01-modular-monolith.md) for the approach
3. Follow [09-folder-conventions.md](./architecture/09-folder-conventions.md) for implementation
4. Check ADRs for key decisions

## Contributing

When making architectural changes:
1. Document in the appropriate architecture file
2. Create or update an ADR if it's a significant decision
3. Update diagrams if structure changes
4. Keep docs in sync with implementation
