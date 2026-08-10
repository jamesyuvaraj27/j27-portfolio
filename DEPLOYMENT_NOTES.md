# Deployment Notes & Lessons Learned

This file documents every deployment issue hit so far and the fix, so they don't get repeated.

## 1. Prisma Client missing Windows binary
**Symptom:** `Prisma Client could not locate the Query Engine for runtime "windows"` when running locally on Windows.
**Cause:** Client was generated only for the Linux dev sandbox; Windows needs its own engine binary.
**Fix:** `prisma/schema.prisma` generator block includes both targets:
```
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "windows"]
  output        = "../src/generated/prisma-client"
}
```
Run `npx prisma generate` after any schema change, on any machine you run the app on.

## 2. Prisma `migrate deploy` fails with P3005 on Render
**Symptom:** `The database schema is not empty` (P3005) during Render build.
**Cause:** The Neon database schema was created directly via `db push` during initial setup, so there was no matching migration history. `prisma migrate deploy` requires exact migration history to match the database state — any mismatch fails the whole build.
**Fix (final, adopted):** Don't use `prisma migrate deploy` for this project. Use `prisma db push` instead, which syncs `schema.prisma` straight to the database with no history bookkeeping required.
**Render build command:**
```
npm install && npx prisma generate && npx prisma db push
```
**Rule going forward:** Only reach for real migrations (`prisma migrate dev` / `migrate deploy`) if this project ever needs versioned, reviewable schema history (e.g. multiple environments, team collaboration). For a solo project on one production database, `db push` is simpler and avoids this whole class of error.

## 3. Vercel 404 on client-side routes (`/admin/login`)
**Symptom:** Direct navigation to `/admin/login` (or any non-root route) returns 404 on Vercel.
**Cause:** Vercel looks for a literal file/route by default; it doesn't know this is a React Router SPA.
**Fix:** `frontend/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
**Rule going forward:** Any SPA (React Router, Vue Router, etc.) deployed to Vercel needs this rewrite rule from day one — add it during initial scaffolding, not after the first 404 report.

## 4. Cross-domain auth cookie not persisting (401 on `/auth/me` after login)
**Symptom:** Login appears to succeed but the app never recognizes the session; `/auth/me` returns 401.
**Cause:** Backend (`onrender.com`) and frontend (`vercel.app`) are different domains. The auth cookie needs `SameSite=None; Secure` to survive a cross-site request, and the code only sets those flags when `NODE_ENV === "production"`. `NODE_ENV` was never added to Render's environment variables.
**Fix:** Set `NODE_ENV=production` in Render's Environment tab.
**Rule going forward:** Whenever frontend and backend are deployed to *different domains*, `NODE_ENV=production` (or equivalent) must be in the checklist from the first deploy — cross-site cookies silently fail otherwise with no obvious error message.

## 5. Git `index.lock` blocking commits (Windows + VS Code + OneDrive-synced folder)
**Symptom:** `fatal: Unable to create '.git/index.lock': File exists.`
**Cause:** Multiple VS Code windows/processes had file handles open on the repo (compounded by OneDrive sync locking files).
**Fix:** Close all VS Code instances (`Stop-Process -Name Code -Force`), then delete the stale lock file, then retry.
**Rule going forward:** Close editors before running git operations from an assistant-driven session on a OneDrive-synced folder, or expect to need this fix.

## 6. Backend `.env` requires exact env var name matches
**Symptom:** Cloudinary/DB connection failures traced back to malformed env values (e.g. pasting the full `CLOUDINARY_URL=cloudinary://...` string into `CLOUDINARY_API_KEY`).
**Fix:** Env values must be the raw value only, not `KEY=value` pairs pasted into the wrong field. Frontend var name is `VITE_API_BASE_URL` (not `VITE_API_URL`) and must include the `/api` suffix, e.g. `https://j27-portfolio.onrender.com/api`.

---

## Pre-push checklist (do this before every `git push` to `main`)

1. **Run it locally first.** Start backend (`npm run dev`) and frontend (`npm run dev`) against real `.env` values and confirm the change actually works before pushing — don't push-and-pray.
2. **Schema changes:** after editing `schema.prisma`, run `npx prisma generate` and `npx prisma db push` locally against a scratch/staging check (or at minimum, mentally confirm the change is additive/safe) before pushing.
3. **New routes added to the frontend:** confirm `vercel.json` rewrite still covers them (it does, by design — no action needed unless the rewrite rule itself changes).
4. **New env vars:** add them to **both** the local `.env` file AND the Render/Vercel dashboards. A var that only exists locally will silently break production.
5. **Cross-domain concerns:** if frontend and backend domains ever change, double check `CLIENT_URL`, `CORS_ORIGINS`, and cookie `sameSite`/`secure` settings still line up.
6. **Close other editors/processes** touching the repo before running git commands, to avoid lock file issues.
