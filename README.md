# J27 Portfolio CMS

A full CMS-driven business portfolio for **J27** (AI • Websites • Automation).
Everything on the public site — Hero, About, Services, Projects, Skills,
Certificates, Gallery, Pricing, Blog, Contact — is editable from `/admin`
without touching code.

Stack: **React 19 + Vite + Tailwind** (frontend) · **Express + Prisma + PostgreSQL** (backend) · **Cloudinary** (media storage).

This project fixes the one bug the old version had: uploaded photos/resumes
used to be saved to local disk, which gets wiped on every Render redeploy.
Every upload here goes straight to Cloudinary and gets a permanent URL.

---

## 1. Prerequisites

- Node.js 20+
- A free [Neon](https://neon.tech) Postgres database
- A free [Cloudinary](https://cloudinary.com) account

## 2. Set up the database (Neon)

1. Create a project at neon.tech.
2. Copy the **pooled** connection string into `DATABASE_URL`.
3. Copy the **direct** connection string into `DIRECT_URL` (Prisma migrations need this one — look for a "Connection details" toggle for the non-pooled string).

## 3. Set up Cloudinary

1. Sign up at cloudinary.com — the dashboard shows `Cloud Name`, `API Key`, `API Secret` immediately.
2. Put those three values into `backend/.env` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. Nothing else to configure — uploads are created under a `j27-portfolio/` folder in your Cloudinary media library automatically.

## 4. Backend setup

```bash
cd backend
cp .env.example .env        # then fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, Cloudinary keys
npm install
npm run prisma:migrate      # creates all tables in Neon
npm run seed                # creates your admin login + default profile/sections
npm run dev                 # http://localhost:5001
```

`JWT_SECRET` can be any long random string — e.g. run `openssl rand -hex 32`.
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` become your `/admin` login (change the password after first login is out of scope for now — do it directly in Neon or add a "change password" endpoint later).

## 5. Frontend setup

```bash
cd frontend
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:5001/api
npm install
npm run dev                 # http://localhost:5173
```

Visit `/admin/login` and sign in with the seed admin credentials.

## 6. Project structure

```
backend/
  prisma/schema.prisma   — all data models (Profile, Project, PricingPlan, BlogPost, ...)
  prisma/seed.js         — creates admin user + default profile/sections on first run
  src/config/            — env, Prisma client, Cloudinary config
  src/middleware/        — auth, Cloudinary upload, rate limiting, error handling
  src/controllers/       — one file per resource; simple ones use utils/crudFactory.js
  src/routes/            — auth, public, admin route groups

frontend/
  src/components/sections/  — one component per public section (incl. PricingSection)
  src/components/admin/     — CrudPanel (generic list/create/edit/delete) + per-page panels
  src/pages/                 — HomePage, AdminLoginPage, AdminDashboardPage
  src/lib/useContent.js      — single fetch of /api/content, respects section on/off + order
```

## 7. Adding a new content type later

Backend: add a model to `schema.prisma` → run `prisma migrate dev` → add a controller (reuse `utils/crudFactory.js` if it's simple CRUD) → wire it in `adminRoutes.js`.
Frontend admin: add one `<CrudPanel fields={...} />` block in `AdminDashboardPage.jsx` — no new page needed for simple resources.
Frontend public: add a section component + register it in `SECTION_COMPONENTS` in `HomePage.jsx`, then add a row in the CMS's Section Settings so it can be toggled on/off.

## 8. Pricing / Subscribe button

Each pricing plan has a `ctaType`:
- **SUBSCRIBE** (default) — opens a lead-capture modal, saved as a Message with `source: "pricing:<planId>"`. Use this until a payment provider is attached.
- **CONTACT** — scrolls to the Contact section.
- **EXTERNAL_LINK** — opens `ctaUrl` directly. Once you have a Stripe/Razorpay payment link, set the plan's Button Action to this and paste the link in — no code changes needed.

## 9. Known environment note

`vite build` may occasionally fail with an `EPERM` unlink error on Windows-mounted drives — this is a file-lock from the OS/antivirus on the `dist` folder, not a code issue. Delete `frontend/dist` manually (or wait a few seconds) and rebuild.
