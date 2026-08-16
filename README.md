# Maybee Pop & Joy — E-Commerce Platform

A bilingual (Mongolian / English) digital storefront and catalog for **Maybee Pop & Joy**, a toy and children's gift retailer in Ulaanbaatar. Built with Next.js (App Router), Supabase (Postgres, Auth, Storage), and Tailwind CSS.

**Scope note:** online ordering (cart/checkout/delivery) is intentionally out of scope for now — margins at current price points don't support delivery yet, and it's planned for much later (roughly a ~2 year horizon). The site is catalog-only: browse products, see price, stock status, and store availability, then call or visit a branch to buy. Maybee operates **two physical branches** — NEXT Plaza and Gerlug Vista — modeled as a proper multi-location system (not hardcoded), so adding a third branch later is an admin-panel action, not a code change. Still outstanding for later phases: wishlist, analytics event wiring, promo codes, notifications.

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
- **No cart/checkout/orders/payments:** removed by design (see scope note above). Purchases only happen in person — the only way to buy is to visit a branch. Product pages show price, discount, stock status, and store availability, with a "Visit Store to Buy" CTA; the phone click-to-call button is explicitly labeled for inquiries only ("Call with Questions" / "Асуулт байвал холбогдох") and must never be framed as a way to place an order.
- **Multi-branch locations:** `store_location` is a proper table (not a singleton), one row per branch — address, hours, optional phone override, map embed, coordinates. `business_info` keeps only brand-level fields (name, general phone, description, socials). `src/lib/business-info.ts` exports `getStoreLocations()` / `getStoreLocationBySlug()`; `/store` lists all branches, `/store/[branchSlug]` is a real per-branch page with its own `LocalBusiness` JSON-LD. Managed from `/admin/settings/locations`.
- **Gift Finder** (`/gift-finder`): a 3-step wizard (age → budget → interest) backed by `src/lib/collections.ts` (shared age/budget band + interest-tag definitions also used by `/shop` filters and the budget/age collection pages) and `ProductFilters.interestTags` (a Postgres `tags` array overlap query) in `src/lib/catalog.ts`.
- **Budget/age auto-collections:** dedicated SEO landing pages at `/gifts/age/[bandSlug]` and `/gifts/budget/[bandSlug]`, statically generated from the band lists in `collections.ts`, each with real (non-templated) intro copy per band.
- **Product reviews:** guest-submitted (via `createAdminClient()`, same pattern as the contact form), stored as `is_approved = false` until a staff member approves them at `/admin/reviews`. `productJsonLd` only includes `aggregateRating` when at least one approved review exists — never fabricated.
- **Blog:** `blog_post` table (`is_published`-gated, same RLS pattern as `category`), managed at `/admin/blog`. Seeded with two real, non-templated toy-shopping guide posts so `/blog` isn't empty at launch; staff can publish more from the admin panel. Each post renders `BlogPosting` JSON-LD.
- **FAQ:** `faq` table (`is_active`-gated), managed at `/admin/faq`, rendered grouped by category at `/faq` with `FAQPage` JSON-LD built only from real active rows. Seeded with the site's actual policies (in-person-only purchasing, phone is inquiry-only, no delivery yet). This is separate from the small hardcoded location Q&A block on each `/store/[branchSlug]` page, which stays branch-specific.
- **Recently viewed:** pure client-side (`localStorage`, no DB table) — up to 8 product slugs tracked per browser and shown as a rail on the product page, resolved to live product data via a server action so the display never trusts stale localStorage data for price/stock.
- **Product Showcase toggle:** `business_info.showcase_enabled` (default `false` — the catalog isn't fully stocked yet). When off, Shop/New/Best Sellers/Gift Finder/Search are hidden from the header, mobile menu, and footer, and the homepage foregrounds an About excerpt, FAQ teaser, and latest Blog posts instead of catalog sections. Catalog routes (`/shop`, `/product/[slug]`, `/gift-finder`, `/gifts/*`, `/search`) are **never redirected or blocked** — only the links pointing at them are conditional, so a direct/shared link always works. Toggle it from `/admin/settings` once the catalog is ready to feature.
- **About Us** (`/about`): admin-editable bilingual story (`business_info.about_story_mn/en`, edited at `/admin/settings`, seeded at launch from the existing business description plus the homepage's trust copy), rendered with `AboutPage` JSON-LD.
- **Design system:** brand tokens (`src/app/globals.css`) extended with a semantic success/warning pair (badges), elevation (`shadow-card`/`shadow-card-hover`), and motion tokens — still just the original red/ink/charcoal/cream/honey palette, no new hues. Shared UI primitives live in `src/components/ui/` (`Button`/`ButtonLink`, `Card`, `Badge`, `EmptyState`, `Skeleton`, `TextField`/`TextAreaField`) and are used across both the storefront and the admin panel for visual consistency.
- **301 redirects:** the `seo_redirect` table + `/admin/settings/redirects` UI let staff redirect an old product/category URL to a new one (e.g. after a slug change or a discontinued product) without a code deploy. Enforced in `src/proxy.ts`.
- **Demo data:** the catalog is seeded with ~14 clearly-fake demo products (`is_demo = true`, SKU prefix `MB-DEMO-`) so the full flow is visible without inventing real inventory. Gerlug Vista's address was provided by the user in chat (Emart-ын баруун урд талд Гэрлүг Виста хотхон, Хан-Уул дүүрэг, 18-р хороо) — verify it in `/admin/settings/locations` before launch. Replace/remove demo products from the admin panel.

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
