# SivamCars — Cursor AI Rules

## ⚠️ Mandatory Reading Before Any Code Change

Before generating or modifying any code in this project, you MUST read and follow these documents in order:

1. [`PROJECT.md`](../PROJECT.md) — Understand what this product is and is not
2. [`ARCHITECTURE.md`](../ARCHITECTURE.md) — Understand the folder structure and layering rules
3. [`RULES.md`](../RULES.md) — Follow all coding standards and naming conventions
4. [`TECH_STACK.md`](../TECH_STACK.md) — Use only the approved libraries and versions
5. [`SKILLS.md`](../SKILLS.md) — Embody the AI engineer persona defined here
6. [`DECISIONS.md`](../DECISIONS.md) — Never violate a locked architectural decision

---

## Core Enforcement Rules

### ALWAYS:
- Use TypeScript strict mode — no `any` types
- Use Server Components by default — Client Components only when required
- Validate all API inputs with Zod before processing
- Use Mongoose `.lean()` for performance in read queries
- Write `generateMetadata` on every public-facing page
- Add JSON-LD schema markup on car detail and blog pages
- Use absolute path aliases (`@/*`, `@backend/*`, `@shared/*`) — never relative imports
- Handle errors in every async function with try/catch
- Apply proper HTTP status codes in all Route Handlers
- Keep business logic in `backend/services/` — not in Route Handlers

### NEVER:
- Use ISR (Incremental Static Regeneration) for any public page
- Import Mongoose models or services in Client Components
- Add new npm packages without updating `TECH_STACK.md` and `DECISIONS.md`
- Hard-delete cars — always soft delete
- Implement features outside `PROJECT.md` scope
- Use `any` TypeScript type
- Use inline styles — Tailwind utility classes only
- Store secrets in code or commit `.env.*` files
- Implement: payments, bookings, AI assistant, multi-language, RBAC, Redis, Meilisearch
- Write business logic inside Route Handlers
- Skip error states or empty states in UI components

---

## File Placement Rules

| If creating... | Place in... |
|---|---|
| A page | `frontend/app/(public)/...` or `frontend/app/admin/...` |
| An API route | `frontend/app/api/...` |
| A UI component | `frontend/components/...` |
| A Mongoose model | `backend/models/...` |
| A service | `backend/services/...` |
| A Zod validator | `backend/validators/...` |
| A TypeScript type | `shared/types/...` |
| A utility | `shared/constants/...` or `frontend/lib/...` |

---

## What This Project IS

A single-dealership used car listing and lead generation platform.
Focus: SEO dominance, fast performance, reliable lead capture, clean admin.

## What This Project IS NOT

A marketplace. A SaaS. A multi-tenant app. An e-commerce platform.
No payments. No bookings. No AI assistant. No public user accounts.
