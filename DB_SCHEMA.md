# DB_SCHEMA.md — SivamCars Database Schema (High-Level)

> **Important:** This document defines high-level entity definitions only.
> No Mongoose implementation code here.
> See `backend/models/` for actual model files.

---

## Database

- **Provider:** MongoDB Atlas
- **Connection:** Singleton via `backend/db/connect.ts`
- **ORM:** Mongoose 8.x
- **Timestamps:** Enabled on all schemas (`createdAt`, `updatedAt` auto-managed)

---

## 1. Car

**Collection:** `cars`

The primary entity of the platform.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB auto-generated |
| `name` | String | ✅ | Full car name (e.g., "Toyota Innova Crysta 2.4 VX MT") |
| `slug` | String | ✅ | URL-safe unique identifier. Auto-generated from name. Indexed unique. |
| `brand` | String | ✅ | Denormalized brand name. Also refs Brands collection. Indexed. |
| `brandRef` | ObjectId → Brand | Optional | Reference to Brand document |
| `model` | String | ✅ | Model name (e.g., "Innova Crysta") |
| `variant` | String | Optional | Variant/trim (e.g., "2.4 VX MT") |
| `year` | Number | ✅ | Manufacturing year. Indexed. |
| `price` | Number | ✅ | Asking price in INR. Indexed. |
| `km` | Number | ✅ | Odometer reading in KM. Indexed. |
| `fuelType` | String | ✅ | Petrol / Diesel / CNG / Electric / Hybrid. Indexed. |
| `bodyType` | String | ✅ | Sedan / SUV / Hatchback / MUV / etc. Indexed. |
| `transmission` | String | ✅ | Manual / Automatic. Indexed. |
| `registration` | String | Optional | Registration number (partial, e.g., "TN 01") |
| `owners` | Number | ✅ | Number of previous owners (1, 2, 3+) |
| `color` | String | Optional | Exterior color |
| `description` | String | Optional | Rich text description for SEO |
| `images` | String[] | ✅ | Array of Cloudinary image URLs |
| `sliderVideos` | Object[] | Optional | Array of {url, publicId, order} |
| `reelVideos` | Object[] | Optional | Array of {url, publicId, order} |
| `features` | KeyValue[] | Optional | Dynamic key-value list (e.g., [{ key: "Airbags", value: "6" }]) |
| `specifications` | KeyValue[] | Optional | Dynamic spec list |
| `keyInfo` | KeyValue[] | Optional | Dynamic key information list |
| `statsPerformance` | KeyValue[] | Optional | Dynamic stats and performance |
| `benefits` | String[] | Optional | List of add-ons and benefits |
| `isFeatured` | Boolean | ✅ | Shown on homepage featured section. Default: false |
| `isSold` | Boolean | ✅ | Marks car as sold. Default: false |
| `isActive` | Boolean | ✅ | Soft delete flag. Default: true |
| `deletedAt` | Date | Optional | Populated when soft-deleted |
| `metaTitle` | String | Optional | Custom SEO title override |
| `metaDescription` | String | Optional | Custom SEO description override |
| `createdAt` | Date | Auto | Auto-managed by Mongoose |
| `updatedAt` | Date | Auto | Auto-managed by Mongoose |

### Indexes on Car
```
brand (asc)
price (asc)
year (desc)
fuelType (asc)
bodyType (asc)
transmission (asc)
isActive (asc)
isSold (asc)
isFeatured (asc)
createdAt (desc)
km (asc)
slug (unique)
{ name: "text", description: "text", brand: "text", model: "text" }
```

### Sub-type: KeyValue
```ts
{ key: string, value: string }
```

---

## 2. Brand

**Collection:** `brands`

Dynamic list of car brands managed by admin.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `name` | String | ✅ | Unique brand name (e.g., "Toyota"). Indexed unique. |
| `slug` | String | ✅ | URL-safe brand slug. Indexed unique. |
| `logoUrl` | String | Optional | Cloudinary URL of brand logo |
| `isActive` | Boolean | ✅ | Default: true |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

---

## 3. BodyType

**Collection:** `bodyTypes`

Dynamic list of car body types managed by admin.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `name` | String | ✅ | Unique body type name (e.g., "SUV"). Indexed unique. |
| `slug` | String | ✅ | Indexed unique. |
| `iconUrl` | String | Optional | Cloudinary URL of body type icon |
| `isActive` | Boolean | ✅ | Default: true |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

---

## 4. FuelType

**Collection:** `fuelTypes`

Dynamic list of fuel types managed by admin.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `name` | String | ✅ | Unique fuel type name (e.g., "Diesel"). Indexed unique. |
| `slug` | String | ✅ | Indexed unique. |
| `isActive` | Boolean | ✅ | Default: true |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

---

## 5. Blog

**Collection:** `blogs`

Admin-managed blog posts for SEO content strategy.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `title` | String | ✅ | Post title |
| `slug` | String | ✅ | URL-safe unique slug. Indexed unique. |
| `excerpt` | String | ✅ | Short description for listing and SEO meta |
| `content` | String | ✅ | Full post content (Markdown or HTML) |
| `coverImage` | String | Optional | Cloudinary image URL |
| `category` | String | Optional | Post category |
| `tags` | String[] | Optional | SEO tags |
| `author` | String | Optional | Author name (defaults to dealership name) |
| `isPublished` | Boolean | ✅ | Default: false |
| `publishedAt` | Date | Optional | Set when published |
| `metaTitle` | String | Optional | Custom SEO title |
| `metaDescription` | String | Optional | Custom SEO description |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

---

## 6. Lead

**Collection:** `leads`

All inbound leads from public forms.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `type` | String | ✅ | Enum: "contact", "sell", "loan", "negotiation" |
| `name` | String | ✅ | Submitter's name |
| `phone` | String | ✅ | Submitter's phone number |
| `email` | String | Optional | Submitter's email |
| `message` | String | Optional | Free-text message (for contact leads) |
| `carId` | ObjectId → Car | Optional | Which car triggered the lead |
| `carMake` | String | Optional | For sell-your-car leads |
| `carModel` | String | Optional | For sell-your-car leads |
| `carYear` | Number | Optional | For sell-your-car leads |
| `carKm` | Number | Optional | For sell-your-car leads |
| `loanAmount` | Number | Optional | For loan pre-approval leads |
| `income` | Number | Optional | For loan pre-approval leads |
| `employmentType` | String | Optional | For loan pre-approval leads |
| `offeredPrice` | Number | Optional | For price negotiation leads |
| `isRead` | Boolean | ✅ | Default: false. Admin marks as read. |
| `ipAddress` | String | Optional | For rate limiting audit |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

---

## 7. HomepageSection

**Collection:** `homepageSections`

Admin controls content of each homepage section.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `key` | String | ✅ | Unique section identifier: "hero", "testimonials", "faq", etc. Indexed unique. |
| `data` | Mixed | ✅ | JSON object. Schema varies by key. |
| `isActive` | Boolean | ✅ | Default: true |
| `updatedAt` | Date | Auto | |

### HomepageSection.data structure per key:

**hero:** `{ headline, subheadline, ctaText, ctaLink, backgroundImageUrl }`
**testimonials:** `{ items: [{ name, role, content, avatarUrl }] }`
**faq:** `{ items: [{ question, answer }] }`

---

## 8. Admin

**Collection:** `admins`

Single admin user. Seeded via script.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `username` | String | ✅ | Unique. Indexed. |
| `passwordHash` | String | ✅ | Bcrypt hashed password |
| `createdAt` | Date | Auto | |
| `updatedAt` | Date | Auto | |

---

## 9. AuditLog

**Collection:** `auditLogs`

Basic audit trail for car edits and deletions.

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `action` | String | ✅ | Enum: "create", "update", "delete", "sold" |
| `entityType` | String | ✅ | E.g., "Car" |
| `entityId` | ObjectId | ✅ | ID of the affected entity |
| `adminId` | ObjectId → Admin | ✅ | Which admin performed action |
| `before` | Mixed | Optional | Snapshot of data before change |
| `after` | Mixed | Optional | Snapshot of data after change |
| `createdAt` | Date | Auto | |
