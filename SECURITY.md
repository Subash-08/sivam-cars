# SECURITY.md — SivamCars Security Guidelines

## 1. Security Philosophy

SivamCars follows a **defense-in-depth** approach appropriate for its scale. Security measures are proportional to the risk: this is a public lead-generation website with a single admin, not a financial platform. Nonetheless, all common web vulnerabilities must be addressed.

---

## 2. Threat Model

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Brute-force admin login | Medium | High | Rate limiting on `/api/auth/signin` |
| Spam lead form submissions | High | Medium | Rate limiting on `/api/leads/*`, honeypot fields |
| Unauthorized admin access | Low | Critical | NextAuth session on all `/admin/*` routes |
| MongoDB injection | Low | High | Mongoose + Zod validation, no raw query strings |
| XSS via admin-submitted content | Medium | Medium | React escapes JSX output; sanitize HTML content fields |
| Mass file upload abuse | Medium | Medium | Rate limiting on `/api/upload` |
| Secrets in source code | Low | Critical | `.env.local` in `.gitignore`, CI/CD using Vercel env vars |
| Vercel environment variable exposure | Low | Critical | Secrets never prefixed with `NEXT_PUBLIC_` |

---

## 3. Authentication Security

### Admin Authentication
- **Provider:** NextAuth.js credentials provider
- **Password storage:** bcrypt with salt rounds ≥ 12
- **Session:** JWT stored in httpOnly cookie (managed by NextAuth)
- **Session expiry:** 24 hours
- **Login rate limiting:** Max 5 failed attempts per IP per 15 minutes → temporary block

### Admin Route Protection
- All pages under `/admin/*` redirect to `/admin/login` if no valid session
- All API routes under `/api/admin/*` return `401 Unauthorized` if no valid session
- Session check occurs server-side on every request (SSR) — not client-side only
- Use `adminGuard` middleware in all admin Route Handlers:
  ```ts
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  ```

---

## 4. Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/auth/signin` | 5 requests | 15 minutes per IP |
| `POST /api/leads/contact` | 3 requests | 10 minutes per IP |
| `POST /api/leads/sell` | 3 requests | 10 minutes per IP |
| `POST /api/leads/loan` | 3 requests | 10 minutes per IP |
| `POST /api/upload` | 20 requests | 1 hour per IP |

- Rate limiting is implemented in `backend/middleware/rateLimit.ts`
- Uses in-memory LRU map for MVP (sufficient at <100 concurrent users)
- Returns `429 Too Many Requests` with `Retry-After` header

---

## 5. Input Validation

- All API request bodies are validated with **Zod** before processing
- Mongoose schema-level validation provides a secondary layer
- No raw MongoDB query operators are accepted from client input
- String fields are trimmed and length-capped in Zod schemas
- Phone numbers are validated against E.164-like pattern for India
- Price and KM fields are validated as positive integers

---

## 6. Data Protection

### Environment Variables
- All secrets reside in `.env.local` (development) and Vercel dashboard (production)
- `.env.local` is in `.gitignore` and must never be committed
- Secret env vars must never use `NEXT_PUBLIC_` prefix (prevents client exposure)
- Required secrets: `MONGODB_URI`, `NEXTAUTH_SECRET`, `CLOUDINARY_API_SECRET`, `GOOGLE_SERVICE_ACCOUNT_JSON`

### MongoDB Security
- Connection string must use a dedicated MongoDB user with read/write access to only the SivamCars database
- Not the Atlas admin user
- IP allowlist must include only Vercel NAT IP ranges (or allow all `0.0.0.0/0` with strict app-level auth)
- MongoDB Atlas automatic backups enabled (M0 provides daily snapshots)

### Cloudinary Security
- Upload API calls happen server-side only — API secret is never exposed to clients
- Signed upload presets must be used for production
- Uploaded files are restricted to `image/*` and `video/*` MIME types

---

## 7. HTTP Security Headers

Configure in `next.config.ts`:

```ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

---

## 8. Audit Logging

Basic audit logs are written to the `AuditLog` collection for:
- Car creation
- Car updates (before/after snapshot)
- Car soft deletion
- Car sold status change

Audit logs include: action, entityType, entityId, adminId, timestamp.

Audit logs are **append-only** and must never be deleted by admin UI.

---

## 9. What Must Never Be Done

```
❌ Never store plaintext passwords
❌ Never log request bodies that may contain passwords or tokens
❌ Never expose MongoDB connection strings in client code
❌ Never trust client-side validation alone — always validate on the server
❌ Never allow HTML injection in user-submitted content without sanitization
❌ Never use * (wildcard) CORS unless explicitly required
❌ Never commit .env.local or any .env.* files to git
❌ Never expose stack traces in API error responses (production)
```
