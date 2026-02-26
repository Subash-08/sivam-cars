# API.md — SivamCars API Contract Definitions

> **Important:** This document defines API contracts only. No implementation here.
> All routes are Next.js App Router Route Handlers located in `frontend/app/api/`.

---

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://sivamcars.com/api`

---

## Authentication

All admin-only endpoints require a valid NextAuth session.

- Session is a JWT stored in a cookie.
- Admin routes check session via the `adminGuard` middleware.
- Unauthenticated requests to protected routes return `401 Unauthorized`.

---

## Standard Response Envelope

```ts
// Success
{
  "success": true,
  "data": T
}

// Error
{
  "success": false,
  "error": "Human readable error message",
  "details"?: ZodIssue[]   // Only present on validation errors
}
```

---

## 1. Auth Endpoints

### `POST /api/auth/signin`
- **Handler:** NextAuth.js built-in (`[...nextauth]` route handler)
- **Body:** `{ username: string, password: string }`
- **Returns:** NextAuth session token (cookie)
- **Rate limited:** Yes

### `POST /api/auth/signout`
- **Handler:** NextAuth.js built-in
- **Returns:** Clears session cookie

---

## 2. Cars Endpoints

### `GET /api/cars`
- **Access:** Public
- **Description:** Get filtered and paginated list of active (non-deleted, non-sold) cars
- **Query params:**
  ```
  brand?:        string
  bodyType?:     string
  fuelType?:     string
  transmission?: string
  minPrice?:     number
  maxPrice?:     number
  minYear?:      number
  maxYear?:      number
  maxKm?:        number
  sort?:         "km_asc" | "year_desc" | "price_asc" | "price_desc"
  page?:         number (default: 1)
  limit?:        number (default: 12)
  q?:            string (text search)
  ```
- **Returns:** `{ cars: Car[], pagination: { page, limit, total, totalPages } }`

### `GET /api/cars/[slug]`
- **Access:** Public
- **Description:** Get a single car by slug
- **Returns:** `{ car: Car }`
- **404 if:** Car not found, is deleted, or is sold and admin hasn't marked visible

### `GET /api/cars/featured`
- **Access:** Public
- **Description:** Get admin-curated featured cars for homepage
- **Returns:** `{ cars: Car[] }` (max 6)

### `GET /api/cars/similar/[slug]`
- **Access:** Public
- **Description:** Get similar cars based on brand and body type (exclude current)
- **Returns:** `{ cars: Car[] }` (max 4)

### `POST /api/admin/cars`
- **Access:** Admin only
- **Description:** Create a new car listing
- **Body:** `CreateCarInput` (see `backend/validators/car.validator.ts`)
- **Returns:** `{ car: Car }`

### `PUT /api/admin/cars/[id]`
- **Access:** Admin only
- **Description:** Update an existing car listing
- **Body:** `UpdateCarInput` (partial `CreateCarInput`)
- **Returns:** `{ car: Car }`
- **Side effect:** Creates audit log entry

### `DELETE /api/admin/cars/[id]`
- **Access:** Admin only
- **Description:** Soft-delete a car (sets `isActive: false`, `deletedAt: Date`)
- **Returns:** `{ success: true }`
- **Side effect:** Creates audit log entry

### `PATCH /api/admin/cars/[id]/sold`
- **Access:** Admin only
- **Description:** Toggle car sold status
- **Body:** `{ isSold: boolean }`
- **Returns:** `{ car: Car }`

---

## 3. Brands, Body Types, Fuel Types (Masters)

### `GET /api/brands`
- **Access:** Public
- **Description:** Get all active brands
- **Returns:** `{ brands: Brand[] }`

### `POST /api/admin/brands`
- **Access:** Admin only
- **Body:** `{ name: string, logoUrl?: string }`
- **Returns:** `{ brand: Brand }`

### `DELETE /api/admin/brands/[id]`
- **Access:** Admin only
- **Returns:** `{ success: true }`

### `GET /api/body-types`
- **Access:** Public
- **Returns:** `{ bodyTypes: BodyType[] }`

### `POST /api/admin/body-types`
- **Access:** Admin only
- **Body:** `{ name: string, iconUrl?: string }`
- **Returns:** `{ bodyType: BodyType }`

### `GET /api/fuel-types`
- **Access:** Public
- **Returns:** `{ fuelTypes: FuelType[] }`

### `POST /api/admin/fuel-types`
- **Access:** Admin only
- **Body:** `{ name: string }`
- **Returns:** `{ fuelType: FuelType }`

---

## 4. Blog Endpoints

### `GET /api/blog`
- **Access:** Public
- **Query:** `page?, limit?, category?`
- **Returns:** `{ posts: BlogPost[], pagination: Pagination }`

### `GET /api/blog/[slug]`
- **Access:** Public
- **Returns:** `{ post: BlogPost }`

### `POST /api/admin/blog`
- **Access:** Admin only
- **Body:** `CreateBlogInput` (see `backend/validators/blog.validator.ts`)
- **Returns:** `{ post: BlogPost }`

### `PUT /api/admin/blog/[id]`
- **Access:** Admin only
- **Body:** `UpdateBlogInput`
- **Returns:** `{ post: BlogPost }`

### `DELETE /api/admin/blog/[id]`
- **Access:** Admin only
- **Returns:** `{ success: true }`

---

## 5. Leads Endpoints

### `POST /api/leads/contact`
- **Access:** Public
- **Rate limited:** Yes
- **Body:** `{ name: string, phone: string, email?: string, message: string, carId?: string }`
- **Returns:** `{ success: true }`
- **Side effect:** Saves to DB, fires n8n webhook

### `POST /api/leads/sell`
- **Access:** Public
- **Rate limited:** Yes
- **Body:** `{ name: string, phone: string, email?: string, carMake: string, carModel: string, year: number, km: number, description?: string }`
- **Returns:** `{ success: true }`
- **Side effect:** Saves to DB, fires n8n webhook

### `POST /api/leads/loan`
- **Access:** Public
- **Rate limited:** Yes
- **Body:** `{ name: string, phone: string, email?: string, loanAmount: number, income: number, employmentType: string }`
- **Returns:** `{ success: true }`
- **Side effect:** Saves to DB, fires n8n webhook

### `GET /api/admin/leads`
- **Access:** Admin only
- **Query:** `type?: "contact" | "sell" | "loan"`, `page?, limit?`
- **Returns:** `{ leads: Lead[], pagination: Pagination }`

---

## 6. Upload Endpoint

### `POST /api/upload`
- **Access:** Admin only
- **Content-Type:** `multipart/form-data`
- **Body:** `{ file: File, folder?: string }`
- **Returns:** `{ url: string, publicId: string }`
- **Rate limited:** Yes
- **Handled by:** `backend/services/upload.service.ts` → Cloudinary

---

## 7. Homepage Sections Endpoints

### `GET /api/homepage`
- **Access:** Public
- **Description:** Get all homepage section content (hero, testimonials, FAQs, etc.)
- **Returns:** `{ sections: HomepageSection[] }`

### `PUT /api/admin/homepage/[section]`
- **Access:** Admin only
- **Description:** Update a specific homepage section
- **Body:** Varies by section type
- **Returns:** `{ section: HomepageSection }`

---

## 8. Analytics Endpoint

### `GET /api/admin/analytics`
- **Access:** Admin only
- **Description:** Fetch pageviews, top pages, traffic source from GA4 Reporting API
- **Query:** `range?: "7d" | "30d" | "90d"` (default: `"30d"`)
- **Returns:** `{ pageViews: number, topPages: Page[], trafficSources: Source[] }`

---

## 9. Sitemap and Robots

### `GET /sitemap.xml`
- **Handler:** `frontend/app/sitemap.ts` (Next.js built-in)
- **Returns:** Dynamic XML sitemap including all active car slugs and blog post slugs

### `GET /robots.txt`
- **Handler:** `frontend/app/robots.ts` (Next.js built-in)
- **Returns:** Robots directives allowing all crawlers, pointing to sitemap
