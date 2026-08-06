# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Discounts, both ends of them. A shop makes a code under Discounts in the
  admin, and a shopper types it at checkout and watches the total drop before
  paying. The API has taken `coupon_code` since coupons shipped; neither side
  had a field for it, which made the feature real for nobody.

  Forms go on a sheet from here on: the list stays readable behind it, and a
  form is something you finish and put down rather than a permanent half of the
  page. `Drawer` grew a `size` for it, so the next form asks for the variant
  instead of copying a width. Results arrive as a toast, so the news lands
  while a shop owner is looking at their list rather than at the form that
  changed it — field-level errors stay in the form, where the wrong field is.

- A shop can change its design. Settings has a Design section: every theme
  with its presets, each previewed as a miniature of that shop's own
  storefront, saved through `PUT /v1/admin/theme`. The three endpoints have
  been there since themes shipped with nothing calling them, so the colour a
  shop wore was whatever provisioning picked and could not be changed from the
  product at all.

  `ThemePreview` moves from `$lib/signup` to `$lib/shop`, now that signup is
  not the only place a shop is shown a design.

- Emil Kowalski's design-engineering skills, checked in under `.agents/skills`
  with `skills-lock.json` pinning each one to its source and hash. Tooling
  rather than product: they are the standard the motion work is held to, and
  the reason `--ease-out` was caught being redeclared with a weaker curve.
  `.claude/skills` symlinks into the same files. Refresh with
  `npx skills add emilkowalski/skill`.

### Changed

- A shop is identified by the address you are on, not by the environment. The
  API has always resolved tenants from the Host header, but the web sent every
  call to one build-time `PUBLIC_API_URL` — which pointed at a single shop. So
  the storefront was whichever shop the file named, and seeing another meant
  editing the file and restarting. One shop at a time, on a product built for
  many.

  `PUBLIC_API_URL` is fixed now and says only where the API is.
  `PUBLIC_SHOP_DOMAIN` says what shops are named under, and the shop itself
  comes from the request: `rahim.dukkan.localhost:5173` in development,
  `rahim.dukkan.store` in production, one rule for both. It is the same rule
  the API applies in `tenant.KeyFromHost`, written once in `server/shop.ts`
  rather than twice in two languages that would have to agree forever.

  Vite had to be told to allow those hosts and to bind more than IPv6 loopback
  — browsers resolve `*.localhost` to 127.0.0.1, and it was listening on `::1`
  alone, which is its own quiet refusal.

- The landing page links to a live shop rather than to nothing. Nine links —
  "See live stores" and the eight merchant cards — pointed at `/shop`, which
  worked only while the environment pinned the whole app to a single shop. Once
  a shop became its address those links had no shop in them, and the storefront
  answered a request it could not serve with a 500. They carry a real shop's
  address now, named by `PUBLIC_DEMO_SHOP`.

  And a storefront asked for on the marketing host redirects rather than
  failing: there is no shop at that address, which is the wrong address rather
  than a broken one. `/` and `/shop` now mirror each other — each host serves
  the one it owns and sends the other home.

- A shop's own address shows the shop. `rahim.dukkan.store/` rendered Dukkàn's
  marketing page — the wrong site, on a domain a merchant hands to customers.
  The landing page belongs to nobody, so on a shop's host it redirects to the
  storefront.

- Signup's link to the new shop is reachable. The API returns
  `https://slug.rootdomain`, which is right in production and has no port in
  development, so it could only fail. The link is built from the request's own
  scheme and port instead, and is correct in both without the API needing to
  know where the front end is served.

- The landing page quotes the prices the API bills. It invented three tiers —
  Souk, Atelier and Empire at ৳0, ৳2,900 and ৳9,900 — against the Starter,
  Growth and Scale the plans table actually charges at ৳990, ৳2,990 and
  ৳7,990. Every feature listed beside them was invented too: storefronts, BNPL,
  multi-warehouse, RTL locales, abandoned cart recovery, none of which the
  product has. It reads `GET /v1/plans` now, and the limits on each card are
  the limits `internal/entitlement` enforces.

  Two other figures in that section went the same way. "1.9% of what you
  process" was not a rate the product holds anywhere — `commission_percent`
  belongs to a marketplace's own sellers, not to us — so the line says what is
  true instead. The annual toggle, and its −20%, showed a price no yearly plan
  exists to charge; the toggle appears only when the table holds a yearly plan,
  so it returns by itself the day one is seeded rather than being deleted.

  Turning a limit into a sentence is marketing's job and lives in
  `plan-copy.ts`, so the wording can change without touching what is billed.
  A key the API grows later appears nowhere until it is named there —
  deliberate, since an unnamed feature reaching the page would read as jargon.

- An order's totals are one component. The admin and the storefront each wrote
  out the same ladder — subtotal, delivery, a conditional discount, the total —
  and money is the last thing that should exist in two copies: the drift that
  matters is the one where a discount line appears on one and not the other.
  They had already drifted on the figure's size, 18px against 20px.

- The component library page is nine components rather than one file. 1043
  lines held nine independent sections that shared nothing but scaffolding —
  so the scaffolding is `ds/specimen.css`, written once and scoped under
  `.library`, and each section owns its specimens, its state and whatever
  styling is peculiar to it. The overlays moved in beside the buttons that
  open them. Largest piece is now 219 lines.

- Signup sends the design it asked about. The step collected a theme and a
  preset and then posted neither, so the answer went nowhere; the API now takes
  the pair. See the API changelog for what it does with one it does not
  recognise.

- Signup is four steps rather than one 494-line file. Each step owns its own
  fields and its own idea of when it is satisfied; the page holds only what
  the steps agree on. The address check is `AddressCheck`, which is where the
  debounce and the stale-reply guard live, and the wizard's Next and Back
  stopped being written out in full three times each.

- Settings is a page again rather than a place things are kept. The design
  picker went in at 180 lines and took the file to 349, which is how a route
  becomes the thing nobody wants to open. It is `ThemePicker` (the choice and
  the form) over `ThemeCard` (one design, deciding nothing), and the banner
  every section had written for itself is `SectionResult`. The page is 143
  lines and holds no logic of its own.

- `failedCall` turns a failed API call into a failed form, in one place.
  Eleven actions across eight files carried
  `fail(isApiError(cause) ? (cause.status ?? 500) : 500, …)` verbatim; the one
  that gets that wrong is the one that reports a 422 as a 500, and it should
  not be retyped per action.

### Fixed

- **Self-serve signup could not complete.** Sending the code is a successful
  post, and SvelteKit's `enhance` resets the form element on success — which
  took the bound number down with it. The form that creates the shop then
  posted an empty phone and was refused by its own validator, with the number
  still legible on screen. Nobody could open a shop. That form keeps its own
  fields now: it is a step in a flow, not a thing to be emptied once sent.

  It passed every check and only showed itself when somebody clicked the flow
  through, which is the third time that has been true in this repository.

- Fifteen minutes after signing in, every admin page said "Something broke on
  our side". The access cookie lasts fifteen minutes and the layout renews it,
  but a page load runs *beside* its layout rather than after it — so the page
  read the cookie before it had been replaced, called the API with no token,
  and turned the 401 into a 500. A reload fixed it, which is why it read as
  flaky rather than broken.

  Page loads wait for the layout now and take the token from
  `accessAfterParent`. Renewing stays in the layout alone, deliberately: the
  API rotates the refresh token on every use and treats a reused one as theft,
  so two loads renewing at once would not be a harmless race — it would end the
  session. Proved that the hard way while testing this, by replaying one
  refresh token and watching the API correctly kill the session.

- The admin sheet has room on its right. It sat 6px from the window, which is
  less than its own corner radius, so the rounding ran out before the edge did
  and the sheet read as jammed against the window rather than laid on the grey
  ground. 12px, matching the rail's own padding. Still flush to the rail on the
  left, which is the one edge it is meant to meet.

- Signup has corners. The whole flow was square while the rest of the product
  ran on the radius scale — the trade tiles, the design cards, the preset
  chips, all three fields and the send button, and the stepper's numbers. Each
  now takes the step its size asks for: `control` for what is pressed or typed
  in, `nested` for the design card (which also had to clip, or the preview
  would have sat square inside a rounded frame), `chip` for the preset, `round`
  for the colour on it, `mark` for a number in a 20px box.

  The mocks on the landing page went with them where they draw a control that
  is rounded in the product: an insights chip and an upload target were square
  in the picture and not in the thing pictured. `--radius-mk-mark` and
  `--radius-mk-round` had to be bound into the marketing theme first — the
  values were in `tokens.css` and had simply never been exposed to Tailwind.

- A storefront wears its own accent again. `Button` binds `--accent`, which is
  the app's indigo, and `.shop-surface` rebound only `--inverse-paper` — so
  every library control on a shop's own pages carried Dukkàn's colour instead
  of the shop's. Hand-rolled controls were right and the library was wrong,
  which is the worst way round: the two disagreed on the same page. The
  surface binds the accent names now, and the hover is mixed from the one
  colour a theme sends, because a shop owner picks a colour and not a pair.

- Storefront search uses `Input` and `Button` rather than its own copies of
  them. The copies had drifted to 22px of inline padding against the
  library's 20px, which is exactly the drift the library exists to stop.

- The admin figures sit in a row again. `.dk-stats` was dropped from
  `admin.css` alongside `.dk-panel--stat` when `Stat` replaced the panel, but
  it is the container rather than the card and both the dashboard and Money
  owed still use it — so each figure fell to full width and the dashboard was
  four screens of scrolling before the first order.

- The landing page reaches signup. Every action on it — "Get started" in both
  navs, "Start free" in the hero and the closing band, all three plan buttons,
  "Claim it" — pointed at `#cta`, an anchor to a section on the same page, so
  the one thing the page exists to do could not be done from it. They go to
  `/signup`, which has been wired to `POST /v1/signup/start` all along.

- "Sign in" goes to `/admin/signin`, not `/signin`. The latter is the
  storefront's, and it resolves its shop from the `Host` header — on the
  marketing domain there is no shop to resolve, so it could only have failed.

### Removed

- `/ds/brand`. It held four candidate brand colours judged against the admin,
  and the judging is over — indigo won, and the page had become a third design
  system address that nothing linked to, when `/ds` is meant to be the whole
  system in one place and `/ui` was folded into it for that exact reason. The
  `--d-brand*` aliases it read stay: the admin surface uses them throughout.

- The closing band's email capture. It validated an address, said "check your
  inbox", and sent nothing anywhere; signup identifies a shop owner by phone,
  because the code arrives by SMS. It is a link to `/signup` now.

- "Claim it" no longer checks a name against a hardcoded list of taken
  handles and then does nothing when pressed. `/signup` asks for the address
  again and puts it to `POST /v1/signup/check-address`, which is the only
  answer worth showing.

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
