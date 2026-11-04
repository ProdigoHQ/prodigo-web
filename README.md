# Prodigo ERP Frontend

Prodigo is a modern, multi-tenant cloud ERP for businesses in Cameroon and West Africa. This repository is the web frontend — a Next.js application covering the public marketing site, authentication, and the foundation of the authenticated ERP workspace.

![Prodigo ERP landing page with an interactive product preview](./docs/assets/prodigo-preview.png)

## What's Inside

- **Product-first landing experience** — an interactive preview of the dashboard, customers, products, stock, invoices, and reports.
- **Authentication flows** — login, forgot password, and a three-step registration journey (account → company → modules).
- **ERP workspace foundation** — a responsive dashboard shell, persisted session, and module navigation.
- **Feature-based architecture** — frontend modules mirror the Spring Boot backend and keep API, UI, hooks, schemas, and state colocated.
- **Prodigo Design System** — consistent tokens, accessible primitives, and responsive layouts across every screen.

## Tech Stack

| Area          | Technology                                     |
| ------------- | ---------------------------------------------- |
| Framework     | Next.js 16 (App Router)                        |
| UI            | React 19, Tailwind CSS v4, shadcn/ui on Base UI |
| Language      | TypeScript (strict)                            |
| Server state  | TanStack Query                                 |
| Client state  | Zustand (persisted auth session)               |
| HTTP          | Axios                                          |
| Validation    | Zod                                            |
| Icons         | Lucide                                         |

## Getting Started

### Requirements

- Node.js 20.9+
- pnpm 10+

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The frontend expects the Spring Boot API at the URL configured in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/1.0
```

No Next.js API routes are used. All requests go through the shared Axios client in `src/lib/http/client.ts`, which attaches the bearer token, normalizes API errors, and redirects to `/login` on `401`.

## Scripts

| Command       | Description                                      |
| ------------- | ------------------------------------------------ |
| `pnpm dev`    | Start the development server                     |
| `pnpm build`  | Create a production build (also type-checks)     |
| `pnpm start`  | Serve the production build                       |
| `pnpm lint`   | Run ESLint                                       |

## Project Structure

```text
src/
├── app/                 # Routes only (landing, auth, dashboard)
├── components/
│   ├── ui/              # shadcn/ui primitives
│   └── shared/          # Cross-app components
├── features/            # Feature-based modules
│   ├── auth/            # Session, forms, API, schemas
│   ├── dashboard/       # Workspace foundation
│   └── landing/         # Marketing site and hero preview
├── lib/                 # HTTP client, errors, utilities
└── providers/           # App providers
```

## Documentation

Architecture notes, ADRs, diagrams, and conventions live in [`docs/`](./docs/README.md). Start with the [architecture overview](./docs/architecture/00-overview.md).

## Contributing

- Keep `src/app/` thin — routes should delegate to feature components.
- Colocate code under `src/features/<feature>/`.
- Reuse design-system components and tokens before introducing new ones.
- Run `pnpm lint` and `pnpm build` before opening a pull request.
