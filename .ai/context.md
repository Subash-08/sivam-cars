# .ai/context.md — SivamCars AI Context

> **Antigravity / Cursor directive:** Follow this file strictly before writing any code.
> Begin every session with: _"Follow .ai/context.md and .ai/constraints.md strictly."_

---

## Project Classification

**Type:** Production-grade, single-dealership automotive lead generation platform
**Status:** Active development
**Scale:** Low traffic, 30–100 car inventory, single admin
**Domain:** Used car dealership (India, English only)

---

## Priority Hierarchy

When making decisions, always prioritize in this order:

1. **Security** — Admin access must be protected server-side. User data handled safely.
2. **SEO correctness** — Every public page must be properly indexed and schema-marked.
3. **Maintainability** — Code must be clean, strictly typed, and easy to extend.
4. **Performance** — Pages must load fast. Core Web Vitals must pass.
5. **Developer experience** — Tooling and conventions must be consistent.

---

## Architecture Identity

**Architecture Pattern:** Modular Monolith (Next.js App Router fullstack)

### Layered Boundaries

| Layer | Location | Responsibility |
|---|---|---|
| UI Layer | `src/app/` + `src/components/` | Rendering, layout, interactivity |
| API Layer | `src/app/api/` | Route Handlers — thin, no business logic |
| Service Layer | `src/services/` | All business logic and DB orchestration |
| Data Layer | `src/models/` | Mongoose schemas + model definitions |
| Validation Layer | `src/validations/` | Zod schemas shared by client + server |
| Server Utilities | `src/lib/` | DB connection singleton, auth config |
| Config + Constants | `src/config/` + `src/constants/` | Shared constants, site config |
| Types | `src/types/` | TypeScript type definitions |
| Scripts | `src/server/scripts/` | One-time server-only utility scripts |

**Business logic must never cross layers directly.**
**All database interaction must flow through services.**

> Without explicit architecture declaration, AI may restructure folders silently — this document prevents that.

---

## Import Boundaries

### ✅ Allowed
- `src/app/api/*` → `src/services/*` only
- `src/services/*` → `src/models/*`
- `src/services/*` → `src/validations/*`
- `src/services/*` → `src/lib/db.ts`
- `src/app/*` (Server Components) → `src/services/*` (server only)
- `src/components/*` → `src/types/*`, `src/config/*`, `src/constants/*`
- `src/validations/*` → (no imports other than zod)

### ❌ Forbidden
- `src/components/*` → `src/models/*`
- `src/components/*` → `src/services/*`
- `src/components/*` (Client) → `src/lib/db.ts`
- `src/services/*` → `src/components/*`
- `src/app/api/*` → direct Mongoose model access (must use service)

---

## Core Tech Stack

| Attribute | Value |
|---|---|
| Framework | Next.js 14+ App Router |
| Language | TypeScript (strict) |
| Database | MongoDB Atlas via Mongoose |
| Auth | NextAuth.js, single admin credentials |
| Storage | Cloudinary |
| Hosting | Vercel |
| Automation | n8n (external webhooks) |
| Analytics | Google Analytics 4 |
| Rendering | SSR only for public pages — NO ISR |

---

## Performance Enforcement

All code must follow these performance rules:

- All read-only Mongoose queries **must** use `.lean()` — returns plain JS objects, faster
- All list queries **must** implement pagination — no unbounded queries
- Public pages must **never** use client-side data fetching for initial data
- Avoid N+1 query patterns — use `populate()` or batch queries
- All images must use `next/image` with explicit `width`, `height`, or `fill`
- Priority prop required on above-the-fold images (hero, first car card)
- Dynamic imports (`next/dynamic`) for heavy client-only components

---

## SEO Enforcement

**Every public page must:**

- Export `generateMetadata` function (not optional)
- Include a `canonical` URL via `metadataBase`
- Include `title` under 60 characters
- Include `description` under 160 characters
- Include exactly **one `<h1>`** per page
- Include proper `<h2>` / `<h3>` heading hierarchy
- Include `openGraph` metadata (title, description, image)
- Include structured JSON-LD schema:
  - Car detail pages → `Vehicle` schema
  - Blog pages → `Article` schema
  - All pages → `Organization` + `BreadcrumbList` schema
  - FAQ sections → `FAQPage` schema

Without this enforcement, AI may generate pages with missing or duplicate metadata.

---

## Session Protection Rule

- Admin `layout.tsx` must **always** verify session server-side using `getServerSession(authOptions)`.
- If no session → `redirect('/auth/login')` immediately in the layout.
- **Never** rely only on client-side session hooks (`useSession`) for route protection.
- Client-side session checks are only for UI state (showing/hiding elements), never for security.

---

## Error Handling Standard

| Layer | Responsibility |
|---|---|
| Services | Throw typed errors with descriptive messages |
| Route Handlers | Catch errors from services, convert to safe `{ success: false, error: string }` responses |
| Server Components | Wrap data fetching in try/catch, render error UI or redirect |
| Client Components | Use error boundaries or local error state |

**Rules:**
- Never expose raw error stacks to the client
- Never expose Mongoose error details to the client
- Always log errors server-side with `console.error` (or future logger)
- Return correct HTTP status codes: 400, 401, 403, 404, 429, 500

---

## Key Product Rules

- Lead generation platform only — no payments, no bookings, no public accounts
- Cars are **never hard deleted** — soft delete only (`isActive: false`, `deletedAt`)
- All form submissions save to DB first, then fire n8n webhook (fire-and-forget)
- Admin user is seeded via script — never generate admin registration UI
- Rate limiting required on: login, lead forms, upload endpoints
- SSR is **mandatory** — no ISR for car or blog pages
