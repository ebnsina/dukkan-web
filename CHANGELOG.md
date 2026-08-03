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
- Rail grid layout: a 152px label column above 900px, stacked below, with labels
  revealed on hover, touch and `focus-within`.
- Components: Button, Section, PageHeader, ServiceRow, CtaBand, Cursor, Wordmark,
  Field, Input, Textarea, Select, Checkbox, Radio, Switch, Tag, Note, Table, Tabs,
  Disclosure, Dialog, Menu, Pagination, Breadcrumb, Empty, Skeleton, Spinner, Toaster.
- Motion layer: three capability tiers, GSAP behind a dynamic import, additive
  reveals, and a synchronous page-heading start state with a 1.2s fallback.
- Theme: light and dark, explicit choice persisted, applied before first paint,
  switched with a circular view-transition wipe from the toggle.
- `/ds` route showing the palette, the fluid type scale with the width axis,
  layout and spacing tokens, and every component in every state.
- Landing page: hero, integrations, what you get, numbered how-it-works, pricing,
  questions, closing call to action and footer.
- Typed API layer reading `PUBLIC_API_URL` from `$env/static/public`, normalising
  the error envelope into `ApiError` and mapping codes to plain-language copy.
- Error handling: root and `/ds` error pages, 404, 500 and an offline banner.
- `Seo` component emitting meta, canonical, OpenGraph and Twitter tags.
