# Maybee Pop & Joy — E-Commerce Platform

A bilingual (Mongolian / English) digital storefront and catalog for **Maybee Pop & Joy**, a toy and children's gift retailer in Ulaanbaatar. Built with Next.js (App Router), Supabase (Postgres, Auth, Storage), and Tailwind CSS.

**Scope note:** online ordering (cart/checkout/delivery) is intentionally out of scope for now — margins at current price points don't support delivery yet, and it's planned for much later (roughly a ~2 year horizon). The site is catalog-only: browse products, see price, stock status, and store availability, then call or visit NEXT Plaza to buy. See `/root/.claude/plans/build-a-complete-production-ready-humble-plum.md`-style planning docs for what else is planned in later phases (Gift Finder, blog/CMS, reviews, wishlist, analytics wiring — and, much later, online ordering).

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript, React Server Components)
- **Database:** Supabase Postgres (schema applied via SQL migrations through the Supabase MCP tooling)
- **Auth:** Supabase Auth (admin/staff accounts only)
- **Storage:** Supabase Storage (`product-images`, `brand-assets` buckets)
- **Styling:** Tailwind CSS v4, `next/font` (Baloo 2 for the wordmark/display, Inter for body text)
- **i18n:** `next-intl`, locale-prefixed routing (`/mn/...` default, `/en/...`)

## Architecture notes

- **Two Supabase clients, deliberately:**
  - `src/lib/supabase/public.ts` — anon key, used for all public catalog reads (products, categories, business info). Governed entirely by Row Level Security (`is_published = true` / `is_active = true` policies) — safe to use anywhere.
  - `src/lib/supabase/server.ts` exports `createServerSupabaseClient()` (session-bound, used by the **admin panel** — admin reads/writes go through RLS policies gated by an `is_admin()` Postgres function, so the admin panel works entirely off the signed-in admin's own session) and `createAdminClient()` (service-role, used only for the guest **contact form**, since anonymous visitors have no Supabase Auth session to attach RLS to).
  - This means: **the admin panel does not require `SUPABASE_SERVICE_ROLE_KEY`** to function.
- **No cart/checkout/orders/payments:** removed by design (see scope note above). Product pages show price, discount, stock status, and store availability, with "Call to Order" (click-to-call) and "Visit Store" CTAs instead of Add to Cart.
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

## Deployment

- **App:** deploy to Vercel (or any Next.js host). Set the same env vars from `.env.example` in the hosting provider's environment settings — never commit `.env.local`.
- **Database:** the Supabase project's schema is managed via SQL migrations (see the migration history in the Supabase dashboard). This project does not use Prisma at runtime; schema changes should be authored as SQL and applied via the Supabase dashboard's SQL editor or MCP tooling.

## Admin access

The first admin account was provisioned directly against Supabase Auth (email/password). To add more staff accounts: create a Supabase Auth user (dashboard or self-serve signup once built), then insert a matching row into `public.admin_user` with `role = 'STAFF'` or `'OWNER'`.
