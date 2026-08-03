# Dukkan Web — working notes

The SvelteKit front end for Dukkàn: storefront, admin, and the landing page.
It consumes `dukkan-api` and nothing else. Bangladesh is the market — taka,
cash on delivery, Bangla.

`docs/` is gitignored. The design rules live there (`design-system.md`,
`landing-page.md`); read them locally before touching a component.

---

## Rules that are not negotiable

**Commits are authored `ebnsina <ebnsina.me@gmail.com>`, with no co-author
trailer.** A `Co-Authored-By` line puts a second name in the repository's
contributor list, which is not something a commit message should decide.
The remote is the `github-es` SSH alias.

**Money is taka, formatted through `Intl`.** The API sends integer minor units;
`$lib/utils/money` renders them. Locale is `en-IN`, never `en-BD` — Bangladesh
groups digits South Asian style, ৳1,00,000 rather than ৳100,000, and `en-BD`
has no such grouping in ICU. Never hand-roll a formatter.

**Errors have one source: the API.** Render `error.message` as written and let
`error.fields` drive per-field messages. The front end words only the transport
failures the API cannot answer at all. No stack, no code, no jargon reaches a
shop owner.

**Environment variables fail loudly.** `$env/static/public` at import time, no
`??` fallback, no default URL. A missing variable should break the build, not
ship a page pointing somewhere wrong.

**Client-side validation is valibot.** One schema per form, its messages written
for a person. It is a courtesy that saves a round trip — the server is still the
validator.

**Comments are one or two lines.** Say why, never what. If it restates the code,
delete it.

**Icons come from HugeIcons** (`@hugeicons/svelte`). No inline SVG paths, no
emoji.

**Mona Sans for words, Geist Mono for labels and every numeral.** Both are
self-hosted. Instrument Serif appears once, in the landing-page footer wordmark.

**Every route handles its failures.** 404 and 500 have pages; a fetch that fails
says what happened and what to do next.

**The changelog is part of the change.** `CHANGELOG.md`, Keep a Changelog
format, written before the commit rather than after the release.

**Every page sets its meta and OG tags** through `$lib/seo/Seo.svelte`.

---

## Layout

```
src/lib/api          the generated client and its types
src/lib/marketing    the landing page — its own surface, mk- tokens
src/lib/shop         storefront components
src/lib/admin        admin components
src/lib/ds           the design-system reference at /ds
src/lib/seo          meta and OG
src/lib/utils        money, formatting, class merging
src/routes/(shop)    storefront routes; the shop home is /shop
src/routes/admin     admin routes
src/routes/+page     the landing page
```

## Two surfaces

The app is a neutral, theme-aware greyscale. The landing page is a fixed light
brand surface with lime as its only accent, its tokens namespaced `mk-` and
scoped to `.mk-surface` so the theme toggle cannot repaint half of it. A
component belongs to exactly one surface. Square corners and flat fills on both
— no radius, no shadow, anywhere.

## Working here

```bash
npm run dev
npm run check        # svelte-check
npx eslint src
npm run build        # the gate
```

Verify against the running page, not the build. Several real problems here —
a theme swap that flashed a palette that does not exist, a menu button that sat
beside the wordmark on a phone, a fee calculator quoting a US card rate — passed
every check and failed the moment somebody looked at them.

## Placeholder content

The landing page ships with invented figures: testimonials, merchant names,
stats, and the fee calculator's comparison rate. `docs/landing-page.md` lists
them. None of it should reach production unreplaced.
