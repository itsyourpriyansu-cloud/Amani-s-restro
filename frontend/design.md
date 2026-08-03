# Amani's Kitchen — App Design System

> **Restaurant Management System (RMS) Progressive Web App**
> Customer self-order PWA + Kitchen Display System + Waiter App + Counter POS + Manager Dashboard.
> This document is the single source of truth for restyling `rms/frontend` from its current
> placeholder brand ("Mangamma Ruchulu") to **Amani's Kitchen**. It translates the brand system in
> `design.md` (the Amani's Kitchen marketing-site spec) into this app's actual token architecture,
> component library, and five role-based surfaces — it does not describe a marketing site.

---

## Table of Contents

1. [How This App Differs From the Source Brand Doc](#1-how-this-app-differs-from-the-source-brand-doc)
2. [Brand Identity](#2-brand-identity)
3. [Token Architecture](#3-token-architecture)
4. [Color Palette — New Values](#4-color-palette--new-values)
5. [Typography](#5-typography)
6. [Radius, Shadow & Spacing](#6-radius-shadow--spacing)
7. [Motion](#7-motion)
8. [Component Library Mapping](#8-component-library-mapping)
9. [Role Surfaces — Brand Intensity by App](#9-role-surfaces--brand-intensity-by-app)
10. [Assets to Replace](#10-assets-to-replace)
11. [Accessibility & PWA Notes](#11-accessibility--pwa-notes)
12. [Migration Checklist — Next Tasks](#12-migration-checklist--next-tasks)

---

## 1. How This App Differs From the Source Brand Doc

The source `design.md` describes **a single-page restaurant marketing website**: hero, story,
signature-dish carousel, menu discovery grid, gallery, testimonials, reservation modal. This
codebase is a **different product** — an in-restaurant ordering & operations system with five
distinct surfaces, already built on a mature token architecture:

| Source doc assumes | This app actually has |
|---|---|
| Static marketing page, scroll-reveal storytelling | Real-time PWA: cart, order tracking, kitchen tickets, POS, live dashboards |
| One audience (diner reading a website) | Five roles: diner (mobile), kitchen staff (tablet/TV), waiter (mobile), counter (desktop/POS), manager (desktop) |
| Ad-hoc CSS custom properties | Tailwind v4 CSS-first `@theme`, Material Design 3 semantic token naming (`--color-primary-container`, `--color-on-surface-variant`, etc.), already consumed by ~90 components |
| One flat palette | A **role-scoped override** pattern already exists: `[data-app="customer"]` overrides the base token values so the diner-facing app can carry more brand warmth while kitchen/waiter/counter/manager stay operationally neutral |
| No reservation system | No reservation flow — ordering happens at the table via QR/session, billing happens via Counter POS |

**Approach:** keep the app's existing token *names* and *architecture* exactly as they are (nothing
consuming code needs to change), and swap the *values* to Amani's Kitchen's palette, type, radius,
shadow and motion language — the same "keep the names, swap the values" pattern the codebase
already uses for the customer-app override in `src/index.css`.

---

## 2. Brand Identity

| Property | Value |
|---|---|
| **Name** | Amani's Kitchen |
| **Tagline** | "A Taste of the South, Made With Heart." |
| **Cuisine** | Authentic South Indian — traditional, heirloom, modern touch |
| **Established** | 2024 |
| **Voice** | Warm, generous, heritage-rooted, premium yet approachable |
| **Logo** | Replaces `mangamma_logo.png` / current `/logo.png` placeholder — see [§10](#10-assets-to-replace) |

App-specific identity fields not covered by the source doc (needed by `RESTAURANT_INFO` in
`src/utils/mockData.js`):

| Field | Current (placeholder) | New |
|---|---|---|
| `name` | `Mangamma Ruchulu` | `Amani's Kitchen` |
| `nativeName` | `మంగమ్మ రుచులు` (Telugu) | Drop, unless the product still needs a regional-script wordmark — confirm with product before removing `--font-telugu` / `.font-telugu` (see [§5](#5-typography)) |
| `tagline` | "A journey of tradition, served with flavour." | "A Taste of the South, Made With Heart." |
| `established` | `2014` | `2024` |
| `location` / `address` | "Address on file" | 142 Heritage Way, Charleston, SC · Gourmet Dining Quarter |
| `heroImage` | `/mangamma_hero_banner.png` | New Amani's Kitchen hero asset |

Brand voice guidance for UI copy (empty states, toasts, onboarding, receipts): warm and specific
rather than generic-corporate. E.g. prefer "Your table's biryani is on its way" over "Order status:
preparing."

---

## 3. Token Architecture

Nothing here changes structurally — this section documents the *existing* architecture so the
value swap in [§4](#4-color-palette--new-values) can be applied correctly.

```
src/index.css
├── @theme { ... }                 ← Tailwind v4 CSS-first tokens, global defaults
│    ├── raw brand scale            (--color-maroon-950…700, --color-saffron-600…100, --color-ivory, …)
│    ├── M3 semantic tokens         (--color-primary, --color-primary-container, --color-on-*, --color-surface*, …)
│    ├── status tokens              (--color-success/warning/danger/information, --color-highlight)
│    ├── meal-composition tokens    (--color-meal-*, purpose-built for dish/customization UI)
│    └── radius + type scale        (--radius-*, --text-*)
│
└── [data-app="customer"] { ... }  ← Override block, applied only inside CustomerLayout's root.
                                       Re-declares the same variable names with warmer/richer
                                       values for the diner-facing PWA only.
```

Components never reference hex values directly — they consume Tailwind utility classes generated
from these tokens (`bg-primary`, `text-on-surface-variant`, `bg-surface-container`, `border-outline-variant`,
`text-highlight`, `bg-success/10`, …). This means the entire rebrand is a **token-value edit in
`src/index.css`**, not a component rewrite. Confirmed by reading `PrimaryButton.jsx`,
`SecondaryButton.jsx`, `FoodCard.jsx`, `CategoryChip.jsx`, `BottomNavBar.jsx`, `Modal.jsx`, and
`DishBadges.jsx` — all styling is semantic-token-driven.

**Recommendation:** apply the new palette to the base `@theme` block (so kitchen/waiter/counter/manager
pick up Amani's Kitchen as their accent color too — see [§9](#9-role-surfaces--brand-intensity-by-app)),
and keep the `[data-app="customer"]` override block for the *warmer, deeper* variant used on diner-facing
screens only. Do not delete the override mechanism — it's the correct place to keep customer-app
brand intensity higher than the operational apps.

---

## 4. Color Palette — New Values

### 4.1 Core brand scale (raw utilities: `bg-maroon-800`, `text-saffron-600`, …)

| Token | Old (Mangamma) | New (Amani's Kitchen) | Notes |
|---|---|---|---|
| `--color-maroon-950` | `#4A0718` | `#42180C` | primary-dark |
| `--color-maroon-900` | `#6E0D25` | `#5B2314` | primary-hover |
| `--color-maroon-800` | `#8D1230` | `#742F1C` | **primary** |
| `--color-maroon-700` | `#A61B39` | `#8A4025` | primary, lightened ~10% |
| `--color-saffron-600` | `#E97818` | `#C89552` | gold accent |
| `--color-saffron-500` | `#F28C28` | `#D9AD72` | gold, lighter |
| `--color-saffron-100` | `#FFF0DE` | `#FBF0E1` | gold tint bg |
| `--color-ivory` | `#FFFDF9` | `#FFFFFF` | |
| `--color-warm-white` | `#FFF9F2` | `#FDFBF7` | page background |
| `--color-cream` | `#F8F0E5` | `#FAF2EF` | soft tinted surface |
| `--color-sand` | `#EBDAC6` | `#EAD3C8` | deeper tint |
| `--color-ink` | `#201714` | `#1C1310` | headings |
| `--color-text` | `#342722` | `#4A3E39` | body copy |
| `--color-muted` | `#74655D` | `#7D6F6A` | secondary/helper text |
| `--color-border` | `#E9DED3` | `#E7DAD0` | opaque approximation of `rgba(116,47,28,0.12)` |

### 4.2 M3 semantic tokens (base `@theme` — used by kitchen/waiter/counter/manager, and as the
fallback before the customer override applies)

| Token | New value | Rationale |
|---|---|---|
| `--color-primary` | `#742F1C` | Amani's Kitchen brand primary |
| `--color-primary-container` | `#F3E1DB` | soft terracotta tint, for active-state chips/nav (see `BottomNavBar` active pill) |
| `--color-on-primary` | `#FFFFFF` | |
| `--color-on-primary-container` | `#42180C` | |
| `--color-secondary` | `#C89552` | gold accent |
| `--color-secondary-container` | `#FBF0E1` | |
| `--color-on-secondary` | `#2E1C0A` | |
| `--color-on-secondary-container` | `#5C431F` | |
| `--color-tertiary` | `#7D6F6A` | muted taupe, neutral accent |
| `--color-tertiary-container` | `#EFE7E2` | |
| `--color-on-tertiary` | `#FFFFFF` | |
| `--color-on-tertiary-container` | `#1C1310` | |
| `--color-background` | `#FDFBF7` | warm off-white canvas |
| `--color-on-background` | `#1C1310` | |
| `--color-surface` | `#FFFFFF` | cards |
| `--color-surface-dim` | `#F3E9DE` | |
| `--color-surface-bright` | `#FFFFFF` | |
| `--color-surface-container-lowest` | `#FFFFFF` | |
| `--color-surface-container-low` | `#FDFBF7` | |
| `--color-surface-container` | `#FAF2EF` | |
| `--color-surface-container-high` | `#F3E1DB` | |
| `--color-surface-container-highest` | `#EAD3C8` | |
| `--color-on-surface` | `#1C1310` | |
| `--color-on-surface-variant` | `#7D6F6A` | |
| `--color-outline` | `#A9887A` | |
| `--color-outline-variant` | `#E7DAD0` | |
| `--color-surface-variant` | `#FAF2EF` | |
| `--color-surface-tint` | `#742F1C` | |

### 4.3 Status & highlight tokens

Keep these functionally distinct from the brand primary (they carry meaning — success/error/warning —
independent of brand color), but retune hue toward the warm palette and align with the source doc's
FSSAI veg/non-veg convention, which this app's `DishBadges.jsx` already implements:

| Token | New value | Notes |
|---|---|---|
| `--color-success` | `#2E7D32` | matches design.md's veg-indicator green exactly |
| `--color-on-success` | `#FFFFFF` | |
| `--color-warning` | `#B76A0B` | egg / limited-availability amber |
| `--color-on-warning` | `#1C1310` | |
| `--color-error` | `#B71C1C` | matches design.md's non-veg-indicator red; doubles as validation-error red (already how `DishBadges` uses the `error` token) |
| `--color-on-error` | `#FFFFFF` | |
| `--color-error-container` | `#F8D9D9` | |
| `--color-on-error-container` | `#5B1010` | |
| `--color-information` | `#315C9E` | unchanged — neutral, not brand-owned |
| `--color-on-info` | `#FFFFFF` | |
| `--color-highlight` | `#C89552` | gold — focus rings, active-order pulse dot, badges |
| `--color-whatsapp-action` / `--color-whatsapp-accent` | unchanged | third-party brand color, not ours to restyle |

### 4.4 `[data-app="customer"]` override — richer variant for the diner PWA only

Same token names as §4.2, deepened for the customer-facing screens (menu, cart, tracking, bill) so
the ordering experience reads as premium/editorial while kitchen/counter/manager stay utilitarian:

| Token | New value |
|---|---|
| `--color-primary` | `#742F1C` |
| `--color-primary-container` | `#F2DFD6` |
| `--color-on-primary` | `#FFFDF8` |
| `--color-on-primary-container` | `#42180C` |
| `--color-secondary` | `#5C431F` (deeper gold-brown, for secondary CTAs on cream backgrounds) |
| `--color-secondary-container` | `#FBF0E1` |
| `--color-background` | `#FDFBF7` |
| `--color-surface` | `#FFFFFF` |
| `--color-surface-container` | `#FAF2EF` |
| `--color-on-surface` | `#1C1310` |
| `--color-on-surface-variant` | `#7D6F6A` |
| `--color-outline` | `#B49C8C` |
| `--color-outline-variant` | `#E7DAD0` |
| `--color-inverse-primary` | `#E8B491` |

Carry the rest of the customer-override block's structure (fixed/dim variants, meal-composition
tokens) forward using the same hue mapping shown in §4.1–§4.3 — every `meal-*-fg` token maps to
whichever semantic color it borrows from today (icon→primary, vegetarian→success, spice→error,
preparation→warning/gold, neutral→on-surface-variant).

---

## 5. Typography

### 5.1 Font families

| Role | Family | Used where |
|---|---|---|
| **Display / Headings** | Playfair Display (600, 700, 800 + italic accent) | Customer app hero moments only: `WelcomeScreen`, restaurant name lockup on `TopAppBar` wordmark, `ThankYouScreen`, receipt header in `BillScreen`/`ReceiptPreviewScreen`, section headers on the featured/recommended dish rail (`RecommendedDishRail.jsx`) |
| **Body / UI** | Plus Jakarta Sans (300–800) | Everything else, everywhere — dish lists, buttons, chips, badges, forms, and **all of kitchen/waiter/counter/manager** (operational density needs one legible grotesque, not a display serif) |
| **Regional script** (if still in scope) | Noto Sans Telugu | Unchanged fallback — confirm with product whether `nativeName`/Telugu UI is still required before removing `--font-telugu` |

This app currently **hard-forces Inter everywhere** via a blanket CSS rule in `src/index.css`:

```css
html, body, button, input, textarea, select, h1, h2, h3, h4, h5, h6, p, span, div, a, label, .font-serif, .font-sans {
  font-family: 'Inter', ...;
}
```

That rule must be relaxed (drop the universal override, or scope it to `.font-sans` only) before
`font-serif`/Playfair can actually render anywhere — right now `--font-serif` is defined as Inter
too, so heading/body are visually identical. This is the single most important CSS fix for the
rebrand to be visible at all.

### 5.2 Type scale mapping

The existing `--text-display-lg`, `--text-headline-lg/md`, `--text-body-lg/md`, `--text-label-md/sm`
scale stays structurally the same (sizes/line-heights are already tuned for mobile-first density) —
only the font-family and weight per tier change:

| Token | Size (desktop / mobile) | Family | Weight | Used for |
|---|---|---|---|---|
| `--text-display-lg` | 48 / 32px | Playfair Display | 700 | Welcome-screen hero headline |
| `--text-headline-lg` | 32 / 24px | Playfair Display | 700 | Section headers (Signature/Recommended rail) |
| `--text-headline-md` | 24px | Plus Jakarta Sans | 600 | Screen titles, modal titles, order-tracking headline |
| `--text-body-lg` | 18px | Plus Jakarta Sans | 400 | Lead paragraph / empty-state copy |
| `--text-body-md` | 16px | Plus Jakarta Sans | 400 | Standard body copy |
| `--text-label-md` | 14px | Plus Jakarta Sans | 600 | Buttons, nav labels, chip labels |
| `--text-label-sm` | 12px | Plus Jakarta Sans | 500 | Badges, captions, timestamps |
| Dish name (`FoodCard` `h3`) | 14.5–15.5px | Plus Jakarta Sans | 700 | Stays sans — dense list rows need a grotesque, not serif, at this size |
| Featured dish name (`RecommendedDishCard`) | 18–20px | **Playfair Display** | 700 | The one place a serif dish name works — matches design.md's signature-card treatment |
| Price (`PriceTag`) | 15–16px | Plus Jakarta Sans | 800 (extrabold) | Keep sans + extrabold for scannability in dense rows; reserve Playfair-numeral pricing for receipts/bill totals only |
| Eyebrow / section labels | 0.82rem | Plus Jakarta Sans | 700, uppercase, `letter-spacing: 0.22em` | Reuse design.md's eyebrow pattern for customer-app section headers |

---

## 6. Radius, Shadow & Spacing

The app's existing radius scale is already close to the source doc's and needs **no structural
change** — only note the mapping so it's applied consistently:

| App token | Value | Source-doc equivalent |
|---|---|---|
| `--radius-small` | 10px | `--radius-sm` (6px) — app already runs slightly larger, keep as-is for touch targets |
| `--radius-medium` | 16px | `--radius-md` (12px) |
| `--radius-large` | 22px | `--radius-lg` (20px) |
| `--radius-pill` | 999px | `--radius-full` (9999px) — used for `CategoryChip`, pill buttons, nav pills |
| `--radius-card` | 18px | `FoodCard`, dish cards |

**Shadows** — retint the app's existing `shadow-soft` / `shadow-card` / `shadow-floating` utilities
in `src/index.css` (and `boxShadow` in `tailwind.config.js`) from the old maroon/black-ish rgba to
Amani's `rgba(116, 47, 28, …)` brand-tinted shadow formula:

```css
.shadow-soft     { box-shadow: 0 4px 20px -2px rgba(116, 47, 28, 0.06); }
.shadow-card     { box-shadow: 0 2px 12px rgba(116, 47, 28, 0.05); }
.shadow-floating { box-shadow: 0 10px 30px -4px rgba(116, 47, 28, 0.28); }
```

**Spacing/layout** — no change needed. This app is mobile-first and content-dense (compact dish
rows, sticky cart bars, bottom sheets) rather than the editorial full-viewport sections in the
source doc; keep existing `gap`/`padding` scales in components as-is.

---

## 7. Motion

Adopt the source doc's ease-out-expo curve as the app's standard transition, replacing ad-hoc
`duration-200`/`ease-out` usage where a Tailwind arbitrary value or a shared CSS variable is
practical:

```css
--transition-fast:   0.2s  cubic-bezier(0.16, 1, 0.3, 1);
--transition-normal: 0.35s cubic-bezier(0.16, 1, 0.3, 1);
--transition-slow:   0.5s  cubic-bezier(0.16, 1, 0.3, 1);
```

The app already uses Framer Motion for its interactive motion (`PrimaryButton`'s `whileHover`/`whileTap`,
`Modal`'s spring transition, `BottomNavBar`'s active-state transitions) — these don't need to change
mechanism, just adopt the new easing where a custom `transition` is specified, and keep spring physics
for sheet/modal enter-exit (already correct per source doc's bottom-sheet pattern).

Reuse directly, unchanged (already implemented and matches source-doc intent):
- `animate-pulse-ring` — maps to design.md's `scrollWheelPulse`, already used for active-order indicators
- `animate-marquee` — maps to design.md's continuous-motion pattern, already used by `CompactKitchenStatus`
- `prefers-reduced-motion` handling — already present in `index.css`, keep as-is

New from source doc, worth adding for customer-app hero moments only:
- Staggered fade-up entrance (`opacity:0, translateY(24px)` → `opacity:1, translateY(0)`, 0.15s-stepped
  delays) for `WelcomeScreen` content stack, matching design.md's hero entrance sequence
- Bottom-sheet staggered item entrance (`calc(var(--i) * 0.05s)` delay) for `CategoryBottomSheet` /
  `CouponClaimBottomSheet` list items, matching design.md's mobile-menu stagger

---

## 8. Component Library Mapping

Grounded in the actual components under `src/components/`, not the source doc's marketing-site
component names.

| App component | Source-doc equivalent | Treatment |
|---|---|---|
| `common/PrimaryButton.jsx` | `.btn-primary` | Keep `rounded-2xl` (16px) for dense in-flow buttons (add-to-cart, form submit); use `rounded-full` only for full-width hero CTAs (e.g. `WelcomeScreen` "Start Ordering"). Background `bg-primary`, hover via `brightness-95` (already token-driven, no change needed beyond §4 values) |
| `common/SecondaryButton.jsx` | `.btn-outline` | Already matches: transparent bg, `border-secondary`, text-secondary, hover fills `secondary-container` |
| `menu/CategoryChip.jsx` | Category Chips | Already pill-shaped (`rounded-full`), active state `bg-primary text-on-primary` — correct pattern, just inherits new token values |
| `menu/DishBadges.jsx` (`FoodTypeBadge`) | Veg/Non-Veg Indicators | Already implements the exact FSSAI square+dot pattern from design.md — inherits new `success`/`error` green/red from §4.3, no code change |
| `menu/FoodCard.jsx` | Menu Discovery Card | Keep current horizontal image-left/content-right dense layout (this app's real estate is a phone screen, not a desktop grid) — only the token colors change |
| `menu/RecommendedDishCard.jsx` + `RecommendedDishRail.jsx` | Signature Dish Card / carousel | Closest structural match to design.md's `.signature-card` — this is where Playfair Display dish names and the "Chef's Pick"-style badge treatment belong |
| `common/Modal.jsx`, `menu/CategoryBottomSheet.jsx`, `menu/CustomizationModal.jsx`, `retention/CouponClaimBottomSheet.jsx` | Mobile Menu (Bottom Sheet) | Already implements slide-up sheet with rounded top corners and backdrop blur — matches design.md's bottom-sheet spec closely; retint backdrop to `rgba(28,19,16,0.4)` per design.md's overlay color, apply the staggered item entrance from §7 |
| `layout/TopAppBar.jsx` | Site Header | Already has sticky auto-hide-on-scroll behavior; brand wordmark currently reads `RESTAURANT_INFO.name` and hardcodes `alt="Mangamma Ruchulu Brand Logo"` — both need updating (see §12). Apply Playfair Display to the wordmark span (`text-primary` already correct) |
| `layout/BottomNavBar.jsx` | — (no direct equivalent; this app is a PWA, not a marketing site) | Already uses `bg-primary-container text-primary` for the active pill — correct M3 pattern, inherits new tokens automatically. Keep glass/blur treatment (`backdropFilter: blur(16px)`), matches design.md's header blur language |
| `common/Toast.jsx` | — | Retint success/warning/error variants from §4.3, no structural change |
| `common/BillingSummary.jsx` | — (closest: pricing rows in Menu Discovery) | Use Plus Jakarta Sans throughout; reserve Playfair Display strictly for the grand-total figure to give the receipt a premium moment, matching design.md's "Prices: Playfair Display, weight 700, color-primary" rule |
| `kitchen/*`, `counter/*`, `manager/*` (KDS boards, POS views, dashboards) | Not covered by source doc at all | See §9 — brand color used as accent only, Plus Jakarta Sans throughout, no Playfair, no warm-cream backgrounds (these need neutral, high-legibility surfaces for fast scanning under time pressure) |

---

## 9. Role Surfaces — Brand Intensity by App

The app already has a "how much brand" dial via the `[data-app="customer"]` scoping mechanism.
Extend that thinking explicitly to all five roles:

| Role | Surface | Brand intensity | Rationale |
|---|---|---|---|
| **Customer** (`CustomerLayout`) | Phone, held by a diner | **Full** — warm cream backgrounds, Playfair headlines on hero/featured moments, gold highlight accents, pill CTAs | This is the only surface a guest actually sees; it should feel like the restaurant |
| **Kitchen** (`KitchenLayout`, KDS) | Wall-mounted tablet/TV, read at a glance while cooking | **Minimal** — neutral surface tokens, brand primary used only for the header bar / active-ticket accent border; status colors (success/warning/error) carry all meaning, must stay maximally distinct from brand maroon | Speed and unambiguous status reading matter more than brand warmth; a kitchen screen is not a menu |
| **Waiter** (`WaiterLayout`) | Staff phone, used while moving between tables | **Light** — brand primary for CTAs and active nav only, otherwise neutral surfaces like kitchen | Same density/speed constraints as kitchen, but slightly more brand presence since it's closer to guest-facing |
| **Counter** (`CounterLayout`/`CounterShell`) | Desktop POS at billing counter | **Light–Moderate** — brand primary for primary actions and the receipt/bill preview specifically (where Playfair Display on the restaurant name + total is appropriate, since receipts are a guest-facing artifact even though the operator's screen isn't) | POS screens are data-entry tools; over-styling them slows down cashiers |
| **Manager** (`ManagerLayout`) | Desktop dashboard | **Light** — brand primary as the chart/CTA accent color against neutral slate/zinc data-table surfaces (per the existing convention in `FRONTEND_STRUCTURAL_PROMPT.md` §6) | Analytics dashboards need color reserved for meaning (trend up/down), not brand decoration |

Practically: apply the §4.2 base-`@theme` values everywhere (so brand primary/secondary show up as
the accent color in every role), and reserve the richer §4.4 override values, warm backgrounds, and
Playfair Display **only** inside `[data-app="customer"]`.

---

## 10. Assets to Replace

| Current file | Used in | Action |
|---|---|---|
| `public/mangamma_logo.png`, `public/logo.png` | Favicon, `TopAppBar` logo, header | Replace with Amani's Kitchen logo mark |
| `public/mangamma_hero_banner.png` | `RESTAURANT_INFO.heroImage`, welcome/hero screens | Replace with Amani's Kitchen hero photography |
| `src/assets/logo.png` | Bundled logo reference | Replace |
| `src/assets/banners/mangamma_hero_banner.png`, `express_menu_banner.png`, `special_combos_banner.png` | Promo banners across menu/home screens | Replace with on-brand photography (warm, heritage-rooted per §2 voice) |
| `src/assets/categories/*.png` (biryani, curries, drinks, meals) | `VisualCategoryRail`, category icons | Can likely be kept if photography style matches; re-shoot only if visually inconsistent with new hero imagery |
| Google Fonts `<link>` in `index.html` | Currently loads Inter + Noto Sans Telugu + Material Symbols | Add Playfair Display + Plus Jakarta Sans; drop Inter once the hard-coded font-family CSS rule (§5.1) is removed; keep Noto Sans Telugu only if regional script stays in scope |

---

## 11. Accessibility & PWA Notes

Carried forward from the source doc's accessibility section, adapted to this app's real constraints:

- Keep all existing `aria-label`/`aria-expanded`/`aria-controls` patterns already present in
  `BottomNavBar`, `Modal`, `TopAppBar` — no regressions from the rebrand.
- Veg/non-veg badges already carry both `title` and `aria-label` (`DishBadges.jsx`) — preserve when
  retinting colors; verify the new green (`#2E7D32`) / red (`#B71C1C`) still meet WCAG AA contrast
  against `--color-surface` (`#FFFFFF`) — both do (5.1:1 and 5.9:1 respectively).
- Playfair Display must never be used below ~16px or for dense body copy — serif at small sizes
  hurts legibility, especially on kitchen/counter screens where it shouldn't appear at all (§9).
- This is a PWA: preserve existing `env(safe-area-inset-*)` handling in `BottomNavBar`/`TopAppBar`/
  `.customer-page`, `100dvh` usage, and the `prefers-reduced-motion` block in `index.css` — none of
  this is affected by the token/font swap, just don't regress it while editing.
- Manifest/icons (if a `manifest.json` / `manifest.webmanifest` exists under `public/`) need
  `theme_color`/`background_color` updated to the new `--color-primary` / `--color-background` so the
  OS-level PWA install icon and splash screen match the new brand — check `public/` and
  `vite.config.js` for PWA plugin config as part of the asset pass.

---

## 12. Migration Checklist — Next Tasks

In implementation order:

1. **`src/index.css`** — replace all `@theme` color values per §4.1–§4.3; replace
   `[data-app="customer"]` override values per §4.4; retint `.shadow-*` utilities per §6; relax the
   universal `font-family: 'Inter'` rule (§5.1) so `font-serif`/Playfair can render; add
   `--transition-*` variables per §7.
2. **`index.html`** — swap Google Fonts `<link>`s to Playfair Display + Plus Jakarta Sans (keep Noto
   Sans Telugu only if confirmed in-scope); update `<title>`, `<meta name="description">`, favicon
   href, and the hardcoded `bg-[#FFFDF9] text-[#201714]` inline classes on `<html>` if those hexes
   change.
3. **`tailwind.config.js`** — update `fontFamily.serif` to Playfair Display and `fontFamily.sans` to
   Plus Jakarta Sans; retint `boxShadow` values per §6.
4. **`src/utils/mockData.js`** — update `RESTAURANT_INFO` per §2's table (name, tagline, established,
   address, logo, heroImage; resolve `nativeName`/Telugu question with product first).
5. **`src/components/layout/TopAppBar.jsx`** — update hardcoded `alt="Mangamma Ruchulu Brand Logo"`
   string; confirm wordmark renders `RESTAURANT_INFO.name` (already dynamic, just needs step 4 done).
6. **Assets** — replace files listed in §10.
7. **`RecommendedDishCard.jsx` / `RecommendedDishRail.jsx`** — apply Playfair Display to dish name
   per §5.2 and §8's signature-card mapping.
8. **`common/BillingSummary.jsx`** — apply Playfair Display to the grand-total figure only, per §8.
9. **PWA manifest** (if present under `public/`) — update `theme_color`/`background_color`/icons per
   §11.
10. **Verify role isolation** — spot-check kitchen/waiter/counter/manager screens after the base
    `@theme` swap to confirm they picked up the new brand primary as an *accent* only and didn't
    inherit customer-app warmth (they shouldn't, since they're outside `[data-app="customer"]`, but
    confirm visually per §9).
