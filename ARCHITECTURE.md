# ARCHITECTURE.md — SivamCars System Architecture

## 1. Architecture Pattern

**Modular Monolith** using **Next.js 14+ App Router** as the single fullstack runtime.

All application logic — frontend rendering, API endpoints, authentication, and data access — resides in a single Next.js project deployed to Vercel. There is no separate backend service.

### Why Modular Monolith?
- Scale does not require microservices (30–100 cars, <100 concurrent users)
- Single Vercel deployment with zero infrastructure operations
- Faster development velocity
- Easier to maintain as a solo admin system
- Clean module boundaries prevent future complexity creep

---

## 2. High-Level System Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Browser / Client                   │
│  (Car Buyer or Admin via NextAuth-protected routes)  │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────┐
│                  Vercel Edge Network                 │
│       (CDN, SSL termination, routing, headers)       │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│         Next.js 14+ Application (App Router)         │
│                                                     │
│  ┌─────────────────┐    ┌────────────────────────┐  │
│  │  Server Pages   │    │    API Route Handlers   │  │
│  │  (SSR — always) │    │  /api/cars              │  │
│  │                 │    │  /api/leads             │  │
│  │  /              │    │  /api/blog              │  │
│  │  /cars          │    │  /api/admin/*           │  │
│  │  /cars/[slug]   │    │  /api/auth/[...nextauth]│  │
│  │  /blog          │    └────────────┬───────────┘  │
│  │  /blog/[slug]   │                 │              │
│  │  /sell          │    ┌────────────▼───────────┐  │
│  │  /loan          │    │   Service Layer         │  │
│  │  /admin/*       │    │   (Business Logic)      │  │
│  └─────────────────┘    └────────────┬───────────┘  │
│                                      │              │
│                         ┌────────────▼───────────┐  │
│                         │   Mongoose Models       │  │
│                         │   (Car, Brand, Blog,    │  │
│                         │    Lead, Admin, etc.)   │  │
│                         └────────────┬───────────┘  │
└──────────────────────────────────────┼─────────────┘
                                       │
                 ┌─────────────────────┼──────────────┐
                 │                     │              │
                 ▼                     ▼              ▼
      ┌──────────────┐     ┌──────────────┐  ┌──────────────┐
      │ MongoDB Atlas│     │  Cloudinary  │  │     n8n      │
      │ (Database)   │     │  (Storage)   │  │ (Automation) │
      └──────────────┘     └──────────────┘  └──────────────┘
```

---

## 3. Folder Structure and Responsibilities

```
SivamCars/
├── frontend/                        ← All Next.js application code
│   ├── app/                         ← App Router pages and layouts
│   │   ├── (public)/                ← Public route group (no auth)
│   │   │   ├── page.tsx             ← Homepage (SSR)
│   │   │   ├── cars/                ← Car listing and detail
│   │   │   ├── blog/                ← Blog listing and posts
│   │   │   ├── sell/                ← Sell Your Car page
│   │   │   ├── loan/                ← Loan Pre-Approval page
│   │   │   ├── emi-calculator/      ← EMI Calculator page
│   │   │   ├── about/               ← About page
│   │   │   └── contact/             ← Contact page
│   │   ├── admin/                   ← Admin panel (NextAuth protected)
│   │   │   ├── layout.tsx           ← Admin shell with sidebar
│   │   │   ├── page.tsx             ← Admin dashboard
│   │   │   ├── cars/                ← Car CRUD UI
│   │   │   ├── leads/               ← Leads inbox
│   │   │   ├── blog/                ← Blog management
│   │   │   ├── masters/             ← Brands, body types, fuel types
│   │   │   ├── homepage/            ← Homepage section management
│   │   │   └── analytics/           ← GA Reporting dashboard
│   │   ├── api/                     ← Route Handlers (backend)
│   │   │   ├── auth/[...nextauth]/  ← NextAuth handler
│   │   │   ├── cars/                ← Cars CRUD API
│   │   │   ├── brands/              ← Brands API
│   │   │   ├── blog/                ← Blog API
│   │   │   ├── leads/               ← Leads API
│   │   │   ├── homepage/            ← Homepage sections API
│   │   │   ├── upload/              ← Cloudinary upload API
│   │   │   └── analytics/           ← GA Reporting proxy
│   │   ├── layout.tsx               ← Root layout with GA, fonts
│   │   ├── sitemap.ts               ← Dynamic sitemap generation
│   │   └── robots.ts                ← Robots.txt generation
│   ├── components/                  ← Shared UI components
│   │   ├── ui/                      ← Primitives (Button, Input, etc.)
│   │   ├── layout/                  ← Navbar, Footer, AdminSidebar
│   │   ├── cars/                    ← CarCard, CarGrid, CarFilters, etc.
│   │   ├── blog/                    ← BlogCard, BlogList, etc.
│   │   ├── homepage/                ← Hero, FeaturedCars, Testimonials
│   │   ├── forms/                   ← ContactForm, SellForm, LoanForm
│   │   └── seo/                     ← SchemaOrg, Breadcrumb, MetaHead
│   ├── lib/                         ← Client-facing utilities
│   │   ├── utils.ts                 ← General utilities
│   │   ├── formatters.ts            ← Price, KM, date formatters
│   │   └── analytics.ts             ← GA event tracking helpers
│   ├── hooks/                       ← Custom React hooks
│   ├── config/                      ← Site-wide config (meta, nav)
│   └── styles/                      ← Global CSS / Tailwind config
│
├── backend/                         ← Server-only code (no client imports)
│   ├── db/                          ← MongoDB connection
│   │   └── connect.ts               ← Singleton Mongoose connection
│   ├── models/                      ← Mongoose schemas and models
│   │   ├── Car.model.ts
│   │   ├── Brand.model.ts
│   │   ├── BodyType.model.ts
│   │   ├── FuelType.model.ts
│   │   ├── Blog.model.ts
│   │   ├── Lead.model.ts
│   │   ├── HomepageSection.model.ts
│   │   ├── Testimonial.model.ts
│   │   ├── FAQ.model.ts
│   │   └── AuditLog.model.ts
│   ├── services/                    ← Business logic (no HTTP concerns)
│   │   ├── car.service.ts
│   │   ├── blog.service.ts
│   │   ├── lead.service.ts
│   │   ├── upload.service.ts        ← Cloudinary interactions
│   │   └── analytics.service.ts    ← GA Reporting API
│   ├── validators/                  ← Zod schemas for API validation
│   │   ├── car.validator.ts
│   │   ├── blog.validator.ts
│   │   └── lead.validator.ts
│   ├── middleware/                  ← Rate limiting, auth guards
│   │   ├── rateLimit.ts
│   │   └── adminGuard.ts
│   └── scripts/                     ← Utility scripts (run once)
│       └── seed-admin.ts            ← Seeds initial admin user
│
├── shared/                          ← Framework-agnostic shared code
│   ├── types/                       ← TypeScript type definitions
│   │   ├── car.types.ts
│   │   ├── blog.types.ts
│   │   ├── lead.types.ts
│   │   └── api.types.ts
│   └── constants/                   ← Shared constants
│       ├── filters.ts               ← Filter options
│       └── pagination.ts            ← Pagination defaults
│
└── package.json                     ← Workspace root
```

---

## 4. Separation of Concerns

| Concern | Location | Rule |
|---|---|---|
| UI rendering | `frontend/app/` | Server Components by default |
| Business logic | `backend/services/` | No HTTP, no response objects |
| Data access | `backend/models/` | Mongoose only, no raw queries |
| Input validation | `backend/validators/` | Zod schemas only |
| API contracts | `frontend/app/api/` | Route Handlers call services |
| Shared types | `shared/types/` | No business logic here |
| Auth | NextAuth + `backend/middleware/adminGuard.ts` | Check session in Route Handlers |

---

## 5. Rendering Strategy

| Page | Rendering | Justification |
|---|---|---|
| Homepage | SSR | Admin changes must reflect immediately |
| Car Listing | SSR | Filters and live inventory |
| Car Detail | SSR | Sold status must be instant |
| Blog List | SSR | New posts must appear instantly |
| Blog Post | SSR | Admin edits must appear instantly |
| Admin pages | SSR (protected) | Real-time data |
| EMI Calculator | CSR | Pure client computation, no DB |
| Static pages (About, Contact) | SSR | Acceptable, content rarely changes |

**No ISR is used.** This is a deliberate decision. See `DECISIONS.md`.

---

## 6. Data Flow — Car Listing Request

```
Browser → GET /cars?brand=Toyota&price=500000
         → Next.js Server Component (page.tsx)
         → Calls car.service.getFilteredCars(filters)
         → Service queries Car model with Mongoose
         → MongoDB Atlas returns results
         → Page renders server-side HTML
         → Sent to browser → Hydrated
```

---

## 7. Data Flow — Lead Submission

```
Browser → POST /api/leads { name, phone, message, carId }
         → Route Handler validates with Zod
         → Calls lead.service.createLead(data)
         → Saves to MongoDB Atlas
         → Triggers n8n webhook (fire and forget)
         → Returns { success: true }
```

---

## 8. Auth Flow

```
Admin → POST /admin/login
      → NextAuth.js credentials provider
      → Validates username + bcrypt password
      → Creates session (JWT or database session)
      → Admin redirected to /admin dashboard
      → All /admin/* routes check session
      → All /api/admin/* routes check session via adminGuard
```

---

## 9. Key Architectural Rules

1. **No client imports in backend code.** `backend/` must never import from `frontend/` or React.
2. **Services have no HTTP knowledge.** Services receive plain data and return plain data.
3. **Route Handlers are thin.** They validate input, call a service, and return a response. No business logic in Route Handlers.
4. **All public pages are Server Components by default.** Client Components only when interactivity is required.
5. **Shared types live in `shared/types/`.** No type duplication between `frontend/` and `backend/`.
6. **All API inputs are validated with Zod** before reaching the service layer.
7. **Mongoose models are defined once** in `backend/models/`.
