# PRD.md — SivamCars Product Requirements Document

## Document Purpose

This PRD provides a structured summary of all functional and non-functional requirements for SivamCars. It serves as the single source of truth for what the product must do, at what quality level, and within what constraints.

---

## 1. Product Overview

| Attribute | Value |
|---|---|
| Product Name | SivamCars |
| Product Type | Used car showcase and lead generation website |
| Dealer Type | Single dealership |
| Target Market | Local used car buyers (India) |
| Revenue Model | Lead generation (not e-commerce) |
| Launch Target | Phase 1 MVP in 6–8 weeks |

---

## 2. User Personas

### Persona 1: Car Buyer (Ravi, 35)
- Searches Google for "used cars near me" or "used Toyota Innova Chennai"
- Wants to quickly compare options, see clear prices and images
- Trusts professional presentation over marketplace-style sites
- Submits enquiry if car meets criteria
- Not tech-savvy — needs intuitive navigation

### Persona 2: Admin (Dealership Owner)
- Needs to add/remove/update car inventory frequently
- Wants to see all inbound leads in one place
- Not a developer — admin UI must be self-explanatory
- Needs image/video upload to be simple and reliable

---

## 3. Functional Requirements

### FR-001: Homepage (Public)
- Must display a hero section with admin-configurable headline, subheadline, CTA button, and background image
- Must display up to 6 admin-curated featured cars
- Must display Browse by Brand section (all active brands)
- Must display Browse by Body Type section
- Must display blog preview section (latest 3 posts)
- Must display testimonials section
- Must display FAQ section
- All sections must render server-side (SSR)

### FR-002: Car Listing Page (`/cars`)
- Must display all active, non-deleted, non-sold cars in a grid layout
- Must support filtering by: Brand, Body Type, Fuel Type, Transmission, Price range, Year range, Max KM
- Must support sorting by: Lowest KM, Newest, Price Low→High, Price High→Low
- Must support pagination with configurable page size (default: 12)
- Must show "No Cars Found" state with helpful messaging when no results match
- Filters must be reflected in URL query params for shareability and SEO

### FR-003: Car Detail Page (`/cars/[slug]`)
- Must display all car fields: name, price, year, brand, KM, fuel, body type, transmission, registration, owners
- Must display rich description
- Must display dynamic features, specifications, key info, stats & performance as key-value pairs
- Must display benefits list
- Must display image slider (multiple Cloudinary images)
- Must display video section if video is available
- Must include an EMI calculator pre-filled with the car price
- Must include a contact/enquiry form
- Must include a price negotiation form
- Must display a "Similar Cars" section (same brand and body type, max 4)
- Car marked as sold must display "Sold" badge and disable lead forms
- Must include full SEO metadata and Vehicle JSON-LD schema

### FR-004: Lead Forms
- Contact form: name, phone, email (optional), message, car reference
- Sell Your Car form: name, phone, email, car make/model/year/KM/description
- Loan Pre-Approval form: name, phone, email, loan amount, income, employment type
- Price Negotiation form: name, phone, offered price, message
- All forms must validate inputs with Zod before submission
- All form submissions must save to MongoDB and trigger n8n webhook
- All lead endpoints must be rate-limited

### FR-005: Blog
- Must display a blog listing page with pagination
- Must display individual blog post pages
- Must support Article JSON-LD schema on blog posts
- Admin must be able to create, edit, delete, and publish/unpublish blog posts
- Must be included in dynamic sitemap

### FR-006: EMI Calculator
- Must accept: principal amount, interest rate (%), and loan tenure (months)
- Must output: monthly EMI and total interest payable
- Must work as a standalone page (`/emi-calculator`) and as an embedded widget on car detail pages
- Must be a pure client-side calculation (no API call)

### FR-007: Admin Panel
- Protected by NextAuth session (redirect to `/admin/login` if unauthenticated)
- Car management: Create, Read, Update, Soft Delete, Mark as Sold
- Image upload per car (multiple images, Cloudinary)
- Video upload per car (Cloudinary)
- Dynamic master data management: Brands, Body Types, Fuel Types
- Homepage section management: Hero, Testimonials, FAQ
- Blog post management
- Leads inbox with filter by type (contact, sell, loan)
- Analytics dashboard (GA4 Reporting API)
- Basic audit log for car actions

---

## 4. Non-Functional Requirements

### NFR-001: Performance
- Google PageSpeed score ≥ 90 on both mobile and desktop
- LCP < 2.5s, CLS < 0.1, FID/INP < 200ms
- Images served via Cloudinary with auto format and auto quality
- Next.js Image component used for all images

### NFR-002: SEO
- Every public page has unique title and meta description
- Vehicle schema on car detail pages
- Organization schema on homepage
- Breadcrumb schema on all pages
- FAQ schema on FAQ section
- Article schema on blog posts
- Auto-generated dynamic sitemap.xml
- Proper robots.txt

### NFR-003: Security
- Rate limiting on login, lead forms, and upload endpoints
- Admin routes protected by NextAuth session
- HTTPS enforced (Vercel default)
- No sensitive env vars prefixed with `NEXT_PUBLIC_`
- Basic audit logs for destructive admin actions

### NFR-004: Reliability
- MongoDB Atlas auto-backups enabled
- Vercel handles deployment and uptime
- Lead saves to MongoDB are primary; n8n notifications are fire-and-forget (failure of n8n must not fail lead save)

### NFR-005: Maintainability
- TypeScript strict mode throughout
- Zod validation on all API inputs
- Single Mongoose model per entity in `backend/models/`
- Business logic isolated in `backend/services/`
- No inline styles — Tailwind utility classes only

---

## 5. Constraints

| Constraint | Detail |
|---|---|
| No payments | Platform does not handle any financial transactions |
| No bookings | No test drive or appointment booking system |
| No public accounts | Zero public user registration or login |
| No AI assistant | No chatbots or AI-generated responses to users |
| No ISR | All public pages must be SSR rendered |
| Max 100 concurrent users | Architecture is optimized for this scale |
| Single admin | Only one admin account exists at any time |
| English only | No multilingual support |
