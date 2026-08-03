# Dukkàn — web

The front end for Dukkàn: a hosted shop for merchants in Bangladesh. Storefront,
admin and landing page in one SvelteKit app, talking to [`dukkan-api`][api] and
nothing else.

_dukkàn_ — "shop". The word the customer already uses.

[api]: https://github.com/ebnsina/dukkan-api

## What is here

| Route      | What it is                                                    |
| ---------- | ------------------------------------------------------------- |
| `/`        | The landing page                                              |
| `/shop`    | Storefront — catalogue, search, product, basket, checkout     |
| `/orders`  | Order confirmation and tracking, for a customer               |
| `/account` | Order history, behind phone OTP sign-in                       |
| `/admin`   | Orders, products, the reconciliation queue, credentials       |
| `/ds`      | The design system, rendered from the same tokens the app uses |

Cash on delivery is most orders here, so reconciliation — what the courier
collected against what the order said — is a first-class screen rather than a
report.

## Running it

Needs Node 20.19+ or 22.12+ (Vite 8's requirement), and the API running locally.

```sh
npm install
cp .env.example .env
npm run dev
```

```sh
npm run check     # svelte-check
npm run lint      # prettier and eslint
npm run build     # the gate before pushing
```

### Environment

Both are read at build time and neither has a fallback — a missing variable
fails the build rather than shipping a page pointing somewhere wrong.

| Variable          | Why                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_API_URL`  | Carries the shop subdomain. The API resolves the tenant from the request host, and Node's fetch will not send a `Host` header. |
| `PUBLIC_SITE_URL` | Absolute URLs for canonical, OG and Twitter tags.                                                                              |

## How it is built

**Two surfaces.** The app is a neutral greyscale that follows a light/dark
toggle. The landing page is a fixed light brand surface with lime as its only
accent, its tokens namespaced `mk-` so the toggle cannot repaint half of it.
Square corners and flat fills on both — no radius, no shadow, anywhere.

**Mona Sans for words, Geist Mono for labels and numerals**, both self-hosted.

**Money is integer minor units from the API**, rendered once through
`$lib/utils/money` with `Intl`. Digits group South Asian style: ৳1,00,000.

**Errors come from the API.** `error.message` renders as written; the front end
words only the transport failures the API cannot answer at all.

**Every product visual on the landing page is markup, not a screenshot**, so
none of it can go stale.

`CLAUDE.md` has the working rules in full.

> The landing page ships with invented testimonials, merchant names and figures,
> including the fee calculator's comparison rate. Replace them before it is
> public.
