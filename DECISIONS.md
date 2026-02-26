# DECISIONS.md — SivamCars Locked Architectural Decisions

> **Purpose:** This document records all locked architectural decisions.
> These decisions MUST NOT be undone without a formal review, a new entry in this document, and explicit human approval.
> AI systems must treat all entries here as hard constraints.

---

## Decision Format

```
### [DECISION-NNN] Title
- **Status:** Locked
- **Date:** YYYY-MM-DD
- **Decision:** What was decided
- **Rationale:** Why this decision was made
- **Consequences:** What this decision enables and prevents
- **Reversal Condition:** Under what circumstances this could be reconsidered
```

---

### [DECISION-001] Next.js Fullstack — No Separate Backend
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** The entire application — frontend, API, and authentication — runs inside a single Next.js App Router project deployed to Vercel.
- **Rationale:** Current scale (30–100 cars, <100 concurrent users) does not justify the operational complexity of a separate backend service. Single deployment, single codebase, simpler maintenance.
- **Consequences:** All API logic lives in Route Handlers. No Express, Fastify, or NestJS. No microservices. Simpler CI/CD.
- **Reversal Condition:** If concurrent users exceed 1,000 sustained or if background job complexity demands a persistent Node.js runtime, this should be revisited.

---

### [DECISION-002] MongoDB Atlas with Mongoose — No SQL Database
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** MongoDB Atlas (M0 free tier) is the database. Mongoose is the ORM.
- **Rationale:** Car inventory has flexible attributes (dynamic spec fields, dynamic features). Document model maps naturally. Free tier is sufficient. Managed backups are included.
- **Consequences:** No SQL joins. All joins must be done in application code or with Mongoose populate. Mongoose provides schema validation at the ORM layer.
- **Reversal Condition:** If relational queries become complex (e.g., multi-table analytics), consider PostgreSQL. Not currently warranted.

---

### [DECISION-003] SSR Only — No ISR for Public Car or Blog Pages
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** All public-facing pages (car listing, car detail, blog, homepage) use Server-Side Rendering (SSR). Incremental Static Regeneration (ISR) is explicitly prohibited for these pages.
- **Rationale:** Admin changes (sold status, price edits, content updates) must reflect instantly. ISR introduces stale window that would show outdated inventory state to buyers. Trust is critical for lead-gen.
- **Consequences:** Pages are rendered on every request. This adds latency but eliminates stale content. At <100 concurrent users, server load is negligible.
- **Reversal Condition:** If traffic grows significantly (>1,000 req/min on listing pages) and admin changes are less frequent, consider ISR with a short revalidation (60s). Must update this decision if so.

---

### [DECISION-004] MongoDB Text Index for Search — No External Search Engine
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** Full-text search is powered by MongoDB's built-in text index on the Car collection. No Meilisearch, Elasticsearch, or Algolia.
- **Rationale:** Inventory size is 30–100 cars. MongoDB text index is free, built-in, and sufficient for this scale. External search services add cost, complexity, and sync overhead that are not justified.
- **Consequences:** Search quality is basic (keyword matching). No typo-tolerance, no faceted search refinement. Sufficient for current needs.
- **Reversal Condition:** If inventory grows beyond 500 cars or if search quality becomes a business problem, integrate Meilisearch self-hosted or Algolia.

---

### [DECISION-005] NextAuth.js Credentials Provider — Single Admin Only
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** Authentication uses NextAuth.js with a credentials provider (username + bcrypt password). A single admin user only. No public sign-up. No OAuth providers.
- **Rationale:** Single dealer, single admin. No RBAC needed. OAuth would add unnecessary provider dependency.
- **Consequences:** Admin is created via `backend/scripts/seed-admin.ts`. No self-service account management. No password reset UI in MVP.
- **Reversal Condition:** If multiple dealership users need access, introduce RBAC and potentially OAuth. Update `TECH_STACK.md` and this document.

---

### [DECISION-006] Cloudinary for All Media Storage
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** All car images and videos are stored and served via Cloudinary. No local storage, no S3, no Vercel blob.
- **Rationale:** Cloudinary provides CDN delivery, automatic format optimization (auto format, auto quality), responsive image transformations, and video hosting out of the box. Reduces frontend optimization work.
- **Consequences:** All upload logic must use `backend/services/upload.service.ts`. Images are served via Cloudinary CDN URLs. Next.js Image component must allow Cloudinary domain.
- **Reversal Condition:** If Cloudinary free tier limits become constraining (10 GB storage or 25 GB bandwidth/month), evaluate Cloudinary paid tier or migrate to AWS S3 + CloudFront.

---

### [DECISION-007] n8n for External Automation — No In-Process Email Sending
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** All form submission notifications (email, WhatsApp) are handled by an external n8n workflow triggered via webhook. No in-process email library (Nodemailer, Resend, etc.).
- **Rationale:** n8n provides a visual workflow, easy WhatsApp Business integration, and multi-step automation without writing code. The dealership UI for n8n is simpler to operate than code-based email templates.
- **Consequences:** Lead API fires a fire-and-forget webhook to n8n. If n8n is down, the lead is still saved to MongoDB, but the notification is lost. n8n errors must be monitored separately.
- **Reversal Condition:** If n8n becomes unreliable or too expensive, integrate Resend for transactional email directly in the API layer.

---

### [DECISION-008] No Redis — Next.js Cache + DB Indexing Only
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** No Redis caching layer. Caching is handled by Next.js built-in cache mechanisms and proper MongoDB indexing.
- **Rationale:** At <100 concurrent users and 30–100 car inventory, Redis adds operational complexity with no measurable benefit.
- **Consequences:** Hot queries must be optimized via indexes. Next.js `cache()` and `unstable_cache()` can be used for expensive computations.
- **Reversal Condition:** If sustained traffic exceeds 500 concurrent users or MongoDB read load becomes a bottleneck, introduce Upstash Redis.

---

### [DECISION-009] Soft Delete for Cars — Never Hard Delete
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** Cars are never hard-deleted from the database. Deletion sets `isActive: false` and `deletedAt` timestamp. All public queries filter `isActive: true`.
- **Rationale:** Preserves historical data for audit trails. Allows recovery from accidental deletion. Maintains referential integrity for leads that reference a car.
- **Consequences:** Deleted cars are invisible to the public but remain in the database. Admin can see deleted cars in a separate "Deleted Cars" view if implemented. Database storage grows over time (negligible at this scale).
- **Reversal Condition:** If regulatory requirements mandate data erasure (GDPR), implement a proper deletion workflow that anonymizes data.

---

### [DECISION-010] Vercel Hosting — Development and Production Only
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** Two environments only: Development (localhost) and Production (Vercel). No staging environment.
- **Rationale:** Small team (single admin). Staging adds overhead without benefit at this scale. Production deployments are previewed via Vercel Preview Deployments on pull requests if needed.
- **Consequences:** All testing must happen in local development before merging to main. Vercel Preview Deployments provide a staging-like capability without a dedicated environment.
- **Reversal Condition:** If the project grows to a team of 3+ developers, introduce a dedicated staging environment.

---

### [DECISION-011] No Payments, Bookings, or AI Assistant — Ever (Unless Explicitly Unlocked)
- **Status:** Locked
- **Date:** 2026-02-25
- **Decision:** The following features are permanently out of scope: payment processing, booking system, test drive scheduling, and AI chatbot/assistant.
- **Rationale:** These features were explicitly excluded in requirements. The business model is lead generation only.
- **Consequences:** Any AI system working on this codebase must refuse to implement these features without explicit human unlocking of this decision.
- **Reversal Condition:** Explicit human instruction to unlock this decision and update this document.
