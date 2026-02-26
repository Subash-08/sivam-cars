# PERFORMANCE.md — SivamCars Caching and Optimization Strategy

## 1. Performance Philosophy

SivamCars is a **content-first, SEO-critical platform**. Performance directly impacts search ranking and lead conversion. The goal is to achieve Google PageSpeed score ≥ 90 on both mobile and desktop and pass Core Web Vitals thresholds:

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5 seconds |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200 milliseconds |
| FCP (First Contentful Paint) | < 1.8 seconds |
| TTFB (Time to First Byte) | < 800 milliseconds |

---

## 2. Rendering Strategy for Performance

### Why SSR Without ISR

All public pages use SSR (server-side rendering) on every request. This is intentional to ensure admin changes are reflected instantly. At <100 concurrent users, the server load is trivial. TTFB must be optimized at the database and query level, not at the rendering level.

### When to Use `cache()` and `unstable_cache()`

For expensive computations that do not need per-request freshness, use Next.js `cache()`:

```ts
// Good candidate: Brand list (rarely changes)
import { cache } from 'react';
export const getBrands = cache(async () => {
  return Brand.find({ isActive: true }).lean();
});
```

**Use `cache()` for:**
- Brand list (changes only when admin adds a brand)
- Body type list (same frequency)
- Fuel type list (same frequency)

**Do NOT use `cache()` for:**
- Car listing results (must reflect live inventory)
- Car detail pages (price and sold status must be live)
- Homepage featured cars (admin can change at any time)

---

## 3. Database Performance

### Indexes (Primary Driver of Query Speed)

All performance at the data layer must come from proper indexing. See `DB_SCHEMA.md` for the full index list. Key principles:

- All filterable fields must have single-field indexes
- Sorting fields must be included in compound indexes where possible
- The text index on Car covers: name, description, brand, model
- Always use `.lean()` in Mongoose queries when you do not need Mongoose document methods (returns plain JS objects, faster)

### Query Optimization Rules
- Always specify only the fields needed (use Mongoose `.select()`)
- Never `.find()` the entire collection without a filter when displaying public pages
- Pagination must use `skip()` + `limit()` — document count queries can use `countDocuments()` separately
- Avoid `$where` JavaScript queries — they bypass indexes

---

## 4. Image Optimization

### Cloudinary Configuration
- Upload preset: `auto:good` quality, `auto:format` format (serves WebP or AVIF to modern browsers)
- Responsive breakpoints: generate multiple sizes (400, 800, 1200, 1600px)
- Car listing card image: serve at 400px width, auto format
- Car detail hero image: serve at full width, max 1600px
- Brand logos: serve at 64×64 (or 2× for retina)

### Next.js Image Component
- Use `next/image` for all images — enables automatic lazy loading, WebP conversion, and size optimization
- Always specify `width`, `height`, or `fill` prop
- Add `priority` prop to above-the-fold images (hero, first car card in listing)
- Add `loading="lazy"` on all below-the-fold images (default behavior of `next/image`)
- Configure Cloudinary domain in `next.config.ts`:
  ```ts
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  }
  ```

---

## 5. JavaScript Bundle Optimization

- Server Components generate zero client-side JavaScript by default
- Client Components are used only when required (forms, sliders, interactive filters)
- Dynamic imports (`next/dynamic`) must be used for heavy client components:
  ```ts
  const CarImageSlider = dynamic(() => import('@/components/cars/CarImageSlider'), {
    loading: () => <Skeleton className="h-64 w-full" />
  });
  ```
- The EMI calculator is a Client Component — it should be dynamically imported on the car detail page

---

## 6. Font Optimization

- Use Google Fonts via `next/font/google` — fonts are self-hosted and preloaded automatically
- Specify `display: 'swap'` to prevent invisible text during font load
- Load only the weights needed (400, 500, 600, 700)

```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400','500','600','700'] });
```

---

## 7. Core Web Vitals — Specific Mitigations

| Metric | Mitigation |
|---|---|
| LCP | Priority image loading on hero, Cloudinary CDN, pre-connect to Cloudinary origin |
| CLS | Explicit width/height on all images, skeleton loaders for async data |
| INP | Keep Client Component JS minimal, debounce filter inputs |
| TTFB | Mongoose query optimization, indexes, `.lean()` queries, connection singleton |

---

## 8. HTTP Caching

Vercel sets appropriate `Cache-Control` headers for static assets. For SSR pages, Next.js defaults to `no-cache` (must-revalidate on CDN). This aligns with our SSR-only strategy.

For static assets (fonts, icons in `/public`):
```
Cache-Control: public, max-age=31536000, immutable
```

For API routes returning master data (brands, body types):
```
Cache-Control: public, s-maxage=60, stale-while-revalidate=30
```

---

## 9. Performance Monitoring

- Google PageSpeed Insights must be run after every major deployment
- Core Web Vitals from Google Search Console must be checked monthly
- Vercel Analytics (Web Vitals) should be enabled in production to monitor real-user metrics
