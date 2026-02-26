# TECH_STACK.md — SivamCars Technology Stack

## Guiding Principle

Every technology in this stack was chosen for a specific reason. **No technology may be added without updating this document and creating a corresponding entry in `DECISIONS.md`.**

---

## 1. Core Framework

| Technology | Version | Reason |
|---|---|---|
| **Next.js** | 14.x (App Router) | SSR, Server Components, Route Handlers, Vercel-native |
| **React** | 18.x | Required by Next.js |
| **TypeScript** | 5.x (strict mode) | Type safety, maintainability, refactoring confidence |
| **Node.js** | 20.x LTS | Required runtime for Next.js on Vercel |

### TypeScript Configuration
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

---

## 2. Database

| Technology | Version | Reason |
|---|---|---|
| **MongoDB Atlas** | Latest (M0 free tier) | Flexible schema, managed backups, easy scaling |
| **Mongoose** | 8.x | Schema definition, validation, index management |

### Required Mongoose Indexes
```
Car model indexes:
- brand (single)
- price (single)
- year (single)
- fuelType (single)
- bodyType (single)
- transmission (single)
- isActive (single)
- isSold (single)
- createdAt (descending)
- { name: 'text', description: 'text', brand: 'text' } ← Text search index
```

### MongoDB Connection
- Connection string stored in `MONGODB_URI` env variable
- Singleton pattern using module-level caching to avoid multiple connections in dev serverless
- Connection file: `backend/db/connect.ts`

---

## 3. Authentication

| Technology | Version | Reason |
|---|---|---|
| **NextAuth.js** | 4.x (v4 stable) | Next.js native, credentials provider, JWT sessions |
| **bcryptjs** | 2.x | Password hashing for admin seed |

### Auth Configuration
- Provider: Credentials (username + password)
- Session strategy: JWT
- Admin only — no public sign-up
- Session expiry: 24 hours (configurable)
- Admin user seeded via `backend/scripts/seed-admin.ts`

---

## 4. Storage

| Technology | Reason |
|---|---|
| **Cloudinary** | Image and video hosting, CDN delivery, transformations |

### Cloudinary Usage
- All car images and videos uploaded via `backend/services/upload.service.ts`
- Admin upload endpoint: `POST /api/upload`
- Transformations applied: auto format, auto quality, responsive breakpoints
- Required env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## 5. Validation

| Technology | Version | Reason |
|---|---|---|
| **Zod** | 3.x | TypeScript-first schema validation, used for API and form validation |

### Zod Usage Rules
- All `POST` and `PUT` Route Handlers must parse the request body with a Zod schema before processing
- All form submissions must be validated client-side with Zod (react-hook-form integration)
- Shared Zod schemas live in `backend/validators/`

---

## 6. Styling

| Technology | Version | Reason |
|---|---|---|
| **Tailwind CSS** | 3.x | Utility-first, fast, consistent design system |
| **clsx** | Latest | Conditional class merging |
| **tailwind-merge** | Latest | Conflict-free Tailwind class merging |

---

## 7. UI Components

| Technology | Reason |
|---|---|
| **Shadcn/ui** | Unstyled, accessible UI primitives built on Radix UI |
| **Radix UI** | Accessible primitives (Dialog, Select, etc.) |
| **Lucide React** | Icon library, tree-shakeable |

---

## 8. Forms

| Technology | Version | Reason |
|---|---|---|
| **React Hook Form** | 7.x | Performant form state management, minimal re-renders |
| **@hookform/resolvers** | Latest | Zod resolver for React Hook Form |

---

## 9. Hosting and Deployment

| Layer | Provider | Reason |
|---|---|---|
| **Application** | Vercel | Next.js native, zero-config deployment, global CDN |
| **Database** | MongoDB Atlas (M0) | Managed, auto-backup, free tier sufficient |
| **Storage** | Cloudinary | CDN-native image/video hosting |
| **Automation** | n8n (cloud or self-hosted) | External workflow automation |
| **Analytics** | Google Analytics 4 | Industry standard, free |

---

## 10. Automation

| Technology | How it's used |
|---|---|
| **n8n** | External only. Forms post to `/api/leads`, which calls n8n webhook. n8n handles: email notifications, WhatsApp alerts, CRM logging. |

### n8n Environment Variable
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
```

---

## 11. Analytics

| Technology | How it's used |
|---|---|
| **Google Analytics 4** | Script injected in root `layout.tsx`. GA Reporting API used in `/admin/analytics` to show page views, top pages, traffic source. |

### Analytics Environment Variables
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=123456789
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

---

## 12. Rate Limiting

| Technology | How it's used |
|---|---|
| **upstash/ratelimit** (or custom in-memory) | Applied to `/api/auth`, `/api/leads`, `/api/upload`. IP-based sliding window. |

> **Note:** Since Redis/Upstash is not available, use a lightweight in-memory rate limiter for the current scale. At scale, migrate to Upstash Redis.

---

## 13. Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth signing secret (32+ chars) | ✅ |
| `NEXTAUTH_URL` | Full URL of the app (https://sivamcars.com) | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `N8N_WEBHOOK_URL` | n8n webhook endpoint for form notifications | ✅ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 Measurement ID | ✅ |
| `GA_PROPERTY_ID` | GA4 Property ID for Reporting API | ✅ |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google service account for GA Reporting | ✅ |
| `ADMIN_USERNAME` | Initial admin username (seed script only) | ✅ (seed) |
| `ADMIN_PASSWORD` | Initial admin password (seed script only) | ✅ (seed) |

---

## 14. Upgrade Policy

| Concern | Rule |
|---|---|
| Next.js major version | Manual review required. Test all SSR pages, Route Handlers, and auth before upgrading. |
| Mongoose major version | Manual review required. Check for breaking schema changes. |
| NextAuth major version | Manual review required. Auth is critical — test full login flow. |
| Tailwind major version | Review class breakage. Test admin and public UI visually. |
| Other dependencies | Minor and patch upgrades via `npm update`. Review changelog before major bumps. |

---

## 15. Explicitly Excluded Technologies

| Technology | Reason Excluded |
|---|---|
| Redis | Not needed at current scale |
| Meilisearch / Elasticsearch | MongoDB text index is sufficient for 100 cars |
| Express.js | Next.js Route Handlers cover all API needs |
| Prisma | MongoDB is better served by Mongoose |
| GraphQL | REST is sufficient, adds complexity |
| Zustand / Redux | Server Components eliminate most client state needs |
| Docker | Vercel manages the container runtime |
| Stripe / Razorpay | No payments in scope |
| Socket.io | No real-time features required |
