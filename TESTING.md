# TESTING.md — SivamCars Testing Strategy

## 1. Testing Philosophy

> "Test the behavior, not the implementation."

SivamCars testing strategy is **pragmatic and proportional** to the project scale. We do not aim for 100% code coverage. We aim to test:
- Critical business logic (car filtering, lead submission, admin auth)
- API contracts (Route Handlers respond correctly under various inputs)
- UI flows that affect lead conversion (forms, car detail page)

---

## 2. Testing Pyramid

```
          ┌───────────────┐
          │   E2E Tests   │   ← Small number, high-value user flows
          │  (Playwright) │
          └───────┬───────┘
          ┌───────▼───────┐
          │  Integration  │   ← API route tests, DB interaction
          │   (Vitest)    │
          └───────┬───────┘
          ┌───────▼───────┐
          │  Unit Tests   │   ← Business logic, utilities, validators
          │   (Vitest)    │
          └───────────────┘
```

---

## 3. Unit Testing

**Tool:** Vitest
**Location:** `__tests__/unit/` or co-located `*.test.ts` files

### What to Unit Test

| Module | What to Test |
|---|---|
| `backend/validators/car.validator.ts` | Valid inputs pass, invalid inputs return correct Zod errors |
| `backend/validators/lead.validator.ts` | Same as above |
| `shared/utils/formatters.ts` | Price formatting (₹ INR), KM formatting, date formatting |
| `shared/utils/emiCalculator.ts` | EMI calculation formula with known inputs and outputs |
| `backend/services/car.service.ts` | Filter logic with mocked Mongoose model |
| `backend/middleware/rateLimit.ts` | Rate limit increments and blocking logic |

### Unit Test Rules
- Use Vitest's `vi.mock()` to mock Mongoose models — never hit real DB in unit tests
- Test one thing per test
- Describe blocks match the function being tested
- Test both happy path and edge cases (empty input, boundary values, null fields)

### Example Unit Test Structure
```ts
describe('car.validator', () => {
  describe('CreateCarSchema', () => {
    it('should pass with valid car data', () => { ... });
    it('should fail when name is missing', () => { ... });
    it('should fail when price is negative', () => { ... });
    it('should fail when year is in the future', () => { ... });
  });
});
```

---

## 4. Integration Testing

**Tool:** Vitest + `@testing-library/react` for Server Component testing
**Location:** `__tests__/integration/`

### What to Integration Test

| Test | Description |
|---|---|
| `GET /api/cars` | Returns filtered, paginated cars from a seeded test DB |
| `POST /api/leads/contact` | Saves lead to DB and fires the webhook (mocked) |
| `POST /api/admin/cars` | Requires session, creates car, creates audit log |
| `DELETE /api/admin/cars/[id]` | Soft deletes car, sets isActive: false |
| `POST /api/auth/signin` | Valid credentials return session; invalid return 401 |

### Integration Test Setup
- Use a separate MongoDB Atlas test database (or MongoDB Memory Server for CI)
- Seed test data before each test suite
- Clean up after each test suite
- Mock `n8n` webhook calls (never fire real webhooks in tests)

### MongoDB Memory Server
```ts
// Use @typegoose/mongodb-memory-server or 'mongodb-memory-server'
// Provides in-memory MongoDB that works without a real Atlas connection
```

---

## 5. End-to-End Testing

**Tool:** Playwright
**Location:** `e2e/`

### What to E2E Test (Priority Order)

| Flow | Priority |
|---|---|
| 1. Browse cars listing, apply filters, open car detail page | 🔴 Critical |
| 2. Submit contact enquiry form on car detail page | 🔴 Critical |
| 3. Admin login and create a new car | 🔴 Critical |
| 4. Admin soft-delete a car and confirm it disappears from listing | 🟠 High |
| 5. Submit sell-your-car form | 🟠 High |
| 6. Admin mark car as sold and confirm sold badge appears | 🟡 Medium |
| 7. EMI calculator computes correctly | 🟡 Medium |

### E2E Test Rules
- Run against the local dev server (not production)
- Use Playwright's `page.getByRole()` and `page.getByLabel()` — not CSS selectors
- Each test is independent — do not depend on previous test state
- Use Playwright's `.config.ts` to set baseURL (`http://localhost:3000`)
- Screenshots on failure (Playwright does this by default)

---

## 6. Test Commands

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run E2E tests (requires running dev server)
npm run e2e

# Run E2E tests with UI mode
npm run e2e:ui
```

---

## 7. CI/CD Test Execution

On every push to `main`:
1. GitHub Actions runs `npm run test` (unit + integration)
2. If tests pass, Vercel deployment proceeds
3. E2E tests are run post-deployment (Vercel preview URL)

---

## 8. What We Explicitly Do NOT Test

| What | Why |
|---|---|
| `next/image` rendering | Tested by Next.js team |
| NextAuth internals | Tested by NextAuth team |
| Mongoose schema saving | Use integration tests with real-ish DB instead |
| Cloudinary upload mechanics | Test the service wrapper, not Cloudinary itself |
| Google Analytics events | Manually verify via GA DebugView |
