# PROJECT.md — SivamCars Product Definition

## Product Name
**SivamCars**

## Product Type
Single-dealership used car showcase and lead generation platform.

---

## 1. Product Description

SivamCars is a professional, SEO-first automotive listing website for a single used car dealership. It is designed to:

- Present the dealership's used car inventory in a visually compelling and trust-building manner
- Enable prospective buyers to browse, filter, and explore detailed car listings
- Capture inbound leads through contact forms, sell-your-car forms, and loan pre-approval forms
- Allow the dealership admin to manage the entire inventory, content, and homepage sections dynamically
- Rank prominently in local search results through SEO, AEO, GEO, and AIO optimization

This is **not** a marketplace. It does not support multiple dealers, public user accounts, bookings, payments, or AI assistants.

---

## 2. Target Users

### Primary Users — Public (Car Buyers)
- Local used car buyers searching for reliable, affordable vehicles
- Users arriving via Google Search (local SEO traffic)
- Users who want to compare car options, check prices, and contact the dealer

### Secondary Users — Admin (Dealership Owner)
- Single admin who manages inventory, leads, blog, and homepage content
- No public user accounts exist
- No wishlist, no saved searches, no user profiles

---

## 3. Goals

### Business Goals
- Establish a professional online presence for the dealership
- Drive qualified local leads through the website
- Reduce dependency on third-party listing platforms (e.g., OLX, CarDekho)
- Build long-term organic search dominance through SEO

### Technical Goals
- Build a maintainable, scalable codebase that any developer can work on
- Ensure zero-downtime deployments via Vercel
- Deliver fast, server-rendered pages with perfect Core Web Vitals
- Build an admin system that is intuitive and complete

---

## 4. Feature Scope

### 4.1 Public Features

#### Homepage
- Hero section (admin-controlled content: headline, subheadline, CTA, background image)
- Featured Cars section (admin curates which cars appear)
- Browse by Brand section
- Browse by Body Type section
- Blog preview section
- Testimonials section (admin-managed)
- FAQ section (admin-managed)
- Navbar with: Logo, About, Cars, Blog, Sell Car, Loan, Contact
- Search bar in navbar (searches by name, brand, model)

#### Car Listing Page (`/cars`)
- Grid view of all available cars
- Filter sidebar: Price range, Brand, Year, KM driven, Fuel type, Body type, Transmission
- Sort options: Lowest KM, Newest First, Price Low to High, Price High to Low
- Pagination (configurable page size)
- "No Cars Found" state with helpful messaging

#### Car Detail Page (`/cars/[slug]`)
- Full car display: Name, Price, Year, Brand, KM, Fuel, Body type, Transmission, Registration, Number of owners
- Rich description
- Dynamic Features section (key-value pairs, admin defined)
- Dynamic Specifications section (key-value pairs, admin defined)
- Dynamic Key Information section (key-value pairs, admin defined)
- Dynamic Stats & Performance section (key-value pairs, admin defined)
- Benefits & add-ons (admin defined)
- Image slider (multiple images from Cloudinary)
- Video section (embedded or Cloudinary video)
- EMI Calculator (pre-filled with car price)
- Contact/Enquiry form
- Price Negotiation form
- Similar cars section

#### Sell Your Car Page (`/sell`)
- Lead capture form: Name, Phone, Email, Car make/model/year, KM, Description
- Form submission triggers n8n webhook

#### EMI Calculator Page (`/emi-calculator`)
- Standalone calculator
- Principal amount, interest rate, tenure inputs
- Monthly EMI result with breakdown

#### Loan Pre-Approval Page (`/loan`)
- Lead capture form: Name, Phone, Income, Loan amount, Employment type
- Form submission triggers n8n webhook

#### Blog (`/blog`, `/blog/[slug]`)
- Blog listing page with pagination
- Individual blog post page
- Admin-managed content
- Full SEO optimization with Article schema

#### Static Pages
- `/about` — About the dealership
- `/contact` — Contact details and form

---

### 4.2 Admin Features (Protected — `/admin`)

- **Authentication**: NextAuth.js, single admin user, seeded via script
- **Car Management**: Create, Edit, Delete, Soft-delete, Mark as Sold
- **Image Upload**: Multiple images per car via Cloudinary
- **Video Upload**: Video per car via Cloudinary
- **Dynamic Masters**: Create/manage Brands, Body Types, Fuel Types, Specification Fields
- **Homepage Management**: Edit Hero, Featured Cars, Testimonials, FAQ sections
- **Blog Management**: Create, Edit, Delete blog posts
- **Lead Inbox**: View all leads from contact, sell car, loan forms
- **Analytics Dashboard**: Page views, top pages, traffic source (via GA Reporting API)
- **Audit Log**: Basic log of car edits and deletions

---

## 5. Non-Goals (Explicitly Excluded)

The following are **intentionally excluded** and must never be implemented:

| Feature | Reason |
|---|---|
| Payments / Checkout | Not required for lead-gen model |
| Booking / Test Drive | Not required at this scale |
| Public User Accounts | Not required, increases complexity |
| Wishlist | No user accounts |
| AI Assistant (chatbot) | Not in scope |
| Multi-language | English only |
| Multi-role admin | Single admin only |
| Redis / Caching layer | Not needed at current scale |
| Meilisearch / Elasticsearch | MongoDB text index is sufficient |
| Separate Express backend | Next.js Route Handlers are sufficient |
| Phone OTP login | Not needed |
| Multi-dealer / SaaS | Single dealer only |
| Mobile app | Not planned |
| Public API | Not planned |
| Docker | Not needed for Vercel deployment |
| Multi-tenant | Not required |

---

## 6. Target Scale

| Dimension | Value |
|---|---|
| Car inventory | 30–50 initially, max 100 |
| Concurrent users | < 100 |
| Traffic type | Local SEO, organic |
| Admin users | 1 (single dealer owner) |
| Environments | Development, Production |
| Uptime expectation | 99.9% (Vercel managed) |

---

## 7. Success Metrics

- Google PageSpeed score > 90 (mobile and desktop)
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Appears in Google local car searches within 3 months
- Admin can manage inventory without technical help
- Lead forms functional with n8n notifications within 24 hours of setup
