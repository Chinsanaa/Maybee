# Maybee Pop & Joy — E-Commerce Platform

A bilingual (Mongolian / English) e-commerce platform and digital storefront for **Maybee Pop & Joy**, a toy and children's gift retailer in Ulaanbaatar. Built with Next.js (App Router), Supabase (Postgres, Auth, Storage), and Tailwind CSS.

This repo currently implements **Phase 1**: the product catalog, storefront, cart, checkout, order management, admin panel, and core SEO infrastructure. See `/root/.claude/plans/build-a-complete-production-ready-humble-plum.md`-style planning docs (or the project's issue tracker) for what's planned in later phases (Gift Finder, blog/CMS, reviews, wishlist, analytics wiring, promo codes).

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript, React Server Components)
- **Database:** Supabase Postgres (schema in `supabase` via migrations applied through the Supabase MCP tooling — see `supabase-schema` note below)
- **Auth:** Supabase Auth (admin/staff accounts only; storefront checkout is guest-only by design)
- **Storage:** Supabase Storage (`product-images`, `brand-assets` buckets)
- **Styling:** Tailwind CSS v4, `next/font` (Baloo 2 for the wordmark/display, Inter for body text)
- **i18n:** `next-intl`, locale-prefixed routing (`/mn/...` default, `/en/...`)

## Architecture notes

- **Two Supabase clients, deliberately:**
  - `src/lib/supabase/public.ts` — anon key, used for all public catalog reads (products, categories, business info). Governed entirely by Row Level Security (`is_published = true` / `is_active = true` policies) — safe to use anywhere.
  - `src/lib/supabase/server.ts` exports `createServerSupabaseClient()` (session-bound, used by the **admin panel** — admin reads/writes go through RLS policies gated by an `is_admin()` Postgres function, so the admin panel works entirely off the signed-in admin's own session) and `createAdminClient()` (service-role, used only for **guest cart/checkout writes**, since anonymous shoppers have no Supabase Auth session to attach RLS to).
  - This means: **the admin panel does not require `SUPABASE_SERVICE_ROLE_KEY`** to function. Only guest cart/checkout does.
- **Payments:** no gateway is wired up (no credentials exist yet). `src/lib/payment/` defines a `PaymentProvider` interface with one implementation, `ManualPaymentProvider` (pay in person / bank transfer, staff confirm manually in the admin panel). See the comment in `src/lib/payment/index.ts` for where a QPay (or similar) provider plugs in later.
- **301 redirects:** the `seo_redirect` table + `/admin/settings/redirects` UI let staff redirect an old product/category URL to a new one (e.g. after a slug change or a discontinued product) without a code deploy. Enforced in `src/proxy.ts`.
- **Demo data:** the catalog is seeded with ~14 clearly-fake demo products (`is_demo = true`, SKU prefix `MB-DEMO-`) so the full flow is visible without inventing real inventory. Replace/remove them from the admin panel.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Storefront: http://localhost:3000/mn (or `/en`)
Admin panel: http://localhost:3000/admin/login

To enable guest checkout locally, also set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (Supabase Dashboard → Project Settings → API → `service_role`). Without it, the storefront still browses/searches fine, but adding to cart is a no-op (logged to the server console) rather than crashing.

## Deployment

- **App:** deploy to Vercel (or any Next.js host). Set the same env vars from `.env.example` in the hosting provider's environment settings — never commit `.env.local`.
- **Database:** the Supabase project's schema is managed via SQL migrations (see the migration history in the Supabase dashboard, or re-derive from `prisma/schema.prisma`-equivalent — this project does not use Prisma at runtime; schema changes should be authored as SQL and applied via `supabase db push` or the Supabase dashboard's SQL editor).

## Admin access

The first admin account was provisioned directly against Supabase Auth (email/password). To add more staff accounts: create a Supabase Auth user (dashboard or self-serve signup once built), then insert a matching row into `public.admin_user` with `role = 'STAFF'` or `'OWNER'`.
