# .ai/instructions.md — SivamCars AI Execution Protocol

> **Antigravity / Cursor directive:** Follow this file strictly before writing any code.
> Begin every session with: _"Follow .ai/context.md and .ai/constraints.md strictly."_

---

## Step-by-Step AI Execution Protocol

Every time an AI assistant is asked to implement something in this project, follow this exact protocol **in order**:

---

### Step 1: Clarify the Task

- Confirm the exact feature or change requested
- Check if the feature is in scope per `PROJECT.md`
- If ambiguous, ask **one** specific clarifying question — do not assume

---

### Step 2: Read the Governing Documents

In this order:
1. `PROJECT.md` — Is this feature in scope?
2. `ARCHITECTURE.md` — Which layer and folder does this belong to?
3. `RULES.md` — Which conventions apply?
4. `TECH_STACK.md` — Which libraries are approved?
5. `DECISIONS.md` — Does this touch a locked decision?
6. `.ai/context.md` — Confirm architecture identity and import boundaries

---

### Step 3: Plan Before Implementing

State clearly:
- Which files will be created or modified
- Which **layer** each file belongs to (model / service / validator / Route Handler / component)
- What inputs and outputs the new code will have
- What errors need to be handled

Do NOT skip this step for anything beyond trivial changes.

---

### Step 4: Implement in Correct Layer Order

Always implement in this order to avoid circular imports and incomplete states:

```
1. TypeScript types      → src/types/
2. Zod validators        → src/validations/
3. Mongoose model        → src/models/         (only if new entity)
4. Service               → src/services/
5. Route Handler         → src/app/api/
6. UI Component          → src/components/
7. Page                  → src/app/
```

> ⚠️ Do NOT use old paths like `backend/validators/` or `frontend/app/api/`. The project uses `src/` throughout.

---

### Step 5: Apply All Required Non-Functionals

For every new **public-facing page**, verify:
- [ ] `generateMetadata` exported with title (<60 chars) and description (<160 chars)
- [ ] Canonical URL included via `metadataBase`
- [ ] JSON-LD schema added (Vehicle / Article / Organization / Breadcrumb as applicable)
- [ ] Exactly one `<h1>` on the page
- [ ] `alt` attributes on all `<Image />` components
- [ ] `next/image` used for all images, not `<img>`

For every new **API Route Handler**, verify:
- [ ] Zod validation on all request bodies before processing
- [ ] Calls a service — no direct Mongoose queries in route handler
- [ ] Admin guard applied if admin-only endpoint
- [ ] Rate limiting applied if public form endpoint
- [ ] Correct HTTP status code returned on error
- [ ] No raw error stack sent to client

For every new **Service**, verify:
- [ ] All read-only queries use `.lean()`
- [ ] All list queries include pagination (`skip` + `limit`)
- [ ] Errors thrown as descriptive typed errors
- [ ] No HTTP concern — just data in, data out

For every new **UI Component**, verify:
- [ ] No imports from `src/models/`, `src/services/`, or `src/lib/db.ts`
- [ ] `"use client"` only if the component truly needs browser APIs or hooks
- [ ] Empty state and error state handled
- [ ] Responsive (mobile, tablet, desktop)

---

### Step 6: Pre-Submit Mental Check

Before presenting code, mentally verify:
- [ ] Any `any` type? → Fix it
- [ ] Any `try/catch` missing in async? → Add it
- [ ] Any relative imports? → Convert to `@/` path aliases
- [ ] Business logic in a Route Handler? → Move to service
- [ ] Mongoose model imported in a Client Component? → Remove it
- [ ] ISR `revalidate` on a car or blog page? → Remove it
- [ ] Service querying without `.lean()` on a read-only query? → Add it
- [ ] Public page missing `generateMetadata`? → Add it

---

### Step 7: Present Code with Context

When showing code:
1. State the file path clearly
2. Briefly explain what the code does and why
3. List any env vars required
4. List any prerequisite files that must exist first
5. Mention what tests should be written

---

### Step 8: Adding a New Dependency

Before adding any npm package:
1. Confirm that **no existing tool** in `TECH_STACK.md` already solves the problem
2. Justify:
   - Why it is necessary
   - Why the native / existing solution is insufficient
   - Impact on bundle size (run `npm run build` and check bundle analyzer if available)
3. Update `TECH_STACK.md` with the new package, version, and reason
4. Create a new entry in `DECISIONS.md`
5. Only then install it
