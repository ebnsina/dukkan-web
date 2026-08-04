# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The landing page headline reaches 76px, from 56px, without giving up the two
  column hero. On one line it needed 10.8px of width per pixel of type, which
  the column capped at 59px — and a wrapped line is a clipped line inside the
  mask. Broken where the sentence already breaks, the longest line costs 6.9px
  per pixel, so the same row carries it. The feature kicker and the etymology
  line are gone and "See live stores" is outlined against the solid first
  action.

- The section head puts its sub-copy under the heading. Beside it, it read as a
  second column competing with the line it was meant to explain.

- The merchant row is a directory of live shops rather than a logo wall without
  logos. Each name carries its own `.dukkan.store` address and what it sells,
  which is the thing being offered two sections above — the claim widget shows
  an address going spare, and this shows eight that were taken. The boxes are
  gone; the gap separates them.

- No rule under the marketing header, and the mocks no longer straighten under
  the pointer: there is nothing to click in a picture, so a hover response
  promises an interaction that is not there. A tilted mock carries the frame's
  own corner too — a square one cut into the rounded frame as a blade, which is
  the one place the angle looked like a mistake rather than a crop.

- The theme index is a list of choices rather than a table of records. The
  hairlines between rows are gone and the chosen row is filled, the way a
  selected item reads everywhere else in the system, which also lets the number,
  the name and the trade sit centred on one line. The column carries a little
  more of the row, so no note wraps and no row is taller than its neighbours.

- The page has a rhythm. Every band was white, so eleven sections ran together
  as one long scroll with nothing to say where one thought ended and the next
  began. Product, the calculator, pricing and the FAQ sit on `mk-shell` now, so
  each boundary is a change of surface — marked once, the way the system asks —
  and the white panels inside those sections finally have something to sit on.

- The integrations grid is neutral. Two dozen tiles carried approximations of
  other companies' brand colours, applied to monograms we drew ourselves: a
  rainbow on a page with one hue, and borrowed marks that were not theirs. The
  names carry it now, and a real logo brings its own colour when there is one.

- The fee calculator's slider is a slider. `height: 2px` on a range input does
  nothing — the control keeps its intrinsic ~42px — and the track colour was
  painted on the element, so the hairline rendered as a grey slab with square
  ends. The ground moved to `::-webkit-slider-runnable-track` and
  `::-moz-range-track`, where it can be 3px and rounded.

- Prices roll to their new value. `Ticker` draws each digit as a column of 0–9
  behind a one-digit window, so switching to annual billing moves only the
  digits that actually change and the taka sign and separators hold still. The
  old treatment dropped the whole figure out and faded a different one in,
  which reads as a different price for the same thing rather than as the same
  figure changing. It sits still under `prefers-reduced-motion`.

- The wordmark behind the closing band breathes. At 70ms a frame with a
  character settling every third, a word resolved in about a second and the
  noise flickered the whole way — a loading glitch rather than the word turning
  over between its three scripts. Slower steps, fewer per character, and a rest
  long enough to read each one.

- The carousel's arrows are built like every other control: the control corner,
  the resting border weight, the brand on hover and a press. They were hard
  squares outlined in full-strength ink — the heaviest-drawn thing in a section
  whose subject is the quote — and their arrows were `&larr;` entities, glyphs
  from the text font rather than the icons every other arrow on the page uses.

- A story is a card. A top rule alone left each quote with no edge on three
  sides, so the row read as columns of text rather than as things.

- The billing toggle marks its choice with the brand instead of a near-black
  slab, which is what a selected thing does everywhere else.

- The Arabic and Bangla wordmarks fit. The watermark was sized against the
  Latin "Dukkàn", so the other two — which set much wider at the same size —
  were cut off at both ends and read as a layout fault rather than a device.

- The calculator's headline figure came down from 58px: at that size the input
  outweighed the answer it was there to produce.

- Pricing lists use the same tick as the product section. A square dot in one
  place and a checkmark in the other were two marks for one idea.

- The stories use the library's `Avatar` rather than initials worked out on the
  spot, and the four faces in the hero are the four shopkeepers who give those
  stories, so the same people appear in both places.

- The theme preview drops its browser chrome. The frame around it already names
  the address in its header, so the dots and the URL pill drew it twice and
  spent the top of the preview on a picture of a window instead of on the theme.


- The FAQ is the library's `Accordion` rather than a second one written on the
  page: same keyboard, same region wiring, same open-one-at-a-time. `Accordion`
  gained a `lg` size for rows that are the content rather than part of a form —
  the display face comes from the surface's own heading rule.

- More air between bands. `--spacing-mk-section` runs to 152px rather than
  116px: every section arriving straight after the last is what made the page
  read as a lot to get through.

### Added

- Seven components the library was missing: `Dialog`, `Drawer`, `Accordion`,
  `Avatar`, `Progress`, `Tooltip` and `Divider`. `Confirm` is now a `Dialog`
  with the question already framed rather than a second modal implementation.
- One scroll lock (`ui/scroll-lock.ts`) counting every open overlay, so a
  Confirm raised from inside a Drawer cannot hand the page back while the
  Drawer is still covering it.
- A `link` button: the same component with its box given up, for an action
  that belongs in a sentence or beside a heavier button.
- A `HoverCard`: a preview that opens on hover and holds a record rather than
  a sentence — who a customer is, without leaving the list to find out.
- Toasts have tones, an action, and a loading state. A submit raises one toast
  and answers it in place, so the notice being read becomes the result instead
  of being replaced by a second one underneath.
- `ui/position.ts`, which measures before it places. A menu near the bottom of
  the window opens upward, a tooltip near an edge shifts back inside it, and
  both grow out of the control that owns them. Panels are `fixed`, so a
  scrolling parent can no longer clip them.

- Self-serve signup at `/signup`: phone OTP, shop name and address, what you
  sell, and a theme chosen from a live preview.
- A state vocabulary for the admin (`lib/admin/state.ts`) with one word and one
  tone per status, so a colour means the same thing in every column.
- The storefront wears the shop's own theme. `GET /v1/store/theme` supplies the
  accent, its ink, a surface and a density, applied as custom properties on the
  shop layout; `layout` changes the arrangement as well as the paint, through
  `grid-dense`, `grid-roomy`, `editorial` and `list`.
- Product photographs throughout: listings, product detail with a thumbnail
  gallery, and basket lines. Each slot asks for the rendition it can use — the
  API's thumb is 6.7 KB against 158 KB for the large one, and that difference is
  a real cost on mobile data.

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

- The brand indigo carries the primary affordances instead of black: a solid
  button, a checked box, a chosen radio, a switch that is on, a selected tab,
  the current page and a focused field. Ink is now the hover state under it.
  The app is no longer monochrome — the accent says which thing acts.

- One address for the whole system. `/ds` carries the foundations and then
  every component built out of them, in that order; `/ui` was a second address
  for half of it and now redirects there. The controls, forms and feedback
  sections `/ds` used to hold were a thinner copy of the library and are gone.

- The library shows one specimen of each component rather than three columns of
  the same markup. The three surfaces rebind the tokens, so the copies differed
  in nothing; what a surface changes is the palette, and the theme toggle
  already shows that.

- Nothing is a circle. The avatar takes the same corner as a control, and the
  presence mark, the spinner's dots and a button's loading dots take the chip
  radius. A radio stays square and says what it is with a filled centre rather
  than a tick.

- The checkbox, the radio and the switch animate their marks, and each says
  its own thing once: the checkbox fills and ticks, the radio keeps an outline
  with a small centre, and the switch is the knob's position — no tick inside
  it, which was a checkbox's answer to a switch's question. All three sit still
  under `prefers-reduced-motion`.

- Toasts are a stack. The newest sits in front with the rest peeking out
  behind it, and pointing at the corner fans them out to full height, which is
  the only way to reach the close control on the ones underneath.

- Accessibility is the component's job, not the call site's: light dismiss on
  every modal, focus into the menu with `aria-activedescendant` and focus
  returned to the trigger on Escape, a tab panel named by its tab, the switch
  as `role="switch"`, an accordion whose heading level is a prop, and no
  dangling `aria-describedby` on a closed tooltip. The focus ring is one rule
  for the whole app, in the brand, offset clear of the control.

- Motion follows one set of curves and durations, and `tokens.css` owns them.
  `base.css` had been redeclaring `--ease-out` with a second, weaker curve;
  the curves are now the strong variants, `ease-in` appears nowhere, and every
  button, key and row answers a press before it does anything about it.

- A radio is round again. Square-everywhere is about boxes the page draws, not
  about a control whose shape is how people know only one can be chosen.

- A switch says its state with the knob alone, and stays readable when it is
  disabled — at half strength, an off switch disappeared into the card.

- A divider inside a box is dashed. A solid rule is structure: the edge of the
  box, or two cells that touch.

- A button's size is a height, so one beside a field lines up with it. `md` is
  46px because that is what an Input and a Select are.

- A field's error is a plain sentence in the state colour — no rule beside the
  words, since the field above it already carries that edge.

- The live dot has a heartbeat: two beats and a rest, with a ring going out on
  the first. An even blink reads as something demanding attention; a pulse
  reads as something running.

- An invalid field takes an even border. The 2px left edge read as a rendering
  fault rather than as an error; the message under it already carries the rule.

- Every button variant hovers within its own idea — the brand fill deepens to
  `--accent-hover`, the outlined one tints, the neutral one gains a ground, the
  dangerous one commits. None of them turns into another variant on the way.

- The dropdown, the toast and the pager stopped looking like a different
  system: they take the radius scale, the menu's active row and the current
  page are brand-filled, and a toast carries an accent mark. Two new tokens
  carry it — `--accent-hover`, and `--accent-on-inverse` for an accent that has
  to sit on `--inverse-paper` and therefore runs opposite the theme.

- A Banner leads with an icon for its tone, so the kind of news is legible
  before the colour is.

- A focused field keeps its own border and takes a 2px accent ring offset from
  it, rather than recolouring the edge.

- The admin takes its own palette rather than the shop's: a seller who repaints
  their storefront must not repaint the tool. Each state carries a hue that
  passes AA on paper and a wash to sit it on, lifted on the dark theme.

- The hero is a staged pair of devices: a MacBook running macOS with the shop
  maximised in Safari, and an iPhone standing in front of it showing the same
  payments arriving on its lock screen. Device chrome is the one place this
  surface allows a radius or a shadow; everything the page owns stays square.

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
