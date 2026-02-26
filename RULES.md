# RULES.md — SivamCars Coding Standards and Conventions

## Preamble

These rules are **mandatory**. Every line of code written in this project — by a human or an AI — must comply. No exceptions without explicit written approval and a new entry in `DECISIONS.md`.

---

## 1. Language Rules

### TypeScript
- **Strict mode is always on.** `tsconfig.json` must have `"strict": true`.
- **No `any` type allowed.** Use `unknown` and narrow types, or define proper interfaces.
- **No type assertions (`as X`) without a comment explaining why it is safe.**
- All function parameters and return types must be explicitly typed.
- Use `interface` for object shapes that can be extended. Use `type` for unions, intersections, and primitives.
- Prefer `const` over `let`. Never use `var`.

### File Naming
| Type | Convention | Example |
|---|---|---|
| Next.js pages | `page.tsx` | `app/cars/page.tsx` |
| Next.js layouts | `layout.tsx` | `app/admin/layout.tsx` |
| Next.js Route Handlers | `route.ts` | `app/api/cars/route.ts` |
| Components | `PascalCase.tsx` | `CarCard.tsx` |
| Hooks | `camelCase.ts`, prefix `use` | `useCarFilters.ts` |
| Services | `camelCase.service.ts` | `car.service.ts` |
| Models | `PascalCase.model.ts` | `Car.model.ts` |
| Validators | `camelCase.validator.ts` | `car.validator.ts` |
| Types | `camelCase.types.ts` | `car.types.ts` |
| Constants | `camelCase.ts` | `filters.ts` |
| Utilities | `camelCase.ts` | `formatters.ts` |

---

## 2. Component Rules

### Server vs Client Components
- **Default to Server Components.** Do not add `"use client"` unless the component requires:
  - Browser-only APIs (`window`, `document`)
  - React hooks (`useState`, `useEffect`, `useRef`, etc.)
  - Event handlers (`onClick`, `onChange`, etc.)
- The `"use client"` directive must appear on the **first line** of the file.
- **Never put data fetching logic in Client Components.** Fetch in Server Components and pass data as props.

### Component Structure (in order)
```tsx
// 1. Imports (external then internal)
// 2. Type definitions (props interface)
// 3. Component function
// 4. Helper sub-components (if small and tightly coupled)
// 5. Default export
```

### Props
- Always define a named `Props` interface for each component:
  ```tsx
  interface CarCardProps {
    car: Car;
    showPrice?: boolean;
  }
  ```
- Do not use `React.FC` — use plain function declarations:
  ```tsx
  // ✅ Correct
  export default function CarCard({ car, showPrice = true }: CarCardProps) {}
  
  // ❌ Wrong
  const CarCard: React.FC<CarCardProps> = ({ car }) => {}
  ```

---

## 3. API Route Handler Rules

- Route Handlers live in `frontend/app/api/`
- Every Route Handler must:
  1. Validate input with Zod before processing
  2. Call a service function (no business logic in the handler)
  3. Return a structured response: `{ data: ..., error: null }` or `{ data: null, error: "..." }`
  4. Handle errors with try/catch and return appropriate HTTP status codes
- All admin-facing routes must check session via `adminGuard`:
  ```ts
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  ```

### Standard Response Shape
```ts
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, details?: ZodError }
```

---

## 4. Service Layer Rules

- Services are pure functions — they receive data and return data.
- No `Request`, `Response`, or `NextResponse` objects in services.
- Services must import only from `backend/models/`, `backend/db/`, and `shared/`.
- Services must `await` all async operations and propagate errors with `throw`.
- Services must **never** call Cloudinary or n8n directly from business logic methods — delegate to dedicated service files (`upload.service.ts`).

---

## 5. Database Rules

- **Every Mongoose model must define indexes** relevant to its filtering and sorting patterns (see `TECH_STACK.md` for required indexes on the Car model).
- **Soft delete pattern** must be used for cars. Never hard-delete cars.
  - Models needing soft delete must have: `isActive: boolean` (default `true`) and `deletedAt: Date | null`
- **Text index** must be defined on the Car model for search functionality.
- All schema fields must have explicit `type`, `required`, and `default` where applicable.
- Timestamps (`createdAt`, `updatedAt`) must be enabled on all schemas: `{ timestamps: true }`.

---

## 6. Validation Rules

- All form inputs and API request bodies must be validated with **Zod**.
- Zod schemas live in `backend/validators/`.
- Client-side forms use the same Zod schema via `@hookform/resolvers/zod`.
- **Never trust client input.** Validate on the API side regardless of client-side validation.

---

## 7. Error Handling Rules

- All async operations must be wrapped in try/catch.
- Server-side errors must never expose stack traces to clients.
- Use descriptive error messages for client display.
- Log errors server-side with `console.error` (or a future logging service).
- API errors must return the correct HTTP status code:
  - `400` — Bad request / validation failure
  - `401` — Unauthenticated
  - `403` — Forbidden
  - `404` — Resource not found
  - `429` — Rate limit exceeded
  - `500` — Internal server error

---

## 8. Styling Rules

- Use **Tailwind CSS** utility classes exclusively.
- Do not write inline styles (`style={{ ... }}`).
- Use `clsx` + `tailwind-merge` for conditional class logic.
- Maintain a consistent design token usage — colors, spacing, and typography must follow the design system defined in `tailwind.config.ts`.
- Responsive design is mandatory. All components must work on mobile, tablet, and desktop.
- Dark mode support is optional at MVP but class names must not conflict with future dark mode toggle.

---

## 9. Import Rules

- Use absolute imports via TypeScript path aliases:
  ```ts
  // ✅ Correct
  import { CarCard } from '@/components/cars/CarCard';
  
  // ❌ Wrong
  import { CarCard } from '../../../components/cars/CarCard';
  ```
- Define path aliases in `tsconfig.json`:
  ```json
  {
    "paths": {
      "@/*": ["./frontend/*"],
      "@backend/*": ["./backend/*"],
      "@shared/*": ["./shared/*"]
    }
  }
  ```
- **Never import backend code into client components.** Mongoose models and services are server-only.

---

## 10. SEO Rules

- Every public page must export a `generateMetadata` function.
- All dynamic pages must include:
  - `title` with car name / page name
  - `description` (unique, no duplicates)
  - `openGraph` metadata (title, description, image)
  - `canonical` URL
- Schema markup (JSON-LD) must be implemented as a Server Component:
  - Car detail: `Vehicle` schema
  - Blog post: `Article` schema
  - All pages: `Organization` + `BreadcrumbList` schemas
  - FAQ page: `FAQPage` schema
- Sitemap must include all car slugs and blog slugs.
- Image `alt` attributes are mandatory on all `<Image />` components.

---

## 11. Security Rules

- **Rate limiting must be applied** to: `/api/auth`, `/api/leads`, `/api/upload`.
- **Never log sensitive data** (passwords, tokens, personal info).
- All admin routes must be protected with NextAuth session check.
- Environment variables with secrets must never be prefixed with `NEXT_PUBLIC_`.
- Input sanitization must happen before saving to MongoDB (Mongoose + Zod handles this).

---

## 12. What AI Must NEVER Do

```
❌ Never use `any` type
❌ Never create client components with data fetching from MongoDB/Mongoose
❌ Never bypass Zod validation in API routes
❌ Never write business logic in Route Handlers (only thin orchestration)
❌ Never add new npm packages without updating TECH_STACK.md and creating a DECISIONS.md entry
❌ Never use ISR (Incremental Static Regeneration) for car or blog pages
❌ Never store secrets in .env.local and commit to git
❌ Never hard-delete cars — always soft delete
❌ Never duplicate Zod schemas — share them via backend/validators/
❌ Never import Mongoose models in Client Components
❌ Never use relative imports — only path aliases
❌ Never generate placeholder or lorem ipsum content
❌ Never skip error handling in async functions
❌ Never add features not listed in PROJECT.md without explicit instruction
❌ Never implement: payments, bookings, AI assistant, multi-language, RBAC, Redis, Meilisearch
❌ Never use inline styles
❌ Never skip accessibility attributes (alt, aria-label, etc.)
```
