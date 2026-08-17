# Maybee Pop & Joy — Design System

This is the reference for how the site looks and is built. Read it before adding a new page, component, or admin screen. It documents what's actually in the code today, not an aspiration — if you change a token or pattern, update this file in the same commit.

Visual direction: **clean, minimal, whitespace-forward** — closer to loft.co.jp/en's sparse, icon+label-driven layout discipline than to a busy retail template. Maybee's own brand colors stay as-is; nothing here introduces a new hue.

---

## 1. Brand foundations

All tokens live in `src/app/globals.css` (`:root` + `@theme inline`, Tailwind v4 CSS-first — there is no `tailwind.config.ts`). Never hardcode a hex value in a component; use the token.

### Colors

| Token | Value | Use |
|---|---|---|
| `brand-red` | `#f40009` | Primary actions, hero, price accents |
| `brand-red-dark` | `#c10024` | Primary hover state |
| `brand-ink` | `#171717` | Body text, headings |
| `brand-charcoal` | `#404248` | Secondary dark surfaces (store band) |
| `brand-cream` | `#fffbf7` | Page background, alternating section wash |
| `brand-white` | `#ffffff` | Cards |
| `brand-gray` | `#6b6b6b` | Secondary/muted text |
| `brand-gray-light` | `#e9e5e1` | Borders, dividers, disabled backgrounds |
| `brand-honey` | `#ffc93c` | Sparing accent (badges, Gift Finder banner) |
| `brand-success` / `brand-success-bg` | `#2f7d4f` / `#e8f5ec` | **Status only** (e.g. Approved badge) — never decorative |
| `brand-warning` / `brand-warning-bg` | `#a16a00` / `#fff4d9` | **Status only** (e.g. Pending badge) — never decorative |

Don't introduce a new color. If a new semantic need comes up (e.g. an "info" status), add a token pair here the same way success/warning were added, not a raw Tailwind color class.

### Typography

- **Baloo 2** (`--font-display`, applied via the `.font-display` class) — display/hero text, section headings, the logo wordmark, badges. **Never body copy.**
- **Inter** (`--font-body`, default on `<body>`) — everything else: paragraphs, nav, forms, product text. Includes the `cyrillic` subset for Mongolian.
- Type scale in practice: `text-6xl`/`text-5xl` (hero H1) → `text-3xl` (page H1) → `text-2xl` (section H2) → `text-xl` (card/subsection H2/H3) → `text-sm` (body default) → `text-xs` (meta/labels). Don't introduce a size outside this scale without a reason.
- Body line-height: default Tailwind leading is fine at `text-sm`; don't tighten tracking on body text.

### Radii, elevation, motion

- `radius-card` = `0.875rem` — every card/panel/input/select.
- `radius-pill` = `999px` — every button, badge, chip, tag.
- `shadow-card` / `shadow-card-hover` — the standard resting/hover elevation for cards and product tiles. `shadow-popover` for anything that floats above content (dropdowns, menus).
- `duration-fast` (150ms) for hover/focus transitions, `duration-base` (250ms) for larger state changes, `ease-standard` as the easing curve. Don't hand-roll a different duration.

---

## 2. Spacing & layout rhythm (the LOFT-inspired part)

LOFT's site reads as clean because it says less per section and gives everything room. Concretely:

- **Containers**: `max-w-7xl` for catalog/grid pages, `max-w-5xl` for list/index content pages (Blog index, Store index), `max-w-3xl` for single-column reading content (About, FAQ, a Blog post, policy pages). Pick the narrowest one that fits the content — don't default to `max-w-7xl` for a page of paragraphs.
- **Section rhythm**: `mt-16` between major homepage/page sections. `mt-6` between a section's heading and its content. Don't introduce `mt-10`/`mt-14` one-offs — `mt-16` is the standard now.
- **One primary CTA per section.** A section either sells one action ("Read our story →") or shows content — not both plus a secondary link plus a badge. If a section has two links, one must be visually secondary (text link, not a button).
- **Sparse copy.** Section intros are 1–2 sentences, not paragraphs. If a section needs three sentences to explain itself, it's two sections.
- **Alternating surface**: cream ↔ white ↔ full-bleed brand-color-block, so adjacent sections are visually distinct without needing a rule/border between them. The hero (red), the store band (charcoal), and card sections (white) already do this — keep doing it rather than putting every section on identical background.
- **Icon+label over prose** where the content is a list of destinations, not an explanation (see the homepage's shop-by-age pills, or LOFT's 3-icon quick-nav — a card with an icon and a 2-word label beats a paragraph with an inline link).

---

## 3. Component patterns

Shared primitives live in `src/components/ui/`. Use them; don't re-write their styles inline.

| Component | File | When |
|---|---|---|
| `Button` / `ButtonLink` | `button.tsx` | Any button or internal link styled as a button. Variants: `primary` (filled red), `secondary` (outlined ink), `ghost`/`danger` (text-only link style, used for admin row actions). `buttonClassName(variant, size)` is exported for the one case that can't use `Button`/`ButtonLink` directly — an external-URI-scheme `<a>` (e.g. `tel:`) — because `Link` can't route to non-internal URLs. |
| `Card` | `card.tsx` | Any bordered white panel (`rounded-card border border-brand-gray-light bg-white shadow-card`). Don't retype this class string. |
| `Badge` | `badge.tsx` | Status pills (`success`/`warning`/`neutral`/`danger`). Never use raw `bg-green-100` etc. |
| `EmptyState` | `empty-state.tsx` | Any "no results"/"nothing here yet" state, storefront or admin. Not a bare `<p>`. |
| `Skeleton` / `ProductCardSkeleton` | `skeleton.tsx` | `loading.tsx` route segments. |
| `TextField` / `TextAreaField` | `form-field.tsx` | Every form input outside of one-off custom widgets (e.g. the star-rating picker). |

**Maps**: `src/components/store/store-map.tsx` (Leaflet + OpenStreetMap, no API key) renders a branch's location plus admin-entered nearby landmarks. It's a client component and touches `window` at import time, so it's never imported directly into a server page — go through `src/components/store/store-map-loader.tsx` (a thin `"use client"` wrapper around `next/dynamic(..., { ssr: false })`), since Next.js App Router rejects `ssr: false` dynamic imports written directly in a Server Component. Store marker = `brand-red` pin, landmark markers = `brand-ink` pin, both `L.divIcon` with inline SVG (no external marker-icon assets, sidesteps the classic Leaflet-in-bundlers icon path bug). Only render the map when real `latitude`/`longitude` exist — never a guessed pin.

**Hard constraint**: `ProductCard` (`src/components/product/product-card.tsx`) is an **async Server Component** — it calls `getLocale()`/`getTranslations()` internally. It can never be imported into a `"use client"` component tree. Client components that need product data resolve it via a server action returning plain serializable fields and render it with a plain client-safe card instead (see `recently-viewed-card.tsx` for the pattern).

---

## 4. Content & data rules

- Bilingual fields follow the `{field}_mn` / `{field}_en` convention on every table and every UI string that isn't a static nav/UI label (those go in `src/messages/{mn,en}.json`). English falls back to Mongolian when unset — never render blank.
- **Never fabricate.** No invented reviews, ratings, stats, testimonials, or business facts. `productJsonLd`'s `aggregateRating` and the homepage FAQ/Blog teasers only render when real data exists (`getReviewStats`, `getActiveFaqs`, `getPublishedPosts`) — this is a hard rule carried through the whole project, not a one-off.
- Currency: always through `formatPrice()` (`src/lib/currency.ts`), never a hand-formatted number + `₮`.
- The phone number is **inquiry-only**. No copy anywhere should imply it can be used to place an order — Maybee is in-person purchase only. See `product.callToInquire` message key and `product-cta.tsx` for the established phrasing.

---

## 5. Accessibility baseline

- Global `focus-visible` ring (`globals.css`) — 3px solid `brand-red`, 2px offset — applies to every interactive element by default. Don't override it with `outline-none` without providing an equivalent visible ring.
- Skip-link to `#main-content` exists in the root layout — keep it if you touch the layout.
- Every decorative icon gets `aria-hidden`. Every meaningful image gets real `alt` text (product images already require this via `alt_text_mn`/`alt_text_en`).
- Icon-only buttons (menu toggle, etc.) get `aria-label`.

---

## 6. Do / Don't

| Don't | Do | Why |
|---|---|---|
| `rounded-lg` on a card, input, or button | `rounded-card` (panels) / `rounded-pill` (buttons, badges) | Two radii total, not three |
| `bg-green-100 text-green-800` | `<Badge variant="success">` | Untokenized color, breaks dark-mode-readiness and consistency |
| A hand-rolled `rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark` button | `<Button>` / `<ButtonLink>` | One definition of "primary button," not N copies that drift |
| `hover:shadow-md` / `hover:shadow-lg` | `shadow-card hover:shadow-card-hover` | Consistent elevation scale |
| A local `parseFilters()`/`localized()` redefinition in a new page | Import `parseShopSearchParams` (`lib/catalog.ts`) / `localized` (`lib/utils.ts`) | One canonical implementation |
| A raw string interpolated into a Supabase `.or()` filter | Escape it (see `escapeOrValue` in `lib/catalog.ts`) or use `.eq()`/`.in()` instead | Unescaped commas/parens break or hijack the filter |

---

## 7. Proposed additions (not built — backlog)

Ideas drawn from loft.co.jp/en's site structure, scoped down to what actually fits a 2-branch physical toy retailer rather than a national chain. None of these are implemented; they're here so they're discoverable next time this file is revisited.

- **Supplier/wholesale inquiry.** LOFT has a "Product Proposals" page for vendors pitching products. A lightweight second form (or a mode toggle on `/contact`) for toy suppliers wanting Maybee to carry their products is a genuinely useful equivalent — unlike LOFT's press/media-relations form, which has no Maybee analog.
- ~~**Split store news from evergreen blog.**~~ **Done** — `blog_post.post_type` (`guide` | `news`, default `guide`), filterable via `/blog?type=guide|news` with tabs on the blog index page, managed from `/admin/blog`.
- **In-store payment methods note.** LOFT has a dedicated payment-services page. For Maybee this doesn't warrant a new route — a short "what payment methods are accepted in-store" line fits naturally into the FAQ's `ordering` category or the About page.
- **Icon+label quick-nav row on the homepage.** LOFT's homepage leads with a 3-icon row (Tax Free / FAQ / About) linking straight to key info pages. Maybee's showcase-off homepage could adopt the same pattern — About / FAQ / Store as a single icon+label row near the top — as a lighter, faster-scanning alternative to (or ahead of) the current stacked sections.
