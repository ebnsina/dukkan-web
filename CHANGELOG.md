# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
  price, button and limit rows out of step across columns.
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
