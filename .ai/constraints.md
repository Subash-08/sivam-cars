# .ai/constraints.md — SivamCars AI Boundaries

> **Antigravity / Cursor directive:** Follow this file strictly before writing any code.
> Begin every session with: _"Follow .ai/context.md and .ai/constraints.md strictly."_

---

## Absolute Constraints (Cannot Be Overridden Without Human Unlock)

### Feature Scope
- ❌ Do NOT implement payment processing (Stripe, Razorpay, or any other)
- ❌ Do NOT implement booking or appointment scheduling
- ❌ Do NOT implement an AI chatbot or virtual assistant
- ❌ Do NOT implement public user registration or login
- ❌ Do NOT implement wishlists, saved searches, or user profiles
- ❌ Do NOT implement multi-language or internationalization
- ❌ Do NOT implement RBAC or multiple admin roles
- ❌ Do NOT implement multi-dealer or multi-tenant functionality
- ❌ Do NOT implement SaaS features (subscription, billing, tenant isolation)

---

### Architecture Constraints
- ❌ Do NOT put business logic in Route Handlers — use services
- ❌ Do NOT put data fetching in Client Components
- ❌ Do NOT import Mongoose models directly in Route Handlers — use services
- ❌ Do NOT create new Mongoose models without updating `DB_SCHEMA.md`
- ❌ Do NOT deviate from the `src/` folder structure in `ARCHITECTURE.md`
- ❌ Do NOT use ISR (`revalidate`) on public car or blog pages — SSR only
- ❌ Do NOT hard-delete cars — always soft delete (`isActive: false`, `deletedAt`)

---

### Import Boundary Constraints

```
❌ components → models          (Forbidden)
❌ components → services        (Forbidden)
❌ client components → lib/db   (Forbidden)
❌ services → components        (Forbidden)
❌ api routes → models directly (Must go through services)

✅ app/api → services           (Correct)
✅ services → models            (Correct)
✅ services → validations       (Correct)
✅ Server Components → services (Correct, server only)
```

---

### Technology Constraints
- ❌ Do NOT add Redis, Upstash, or any in-memory store
- ❌ Do NOT add Meilisearch, Algolia, or Elasticsearch
- ❌ Do NOT add a separate Express, Fastify, or NestJS backend
- ❌ Do NOT add npm packages without updating `TECH_STACK.md` and `DECISIONS.md`

#### Dependency Addition Rule
When a new package is required, you **must** justify:
1. Why it is necessary
2. Why the native or existing solution is insufficient
3. Impact on client bundle size

Without this justification, do NOT add the package.

---

### TypeScript Constraints
- ❌ Do NOT use the `any` type — use `unknown` or proper interfaces
- ❌ Do NOT use relative imports — only `@/` path aliases
- ❌ Do NOT use type assertions (`as X`) without a comment explaining why it is safe
- ❌ Do NOT skip TypeScript return types on service functions

---

### Security Constraints
- ❌ Do NOT commit `.env.local` or any `.env.*` secrets files
- ❌ Do NOT expose Cloudinary API secret in client code
- ❌ Do NOT skip Zod validation on any API route
- ❌ Do NOT skip the admin session guard on any admin API route
- ❌ Do NOT log passwords, tokens, or personal data
- ❌ Do NOT expose raw error stacks in API responses
- ❌ Do NOT rely on client-side session checks (`useSession`) for route protection — use server-side `getServerSession` in admin `layout.tsx`

---

### Performance Constraints
- ❌ Do NOT write Mongoose read-only queries without `.lean()`
- ❌ Do NOT write unbounded list queries — all lists must be paginated
- ❌ Do NOT fetch page data on the client for public-facing pages
- ❌ Do NOT use `<img>` tags — always use `next/image`

---

### SEO Constraints
- ❌ Do NOT create a public page without `generateMetadata`
- ❌ Do NOT write a `title` over 60 characters
- ❌ Do NOT write a `description` over 160 characters
- ❌ Do NOT use more than one `<h1>` per page
- ❌ Do NOT skip JSON-LD schema on car detail or blog pages

---

## Boundaries That CAN Be Shifted (With Explicit Human Approval)

The following constraints can change **only if**:
1. The user explicitly requests the change
2. A new entry is created in `DECISIONS.md`
3. `TECH_STACK.md` is updated

| Boundary | Action Required |
|---|---|
| ISR for genuinely static pages (e.g. `/about`) | Explicit approval + DECISIONS.md entry |
| Adding Redis/Upstash if traffic grows | Explicit approval + TECH_STACK.md update |
| Adding Resend for email if n8n is replaced | Explicit approval + TECH_STACK.md update |
| Switching NextAuth JWT → database sessions | Explicit approval + TECH_STACK.md update |
| Adding a staging environment | Explicit approval + deployment docs |

---

## Project Identity (Never Lose Sight Of This)

**This IS:**
- A professional used car showcase for a single dealership
- A lead generation platform focused on SEO and trust
- A clean, maintainable Next.js fullstack application in `src/`

**This IS NOT:**
- A marketplace
- A SaaS platform
- An e-commerce or payment platform
- A real-time application
- A multi-tenant or multi-role system
