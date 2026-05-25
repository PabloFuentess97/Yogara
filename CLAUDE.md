# Yogara

Plataforma SaaS multi-tenant para centros de yoga, wellness y pilates con sistema de themes por código.

## Comandos

- `pnpm dev` — Levantar desarrollo (web + admin en paralelo via turbo)
- `pnpm build` — Build de producción
- `pnpm lint` — ESLint en todo el monorepo
- `pnpm test` — Vitest (unit + integration)
- `pnpm test:e2e` — Playwright E2E
- `pnpm db:migrate` — Prisma migrate dev
- `pnpm db:generate` — Prisma generate
- `pnpm db:seed` — Seed de datos de prueba
- `docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d` — Levantar PostgreSQL + Redis

## Tech Stack

Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui + PostgreSQL + Prisma 6 + NextAuth v5 + Stripe + Resend + Redis + BullMQ + Docker + Coolify

## Arquitectura

### Monorepo (Turborepo + pnpm workspaces)

- `apps/web/` — App multi-tenant pública + admin del centro
- `apps/admin/` — Super admin panel (owner de Yogara)
- `packages/database/` — Prisma schema, client singleton, middleware de tenant isolation
- `packages/auth/` — NextAuth config, providers, RBAC permissions
- `packages/themes/` — Theme engine + themes implementados
- `packages/modules/` — Core business logic
- `packages/email/` — Resend client + templates
- `packages/queue/` — BullMQ queues + workers
- `packages/ui/` — Componentes compartidos, hooks, providers
- `packages/config/` — Env validation (Zod), constantes globales

### Multi-Tenant

- Toda tabla tenant-scoped tiene `organization_id` como FK
- Middleware de Next.js resuelve tenant: subdominio o dominio custom
- Tenant config se cachea en Redis (TTL 5min)

### Themes

- Cada theme es una implementación visual completa por código
- Implementa `ThemeContract`: layouts, components, sections
- El admin panel SIEMPRE usa shadcn/ui, nunca el theme

### Data Flow

- Server Components hacen query directo a Prisma
- Mutations via Server Actions en `packages/modules/`
- Validación Zod en schemas, lógica en services

## Reglas del Código

1. TypeScript strict. Cero `any`.
2. Server Components por defecto. Solo `"use client"` cuando hay interactividad.
3. Un componente por archivo. Máximo 300 líneas.
4. Path alias: `@/` para `src/` en cada app. `@yogara/{package}` para packages.
5. Toda mutation tiene validación Zod.
6. Todo query tenant-scoped incluye organization_id.
7. Formularios: React Hook Form + Zod resolver.
8. Server Actions devuelven `{ success: true, data } | { success: false, error }`.
9. Mobile-first responsive.
10. Todo en español: UI, mensajes, rutas. Código en español excepto términos técnicos.
