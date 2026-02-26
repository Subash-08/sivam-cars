# TASKS.md — SivamCars Project Roadmap

## Overview

This document defines the phased delivery roadmap for SivamCars. Each phase builds on the previous and delivers a production-ready increment.

---

## Phase 0 — Project Setup (Foundation)

> **Goal:** Full project scaffolding and configuration. No application code yet.

- [ ] Initialize Next.js 14+ project with TypeScript strict mode
- [ ] Configure Tailwind CSS and Shadcn/ui
- [ ] Configure TypeScript path aliases (`@/*`, `@backend/*`, `@shared/*`)
- [ ] Setup Mongoose connection singleton (`backend/db/connect.ts`)
- [ ] Configure NextAuth.js with credentials provider
- [ ] Connect to MongoDB Atlas
- [ ] Configure Cloudinary SDK
- [ ] Setup environment variables (`.env.local` with all required vars)
- [ ] Create `backend/scripts/seed-admin.ts` and test admin seeding
- [ ] Setup ESLint + Prettier with project-level config
- [ ] Setup `.gitignore` per specification
- [ ] Initialize GitHub repository
- [ ] Connect Vercel to GitHub for auto-deploy
- [ ] Deploy skeleton to Vercel (empty, no pages) — confirm pipeline works

---

## Phase 1 — MVP: Core Inventory and Leads

> **Goal:** Public users can browse cars and submit leads. Admin can manage inventory.

### 1.1 — Data Layer
- [ ] Implement all Mongoose models: `Car`, `Brand`, `BodyType`, `FuelType`, `Lead`, `Admin`, `AuditLog`
- [ ] Define all indexes on `Car` model (brand, price, year, fuel, body, transmission, text)
- [ ] Implement Zod validators: `car.validator.ts`, `lead.validator.ts`
- [ ] Implement `car.service.ts` (getAll, getBySlug, getFeatured, getSimilar, create, update, softDelete, markSold)
- [ ] Implement `lead.service.ts` (create, getAll, markRead)

### 1.2 — API Layer
- [ ] `GET /api/cars` — filtered, sorted, paginated
- [ ] `GET /api/cars/[slug]`
- [ ] `GET /api/cars/featured`
- [ ] `GET /api/cars/similar/[slug]`
- [ ] `POST /api/admin/cars` (admin only)
- [ ] `PUT /api/admin/cars/[id]` (admin only)
- [ ] `DELETE /api/admin/cars/[id]` (soft delete, admin only)
- [ ] `PATCH /api/admin/cars/[id]/sold` (admin only)
- [ ] `GET /api/brands` and `POST /api/admin/brands`
- [ ] `GET /api/body-types` and `POST /api/admin/body-types`
- [ ] `GET /api/fuel-types` and `POST /api/admin/fuel-types`
- [ ] `POST /api/leads/contact` (with rate limiting + n8n webhook)
- [ ] `POST /api/leads/sell` (with rate limiting + n8n webhook)
- [ ] `POST /api/leads/loan` (with rate limiting + n8n webhook)
- [ ] `POST /api/upload` (Cloudinary, admin only)

### 1.3 — Public Frontend
- [ ] Root layout with Navbar, Footer, Google Analytics 4 script
- [ ] Homepage (SSR): Hero, Featured Cars, Browse by Brand, Browse by Body Type
- [ ] Car Listing Page (`/cars`) with filters, sorting, pagination
- [ ] "No Cars Found" state with user-friendly messaging
- [ ] Car Detail Page (`/cars/[slug]`) with full details, image slider, EMI calculator, contact form, similar cars
- [ ] Sell Your Car Page (`/sell`) with lead form
- [ ] Loan Pre-Approval Page (`/loan`) with lead form
- [ ] EMI Calculator Page (`/emi-calculator`)
- [ ] About Page (`/about`)
- [ ] Contact Page (`/contact`) with contact form

### 1.4 — SEO Implementation
- [ ] `generateMetadata` on every public page
- [ ] Vehicle schema (JSON-LD) on car detail pages
- [ ] Organization schema on homepage
- [ ] BreadcrumbList schema on all pages
- [ ] Dynamic sitemap.xml including all car slugs
- [ ] Robots.txt

### 1.5 — Admin Panel (Inventory Management)
- [ ] Admin login page (`/admin/login`)
- [ ] Admin dashboard with summary stats
- [ ] Car list with search, filter, and sort
- [ ] Car create form (with image upload, dynamic fields)
- [ ] Car edit form
- [ ] Soft delete and restore
- [ ] Mark as sold toggle
- [ ] Brand management page
- [ ] Body type management page
- [ ] Fuel type management page
- [ ] Leads inbox (view all leads, mark as read)

---

## Phase 2 — Content and SEO Expansion

> **Goal:** Blog system, homepage section management, testimonials, FAQs.

- [ ] Implement `Blog` Mongoose model
- [ ] Implement `blog.service.ts`
- [ ] Implement Blog API endpoints (admin CRUD + public read)
- [ ] Blog listing page (`/blog`) with pagination
- [ ] Blog detail page (`/blog/[slug]`) with Article schema
- [ ] Article schema (JSON-LD) on blog posts
- [ ] FAQ schema on relevant pages
- [ ] Admin blog management (create, edit, delete, publish/unpublish)
- [ ] Implement `HomepageSection` model
- [ ] Admin homepage section management: edit Hero, Testimonials, FAQ
- [ ] Testimonials section on homepage
- [ ] FAQ section on homepage
- [ ] Blog preview section on homepage
- [ ] Update sitemap to include blog slugs

---

## Phase 3 — Analytics, Polish, and Performance

> **Goal:** Admin analytics dashboard, performance audit, accessibility improvements.

- [ ] Integrate GA4 Reporting API in admin panel
- [ ] Admin analytics page: page views, top pages, traffic source (7d / 30d / 90d)
- [ ] Implement rate limiting on all applicable routes
- [ ] Implement basic `AuditLog` writing on car edits and deletions
- [ ] Price negotiation form on car detail page
- [ ] Performance audit (Core Web Vitals, Lighthouse > 90)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Security headers via Next.js config (`Content-Security-Policy`, `X-Frame-Options`, etc.)
- [ ] Image optimization verification (Cloudinary transformations)
- [ ] Final review of all Zod validators and error handling
- [ ] Production deployment and DNS configuration

---

## Backlog (Post Phase 3)

> These are not committed to any timeline. Document only.

- Custom admin username/password changes via admin UI
- CSV export of leads
- WhatsApp floating button on public site
- Print-friendly car detail page
- Schema.org improvements as Google algorithms evolve
