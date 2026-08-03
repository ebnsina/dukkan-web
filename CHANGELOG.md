# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Storefront on the real API: home, category, search, product detail with variant
  selection, basket, checkout, order confirmation, order tracking, account with
  order history, and phone OTP sign-in.
- Admin: dashboard, orders with search and detail, cancel and courier booking,
  products with create-and-publish, the reconciliation queue, and settings for
  payment and courier credentials.
- Reconciliation queue built for the money question it answers — critical issues
  carry a heavy left rule and an inverted count, since no red exists in the
  palette. Amounts show what should have arrived, what did, and the gap.
- Server-side API layer: every call runs on the server so the tenant, session and
  basket tokens never reach the browser. Money is integer minor units throughout,
  divided once in `formatMinor` and printed with `Intl.NumberFormat`.
- Guest basket carried in an httpOnly cookie and handed to the first signed-in
  cart call, so the basket folds into the account on sign-in.
- Out-of-stock at checkout treated as a normal outcome: the API's 409 message is
  shown as written, the form keeps what was typed, and the shopper is sent back
  to the basket.

- SvelteKit 2 + Svelte 5 scaffold with TypeScript, Tailwind v4, ESLint and Prettier.
- `src/routes/layout.css` as the single token source of truth: greyscale palette,
  fluid type scale, layout tokens, motion tokens and view-transition rules.
- Self-hosted Mona Sans Variable (weight 200–900, width 75–125) and Geist Mono
  Variable, with the critical faces preloaded.
- Type roles driven by the width axis: `t-display`, `t-title`, `t-heading`,
  `t-sub`, `t-lead`, `t-body`, `t-label`, `t-button`, `t-mono`.
- System Bangla and Arabic stacks declared behind Mona Sans, which has glyphs for
  neither, so Bangla shop and product names render correctly.
- Components: Button, Section, PageHeader, CtaBand, Wordmark, Field, Input,
  Textarea, Select, Checkbox, Radio, Switch, Tag, Note, Table, Tabs, Disclosure,
  Dialog, Menu, Pagination, Breadcrumb, Empty, Skeleton, Spinner, Toaster.
- Pricing tiers aligned with CSS subgrid, so an uneven blurb cannot knock the
  price, button and limit rows out of step across columns. Tier names, prices
  and limits come from the platform's own plan definitions. The middle tier is
  promoted by inverting it onto `--inverse-paper`, with no badge or border.
- Vendor order-list mockup as the hero centrepiece, built as real markup so it
  doubles as the design target for the dashboard: shop names in Bangla and
  English, payment tags, BDT in tabular figures, and columns that drop rather
  than shrink on small screens.
- Payout movement showing cash on delivery reaching a seller, with the courier
  charge and commission subtracted and the arithmetic visible in tabular mono.
- Capability figures — payment methods, couriers, payout frequency, setup cost.
  Facts about the product, never invented customer counts.
- Motion: `svelte/transition` only, gated on `prefersReducedMotion`.
- Theme: light and dark, explicit choice persisted, applied before first paint.
- `/ds` route showing the palette, the fluid type scale with the width axis,
  layout and spacing tokens, and every component in every state.
- Landing page: hero, integrations, what you get, numbered how-it-works, pricing,
  questions, closing call to action and footer.
- Typed API layer reading `PUBLIC_API_URL` from `$env/static/public`, normalising
  the error envelope into `ApiError` and mapping codes to plain-language copy.
- Error handling: root and `/ds` error pages, 404, 500 and an offline banner.
- `Seo` component emitting meta, canonical, OpenGraph and Twitter tags.

### Changed

- Every figure on the landing page is taka, formatted with `Intl` through
  `marketing/money.ts`. The fee calculator compares against local rates rather
  than a US card rate, and the payment feed shows bKash and Nagad.
- `formatMinor` renders `en-IN`, not `en-BD`: Bangladesh groups digits South
  Asian style and `en-BD` carries no such grouping in ICU, so amounts were
  printing as ৳150,000 instead of ৳1,50,000.
- Geist Mono replaces IBM Plex Mono on the landing page, and carries numerals on
  both surfaces. One less webfont, one less family.
- The sign-up and address fields validate with valibot instead of hand-rolled
  checks, with one message per failure written for a shop owner.

- New marketing landing page on the root route, built from `src/lib/marketing/*`:
  header with centred nav, interactive storefront preview, five feature panels
  with hand-built CSS mocks, theme switcher, fee calculator, testimonials,
  pricing, integrations, FAQ and sign-up band. Every visual is markup, not a
  screenshot, so none of it can go stale.
- A second design surface. The app keeps its neutral, theme-aware greyscale; the
  landing page runs on a fixed light brand surface with lime as its only accent
  — flat fills, no shadows and no hover lift — tokens
  namespaced `mk-` and scoped to `.mk-surface` so the theme toggle cannot repaint
  it. Mona Sans now carries headings and body on both surfaces; the landing page
  uses IBM Plex Mono for labels and Instrument Serif for the footer wordmark
  alone.
- The landing page takes `/` and the storefront home moved to `/shop`. The
  `/platform` page and `src/lib/landing/*` were removed.
- Error copy now comes from the API. `error.message` is rendered as written and
  `error.fields` drives per-field messages; the frontend words only the transport
  failures the API cannot answer at all.
- The storefront took `/` while the marketing page lived at `/platform`; both
  have since moved (see above).
- `PUBLIC_API_URL` carries the shop subdomain, because the API resolves the
  tenant from the request host and Node's fetch will not send a `Host` header.

### Removed

- GSAP and the three-tier motion capability system. Scroll reveals, the magnetic
  button and the pre-paint heading start state went with it. Motion is now
  `fade`, `fly` and `slide` from `svelte/transition`, skipped entirely under
  `prefers-reduced-motion`.
- The custom mix-blend cursor and every `data-cursor` attribute.
- View transitions: the page cross-fade and the circular theme wipe. The theme
  toggle swaps an attribute.
- The two-column rail grid and its `--rail` token. Sections are ordinary centred
  containers; eyebrows are kept only where they genuinely label something.
- `ServiceRow`, which modelled a studio's service list rather than anything
  a marketplace has.
- The Arabic wordmark swap on hover.
- Competitor names and product-category framing removed from all customer-facing
  copy. The Questions section now answers what a shop owner asks before signing
  up rather than comparing Dukkan to anything.
