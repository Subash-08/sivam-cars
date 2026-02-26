# SivamCars — Production-Grade Used Car Showcase Platform

> A professional, SEO-first, AI-native single-dealership used car listing and lead generation website built with Next.js 14+, TypeScript, MongoDB Atlas, and Cloudinary.

---

## 🧭 Product Overview

**SivamCars** is a fully managed automotive listing platform for a single used car dealership. The platform focuses on:

- Showcasing used car inventory with rich detail pages
- Generating leads through contact, sell-your-car, and loan pre-approval forms
- Delivering SEO, AEO, GEO, and AIO-optimized pages for maximum organic discoverability
- Providing a professional admin dashboard for full inventory and content control
- Operating with zero public user accounts — pure lead-generation architecture

---

## 🏗️ Architecture Philosophy

This project follows a **Modular Monolith** pattern using **Next.js App Router** as the single fullstack runtime. All API logic lives inside Next.js Route Handlers. There is no separate backend service. This choice was made deliberately for:

- Simplicity of deployment (single Vercel project)
- Reduced operational overhead
- Faster iteration at the current scale (30–100 cars)
- Clean separation of concerns without the complexity of microservices

---

## 🛠️ Core Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Database | MongoDB Atlas |
| ORM | Mongoose |
| Auth | NextAuth.js (admin only) |
| Storage | Cloudinary |
| Validation | Zod |
| Hosting | Vercel |
| Automation | n8n (external) |
| Analytics | Google Analytics 4 |
| Styling | Tailwind CSS |

> Full stack and version details are in [`TECH_STACK.md`](./TECH_STACK.md)

---

## 📂 Repository Structure

```
SivamCars/
├── README.md
├── PROJECT.md
├── ARCHITECTURE.md
├── TECH_STACK.md
├── RULES.md
├── SKILLS.md
├── TASKS.md
├── DECISIONS.md
├── API.md
├── DB_SCHEMA.md
├── PRD.md
├── SECURITY.md
├── PERFORMANCE.md
├── TESTING.md
├── .gitignore
├── .cursor/
│   └── rules.md
├── .ai/
│   ├── context.md
│   ├── instructions.md
│   └── constraints.md
├── frontend/       ← Next.js App (App Router, all pages, components)
├── backend/        ← Route Handlers, DB models, services, validation
├── shared/         ← Shared types, utility functions, constants
└── package.json
```

---

## 🚀 AI-Native Workflow Instructions

This project is designed to be built and maintained with AI assistance. Before making any changes:

1. **Always read** `PROJECT.md` to understand the product scope
2. **Always read** `ARCHITECTURE.md` to understand folder responsibilities
3. **Always read** `RULES.md` for all coding standards and naming conventions
4. **Always read** `TECH_STACK.md` to understand allowed libraries and versions
5. **Always read** `SKILLS.md` to understand expected AI behavior
6. **Always read** `DECISIONS.md` before proposing architectural changes
7. **Never deviate** from locked decisions without explicit human approval

> For AI-specific execution protocol, refer to [`.ai/instructions.md`](./.ai/instructions.md)

---

## ⚙️ Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/sivamcars.git
cd sivamcars

# 2. Install dependencies
cd frontend
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in all values (see TECH_STACK.md for required env vars)

# 4. Seed the admin user
npx ts-node scripts/seed-admin.ts

# 5. Start the development server
npm run dev
```

---

## 🔐 Admin Access

Admin panel is available at `/admin`. Only one admin user exists. Admin credentials are seeded using the seed script. No public registration is available.

---

## 🌐 Deployment

This project deploys to **Vercel** via GitHub Actions on push to `main`. No manual deployment steps required.

- Database: MongoDB Atlas (managed, auto-backup enabled)
- Storage: Cloudinary (image and video hosting)
- Automation: n8n cloud (form notifications, WhatsApp, email alerts)

---

## 📋 Documentation Index

| Document | Purpose |
|---|---|
| [`PROJECT.md`](./PROJECT.md) | Full product description, goals, non-goals |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture, folder responsibilities |
| [`TECH_STACK.md`](./TECH_STACK.md) | Exact versions, constraints, upgrade policy |
| [`RULES.md`](./RULES.md) | Coding standards, naming conventions |
| [`SKILLS.md`](./SKILLS.md) | AI persona and behavior expectations |
| [`API.md`](./API.md) | API contract definitions |
| [`DB_SCHEMA.md`](./DB_SCHEMA.md) | High-level data entities |
| [`TASKS.md`](./TASKS.md) | Roadmap phases |
| [`DECISIONS.md`](./DECISIONS.md) | Locked architectural decisions |
| [`PRD.md`](./PRD.md) | Product requirements document |
| [`SECURITY.md`](./SECURITY.md) | Security guidelines |
| [`PERFORMANCE.md`](./PERFORMANCE.md) | Caching and optimization strategy |
| [`TESTING.md`](./TESTING.md) | Testing philosophy and strategy |

---

## 📌 Key Constraints (Do Not Violate)

- ❌ No payments
- ❌ No booking or test drive system
- ❌ No AI assistant
- ❌ No multi-language
- ❌ No multi-role (single admin only)
- ❌ No Redis
- ❌ No Meilisearch
- ❌ No separate Express/Node backend
- ❌ No ISR for public-facing car or blog pages
- ✅ SSR only for all public content
- ✅ Clean code, strict TypeScript, Zod validation on all inputs
