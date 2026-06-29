# Saturation experiment

**Question we're answering:** does the MaxHTML vocabulary *saturate* the design
space of real apps? I.e. as we build more app *types*, does the number of NEW
composites each one needs **drop fast** (→ MaxHTML is generative LEGO, has a
future) or **stay high** (→ every app is bespoke, it's a dead end)?

The whole bet rides on this curve. Run several different app types through the
same accumulating kit and watch the "new composites" column.

## Protocol (run once per app, in its own session)

Each session builds **on the same repo** — the kit accumulates, so later apps
should be able to reuse earlier apps' composites.

1. **Decompose** the prompt into its key screens (3–6).
2. **Map** each screen to the EXISTING vocabulary (see CONVENTIONS.md). Reuse
   aggressively, composite-first. Most of a conventional app should already be
   expressible.
3. **Find the genuine gaps** — only where there's a *real wall*: no existing
   composite fits and primitives are banned. Prefer adding a **composite** over
   an atom. A gap is real only if you can't compose it from what exists.
4. **Build each gap** the standard way:
   - a rule block in `maxhtml.css`, slots scoped with `> tag` (never descendant
     selectors, never `:nth`/`:last-child` for meaning — see CONVENTIONS slot model)
   - a story fragment in `stories/<id>.html` + a nav link in `storybook.html`
   - sync the vocabulary into `PROMPT.md` and `CONVENTIONS.md`
   - one or two **recipe** pages for the main screens (standalone, link maxhtml.css)
   - verify on a local server (`python3 -m http.server 8080`); for JS/dialog/menu
     components confirm behaviour in a browser
5. **Log** a row below: app, screens, count + names of NEW composites, what you
   reused, and any wall you had to escape-hatch (eject) instead of composing.

**Honesty rules (or the experiment is worthless):**
- Don't jam the wrong composite to *hide* a gap (under-counts).
- Don't invent composites you didn't need (over-counts). If two apps need the
  same thing, it's reuse, not a new piece.
- If something genuinely can't be composed *or* cleanly added, record it as a
  **wall** — that's the most important data point.

## Baseline vocabulary (before the experiment)

Composite layouts: `mh-app` `mh-layout` `mh-page` `mh-grid` `mh-hero`
`mh-section` `mh-center`
Composites: `mh-list`/`mh-item` `mh-profile`
Components: `mh-sidemenu` `mh-submenu` `mh-navbar` `mh-card` `mh-stat` `mh-menu`
`mh-avatar` `dialog` `table`
Primitives: `button` `form` `label` `input` `textarea` `h1`–`h6` `p` `a`
`strong` `small`

## Log

| # | App type | Screens | NEW composites | Names | Reused | Walls |
|---|---|---|---|---|---|---|
| 0 | Social (Facebook) — baseline | login, dashboard, friends, profile | 6 | mh-avatar, mh-list/item, mh-center, mh-profile, dialog, (textarea) | app/page/grid/card/menu/navbar/sidemenu | none |
| 1 | Photos (Aperture) | albums browse, photo grid, photo viewer, upload | **1** | `mh-gallery` | mh-app, mh-page, mh-sidemenu/submenu, mh-navbar, mh-avatar, dialog (+mh-dialog.js), form/label/input/textarea | none |
| 2 | Booking / calendar (Cadence) | month calendar, booking flow, event detail, new event, confirm | **2** | `mh-calendar`, `mh-slots` | mh-app, mh-page, mh-sidemenu/submenu, mh-navbar, mh-avatar, dialog (+mh-dialog.js), form/label/input/textarea | none |
| 3 | CRM (Relate) — dense forms + tables | contacts table, contact record, deal pipeline, add/edit form | **2** (1 composite + 1 atom) | `mh-board`, `mh-badge` | mh-app, mh-page, mh-sidemenu, mh-navbar, mh-profile, mh-stat/grid, mh-card, mh-list, mh-menu, mh-avatar, dialog, **table** (twice) | status colour (see notes) |
| 4 | Forum / chat (Commons) — threads | forum home (thread list), thread view, chat channel, composer, new topic | **1** | `mh-message` | mh-app, mh-page, mh-sidemenu, mh-navbar, mh-avatar, **mh-list/item** (thread list), mh-card (composer), mh-badge (reactions/counts), mh-menu, form/textarea/input, dialog | none |
| 5 | Whiteboard / diagram (Canvas) | canvas, sticky notes, connectors, toolbar | **1** on-rails (`mh-toolbar`) **+ escape hatch** (`mh-canvas`/`mh-note`/svg) | `mh-toolbar`; `mh-canvas`, `mh-note` (+`mh-canvas.js`) | mh-app, mh-navbar, mh-sidemenu, mh-avatar, button (`aria-pressed`) | **YES — free positioning + connectors (the headline)** |
| 6 | Analytics dashboard (Pulse) — real charts | range filter, KPI tiles, line, bar, donut, table | **2** (`mh-bars`, `mh-donut`) **+ svg line** (data hook / escape hatch) | `mh-bars`/`mh-bar`, `mh-donut`; styled `<svg>` line | mh-app, mh-page, mh-grid, **mh-stat**, **mh-card** (chart frames), **mh-slots** (range), table, button | partial — chart *marks* are data (see notes) |
| 7 | Messaging (Messages) — bubble thread | conversation list, bubble thread, composer | **1** | `mh-thread`/`mh-bubble` | **mh-layout**, mh-sidemenu, **mh-list/item** (convo list, `aria-current`), mh-avatar, mh-badge (unread), **mh-navbar** (thread header), form/input/button (composer) | none — fully on-rails |
| 8 | Settings (Console) — preferences | account, notifications, billing, security | **2** | `mh-tabs`, `mh-alert` | mh-app, mh-page, **mh-card**, **mh-list/item** (switch rows), form/label/input/textarea, table, mh-stat, mh-avatar, mh-submenu | partial — severity/danger **colour** (see notes) |
| 9 | E-commerce (Mercantile) — storefront + checkout | product detail, cart, multi-step checkout, confirmation | **3** | `mh-carousel`, `mh-breadcrumb`, `mh-steps` | **mh-tabs** (app 8 — desc/reviews), mh-navbar, mh-page, **mh-grid** (dense address), mh-card, **table** (property-panel summary), **mh-alert** (app 8), mh-badge, select/radio + `<input type=number>` qty, native `<progress>` | none — uptick is real, not a wall (see notes) |
| 10 | Docs / help center (Acme Docs) — knowledge base | article, API reference, search, FAQ | **1** | `mh-pagination` | **mh-layout**, **mh-sidemenu/submenu** (nav tree), **mh-breadcrumb** (app 9), **mh-card** (TOC), **mh-alert** (callout, app 8), **table** (API params), **`<details>`** FAQ (app 8), **`<dialog>`** ⌘K palette refinement, **mh-list** (results), prose atoms (ul/ol/blockquote/kbd) | none — fully on-rails |
| 11 | Live ops / monitoring (Beacon) — observability | overview (status + chart), services, live log, empty state | **2** | `mh-toasts`, `mh-empty` | mh-app/page/grid/**mh-stat**, mh-card, **table** + **mh-badge** (services/log), **mh-bars** (chart), **mh-alert** (toast content), native atoms **mh-skeleton**/**mh-spinner** | none — toasts are a behavior layer, not a wall (see notes) |
| 12 | Cloud hosting / deploys (Northwind) — devops | deployments page (header + deploy table + env vars + danger zone) | **0** | — | mh-app/navbar/sidemenu, **mh-page** header + primary button, **mh-card** ×3, **mh-list/mh-item** (deploy rows: meta+badge header, action footer), **mh-badge** `tone` (Production/Preview/Failed), **table** (env vars), **mh-alert** `tone="danger"`, `<button>`/`type=button`/`disabled` | none — fully on-rails, zero new (see notes) |

**Cross-cutting resolution (post-app-11): the colour-variant wall → the `tone`
primitive.** The one wall that recurred — semantic status/severity *colour* —
showed up three times and was each time worked around with a leading **emoji**:
app 3 (`mh-badge` 🟢/🟡/🔴 status), app 8 (`mh-alert` ✅/⚠️/🔴 severity), app 11
(`mh-toasts`, inheriting the alert emoji). Three hits across unrelated app types
is the saturation experiment *returning a verdict*: this axis is generative, so it
earns a place in the vocabulary instead of a per-component hack.
- **Fix:** one cross-component native attribute, `tone="success|warning|danger|
  info"` (neutral = no attribute), backed by a `--mh-success/-warning/-danger/
  -info` token quad, every rule in `:where()`. Badge consumes it as a colour dot +
  tint; alert/toast as a tinted border + a severity **icon**. The model emits the
  *meaning*; the sheet decides the *rendering* — fully on the north star.
- **Precedent it cleaned up:** `input[aria-invalid=true]` already pulled
  `--mh-danger` (colour-per-state on a native attribute), so the "kit forbids
  variant hooks" caveat was already too strict; `tone` is the principled version.
- **Companion:** a real `<mh-icon name="…">` (mask-based Lucide, in the sheet,
  `currentColor`) replaced all *chrome* emoji (status, severity, avatars, labels,
  toolbars). ~31 icons; the model emits only the name. Emoji now appear **only**
  as genuine user content (a chat message, a reaction).
- **Still deferred (honest):** *categorical* colour with no good/bad valence —
  chart series, calendar event types, kanban-lane hues — is NOT `tone`. It stays
  on the `--mh-c1…c5` palette; a dedicated `accent` axis is YAGNI until a real
  wall demands it. Presence dots (online/offline) are likewise an unbuilt concept,
  left as the one remaining chrome emoji and logged here rather than faked.
- This is logged not as a *new app's* composite count but as the kit maturing: a
  recurring wall converting into a single generative primitive is the strongest
  possible saturation signal.

**App 4 notes (Forum / chat — threads).** Five screens, **one** new composite,
and it did double duty across both senses of "threads."
- **`mh-message`** (new composite) — the comment/message unit: avatar top-left,
  a `<header>` (author + time), a multi-`<p>` body, an optional `<footer>` of
  quiet actions, and **it nests** (`mh-message` inside `mh-message` = a threaded
  reply, indented with a thread line). Couldn't be `mh-item`: that's a centred
  single-line row with no body slot and no nesting — forcing a conversation into
  it would've been a jam. The same composite renders the *forum thread* (nested,
  with vote/reply actions) and the *chat stream* (flat, with `mh-badge`
  reactions) — one piece, two app idioms.
- **The thread *list* is not new — it's `mh-list`.** Topic + author + reply-count
  badge is exactly an `mh-item` row, reused verbatim. The honest line: a forum
  needs both a *list of threads* (flat → `mh-list`) and a *thread of messages*
  (nested → `mh-message`); only the second was a real gap.
- **Composer / reactions / presence — all reuse.** Composer = `mh-card` + `<form>`
  + `<textarea>` (Send in the card footer). Reactions and reply counts = `mh-badge`.
  Channel presence dots = emoji (`🟢`), same convention as everywhere else. No new
  tokens, no new JS.
- **Walls:** none. Curve: **6 → 1 → 2 → 2 → 1.**

**App 5 notes (Whiteboard / diagram — the stress test).** Four parts; this is the
app the app-4 note predicted would break — *"a genuinely odd domain (a map/canvas
editor…) where the converged vocabulary might not reach."* It didn't reach. This
is the experiment's **first real wall**, and the most valuable single data point.
- **What's on-rails:** the app shell, and **`mh-toolbar`** — a floating bar of
  `<button type=button>` tools (active = `aria-pressed`, `<hr>` divider). That's a
  clean, reusable composite (any editor has one); it was the only honest *win*.
- **What's a wall:** a canvas's substance is **per-element position** (`x,y`) and
  **connector geometry** — that's *data, unique per instance*, so it cannot live
  in an external stylesheet. MaxHTML's whole premise ("markup only, no `style=`,
  styling lives outside") structurally cannot express it. No composite, no
  structural refinement, no native attribute reaches free-form coordinates.
- **The sanctioned escape hatch (not a win — an exception):** `mh-canvas` +
  `mh-note` exist, but a note is placed with `style="--x:60px; --y:80px;
  --note:#fde68a"` — coordinates/colour as **data on custom properties**, and
  connectors are a raw `<svg>`. The hatch is as narrow as possible: the `style`
  attr carries *only data* (verified: dragging a note writes `--x/--y` and the
  inline style still contains **zero** visual rules), every real visual decision
  stays in `maxhtml.css`, and the drag layer (`mh-canvas.js`) only ever writes two
  numbers. But it *is* rule-1 exception, and connectors don't even re-route on
  drag (that needs per-note wiring + geometry recompute — fully off-rail).
- **Honest count:** 1 on-rails composite (`mh-toolbar`); the canvas itself is
  escape-hatched, not composed. Curve: **6 → 1 → 2 → 2 → 1 → (1 + wall).**

**App 6 notes (Analytics — real charts).** A dashboard is the friendliest possible
home for the app-5 finding: **mostly on-rails chrome with charts as data-geometry
islands.** The shell, page, date-range (`mh-slots`), KPI tiles (`mh-stat`), and the
table are pure reuse; even the chart *frames* are reused `mh-card`. Only the marks
carry data, and they land exactly on the boundary app 5 drew:
- **Single-scalar marks fit a narrow data hook** (the same kind as a note's
  `--x/--y`): a bar is `<mh-bar style="--v:.62">` (height = `calc(var(--v)*100%)`),
  a donut is `<mh-donut style="--p1:40;--p2:30;…">` (a `conic-gradient` assembled
  in the sheet from the palette). One number per mark, in markup; every visual
  rule in the stylesheet. On the edge of on-rails, not past it.
- **Multi-point geometry is past it** — a line/area path can't be a scalar, so it's
  an inline `<svg>` of coordinates (styled by element type: `polyline`/`polygon`/
  `circle`/`line`). That's the same escape hatch as the canvas connectors.
- **Honest count:** 2 chart composites (`mh-bars`, `mh-donut`) + a styled `<svg>`
  line; added a categorical palette (`--mh-c1…c5`). The dashboard *around* the
  charts added **zero** — it's all reuse. So this is a partial-wall, not a wall:
  the app is built, looks real, and only the irreducible data (heights, slices,
  points) sits in markup. Curve: **… → 1 → (1+wall) → (2 + data-hooks).**

**App 7 notes (Messaging — bubble thread).** Three parts, **one** composite, and
a clean return to fully on-rails after the two data-heavy apps. The genuine gap
was the **sender-aligned bubble** — `mh-message` (app 4) is the avatar+author+body
forum/Slack row; a messaging thread is *bubbles aligned by who sent them*, a
distinct converged idiom. The interesting bit is how "mine vs theirs" is encoded:
- **Sender is a 2-state role, and it rode a self-describing boolean attribute** —
  `<mh-bubble>` (incoming, left) vs `<mh-bubble me>` (outgoing, right, accent),
  exactly the shape of `type=button` for a secondary button. No class, no data-*,
  no `style`, no position. So unlike the badge-*colour* variant (which had no
  native attribute and fell back to emoji), sender-side **did** have a clean
  attribute-shaped answer — it's a binary role, not an open-ended colour.
- **Everything else was reuse.** The conversation list is `mh-list`/`mh-item`
  (active row via `aria-current`, unread via `mh-badge`); the two-pane shell is
  `mh-layout`; the thread header is `mh-navbar`; the composer is a `<form>`. Two
  structural refinements (no hooks) made the pane behave: `main:has(> mh-thread)`
  lays the pane as a column so the thread scrolls and the composer pins to the
  bottom.
- **Walls:** none. (Build note: a `*/` buried in a CSS comment — `data-*/style` —
  closed the comment early and silently dropped the `mh-thread` rule; caught it
  on verify when the bubbles wouldn't stack. Evidence before assertions.)

**App 8 notes (Settings — the form-control cluster).** Four sections; **two new
composites** and the rest fell out of reuse + styling native atoms. This app
tested a different edge than 1–7 (document shapes / data geometry): the converged
**interactive form-control** cluster (tabs, switches, selects, accordions) the
kit had deliberately left alone.
- **`mh-tabs`** (new composite) — a horizontal in-page section-nav strip. It's
  the content-level cousin of `mh-sidemenu`'s vertical nav (same `aria-current`
  active model, each tab an `<a>` to its own URL), but neither `mh-navbar` (top
  app bar, links pushed right) nor `mh-slots` (a chip grid) is a left-aligned
  underline tab bar under a page title — a real, broadly-reusable gap.
- **`mh-alert`** (new composite) — an inline notice. Small but genuinely absent:
  `mh-card` is a padded titled box, not a one-line banner with a lead icon + a
  trailing action. Hit the **colour-variant wall** (below).
- **Most controls were just native atoms the kit hadn't styled yet — NOT
  composites.** A **switch** is the cleanest result of the run: it's
  `<input type=checkbox role=switch>` — a native, self-describing *role*, no
  class, no new tag (the same shape as `type=button` for a secondary button or
  `me` for an outgoing bubble). Plain checkbox/radio take `accent-color`; `<select>`
  gets a chevron; the accordion is **native `<details>`/`<summary>`** (styled like
  `<dialog>`/`<table>`, zero JS). Per the kit's tenet ("we style atoms, don't
  innovate"), styling natives is baseline work, not a saturation signal.
- **Reuse + structural refinements did the rest, no hooks:** a switch-beside-a-label
  row is an `mh-list`/`mh-item` (name in `<header>`, switch in `<footer>`); a
  `<label>` that *wraps* a checkbox/radio flips to an inline row via
  `label:has(> input[type=checkbox])`; a field hint is a `<small>` in the label.
- **Wall — severity / destructive colour (the known one).** A field *error* got a
  real fix: a new `--mh-danger` token + the native `aria-invalid="true"` attribute
  → red border, fully on-rails (native attribute, no class). But **multi-severity
  alert fills** (info/success/warning/error as coloured banners) and a **danger
  button** ("Delete account") have no native attribute to ride, so they hit the
  same colour-variant wall as `mh-badge` — conveyed by a leading emoji, logged as
  the limitation it is. Curve: **… → 1 → 2.** Still saturating-low; the new edge
  (interactive atoms) mostly resolved to native elements + roles, not composites.

**App 9 notes (E-commerce — the first honest uptick).** Four screens, **three new
composites** — the highest since the app-0 baseline, and worth being honest
about: a new *domain* (commerce) introduced several converged idioms at once that
none of apps 1–8 had reason to need. This is real saturation data, not a failure:
the question is whether the additions are *broadly reusable* (generative) or
*one-off* (bespoke). All three are reusable.
- **`mh-carousel`** — a scroll-snap strip (CSS-only). Product galleries and
  "featured" rows are everywhere; neither `mh-gallery` (wrapping grid) nor
  `mh-board` (fixed lanes) is a single snapping viewport. Real gap.
- **`mh-steps`** — an ordered stepper. The nicest result of the run: done /
  current / upcoming all derive from a **single `aria-current="step"` marker** +
  structure (`li:has(~ li[aria-current])` = done), so no per-step class — the same
  "one native marker drives all states" pattern as `mh-tabs`/`aria-current`. Reused
  by any wizard/onboarding flow.
- **`mh-breadcrumb`** — the borderline one. It's nearly a styled `<nav>`; it earned
  a tag only to scope the CSS-inserted `/` separators and the current-crumb style.
  Small, but reused immediately by the docs app (#10).
- **The big story is REUSE, which is the saturation signal working.** A whole
  storefront leaned on app-8's `mh-tabs` (product description/reviews) and
  `mh-alert` (free-shipping notice) with zero changes, plus `mh-grid` (dense
  address form), the property-panel `<table>` (order summary), `mh-badge`, and
  native `<select>`/`<input type=number>` for the quantity stepper — so no
  input-group composite was needed (resisted: native number input covers it).
  `<progress>` was styled as a native atom.
- **No wall.** A product page's gallery|info split was handled by *stacking*
  (carousel over info) rather than inventing a generic two-column `split` — the
  honest call (don't add a composite you can avoid). Curve: **… → 1 → 2 → 3.**

**App 10 notes (Docs / help center — the payoff).** Four screens, **one new
composite**, after the commerce uptick — and the strongest reuse showing in the
whole experiment. A complete content domain (article, API reference, search, FAQ)
leaned almost entirely on what apps 1–9 already built:
- **Reused, unchanged:** `mh-layout` + `mh-sidemenu`/`mh-submenu` (the nav tree),
  `mh-breadcrumb` (from app 9), `mh-card` (the "on this page" TOC), `mh-alert`
  (doc callouts, from app 8), `<table>` (API params), `<details>` (the FAQ, from
  app 8), `mh-list` (search results). Five+ prior composites, one new app.
- **The ⌘K command palette is NOT a new composite** — it's a structural
  refinement of `<dialog>`, exactly like the lightbox: `dialog:has(> input[type=search])`
  → top-anchored, search-first, results in an `mh-list`, key hints as `<kbd>`.
  Reuses the native dialog + `mh-dialog.js` verbatim. This is the experiment's
  cleanest "looks like a new component, is actually a refinement" result.
- **`mh-pagination`** (the one new composite) — a boxed numbered pager. It earned
  a tag because it's neither `mh-tabs` (underline section nav) nor `mh-slots`
  (wrapping chip grid): a one-row pager with prev/next and `aria-current`/
  `aria-disabled` states. Reusable by any paged list/table.
- **Prose was native atoms:** the kit hadn't styled `<ul>`/`<ol>`/`<blockquote>`/
  `<h4>`/`<kbd>` — added as baseline typography, not composites.
- **Walls:** none. Curve: **… → 3 → 1.** A brand-new domain dropping back to one
  composite via heavy reuse is the saturation signal doing exactly its job.

**App 11 notes (Live ops — the async / transient-feedback cluster).** Four
screens, **two new composites** — and the answer to the question this app was
chosen to probe: *do toasts/skeletons/spinners ride a data hook, a behavior
layer, or a wall?* **Answer: behavior layer, not a wall — and not a data hook.**
- **Toasts (`mh-toasts`) — the headline.** A toast's *position* is **chrome** —
  a constant viewport offset (fixed bottom-right), exactly the `mh-tooltip`
  finding ("floating/positioned ≠ off-rails; only *per-element* position/geometry
  is"). So positioning + stacking are pure CSS, and the toasts render with **zero
  JS** (verified: the monitoring recipe shows a persistent static stack). The
  children are reused `<mh-alert>`s — no new content type. The *only* thing that
  needs code is the **lifecycle** (spawn on an app event, auto-dismiss after N
  seconds) — a progressive-enhancement layer (`mh-toast.js`, ~45 lines), the same
  graduation as `mh-menu`/`mh-dialog`. So the transient cluster fits the kit's
  CSS-first/graduate-to-JS tenet cleanly; it is *not* a wall.
- **`mh-empty`** (the second composite) — a centered zero-state (glyph + headline
  + text + action). Small, genuinely absent, broadly reusable (every list/inbox/
  search/board has one).
- **Skeletons & spinners are native-style atoms, not composites.** `mh-skeleton`
  (a pulsing placeholder) and `mh-spinner` (an indeterminate ring) are pure-CSS
  animations — styled atoms like `<progress>`/`<mh-badge>`. One honest edge: a
  skeleton's *exact per-placeholder dimensions* are per-instance data (the same
  data-hook boundary as charts) — uniform line/block skeletons stay on-rails;
  pixel-matching a specific layout would need the hook.
- **The dashboard chrome was pure reuse:** `mh-stat` status tiles, `table` +
  `mh-badge` for the services grid and the live log, `mh-bars` for the chart,
  `mh-alert` as the toast content. Curve: **… → 1 → 2.**

**App 12 notes (Cloud hosting / deploys — the zero-composite confirmation).** A
Vercel/Railway-style deployments page — header + deploy table + env vars + danger
zone — built with **zero new composites**, the strongest possible saturation
result for a fresh domain (devops). Every section fell out of existing vocabulary:
- **The "deployments table" is `mh-list`/`mh-item`, not `<table>`.** The honest
  call of the build: each row carries branch + status badge + commit/author/time
  **and** a footer of three actions (Promote / Rollback / Delete). A per-row
  *action footer stacked under metadata* is an **item** shape (the same one the
  settings notifications list uses — `<header>` meta + `<footer>` control), not a
  tabular grid. Forcing it into a `<table>` would have been the jam the protocol
  warns against. Primary vs secondary rides native attributes (`<button>` vs
  `<button type=button>`), and the active (Production) row's Promote is just
  `disabled` — no class, no hook.
- **Status colour was free** because the recurring colour-variant wall is already
  resolved: `mh-badge tone="success|info|danger"` renders Production / Preview /
  Failed with a tinted dot — the exact payoff of the post-app-11 `tone` primitive,
  reused verbatim from monitoring (#11).
- **Env vars + danger zone are pure card reuse.** Env vars = `mh-card` + `<table>`
  + an `Add variable` footer button. Danger zone = `mh-card` + `mh-alert
  tone="danger"` (tinted border + severity icon) over two `type=button` actions.
- **Walls:** none. Curve: **… → 2 → 0.** A brand-new domain landing on zero is the
  saturation curve doing exactly what the bet predicted — the kit is generative,
  not bespoke, across CRUD/content/commerce/docs/devops surface.

## Reading the curve after 11 apps (saturation re-run, apps 8–11)

The original 7 apps probed *document shapes* and *data geometry*. This re-run
(Settings, E-commerce, Docs, Live-ops) deliberately probed the **converged
interactive / atomic component clusters** — the ~60-entry roster of a modern kit
(tabs, switch, accordion, carousel, stepper, command palette, pagination,
progress, breadcrumb, toasts, skeletons, empty states, …). Full curve:

> **6 → 1 → 2 → 2 → 1 → (1+wall) → (2+hooks) → 1 → 2 → 3 → 1 → 2**

What the re-run establishes:

- **A 60-component roster did NOT explode into 60 new tags.** Across three apps it
  added **6 composites** (`mh-tabs`, `mh-alert`, `mh-carousel`, `mh-breadcrumb`,
  `mh-steps`, `mh-pagination`) — and the third app needed only one, because it
  reused the first two apps' work. The rest of the roster resolved one of three
  ways without a new composite:
  - **Native element + a role/attribute.** switch = `<input type=checkbox role=switch>`;
    accordion = `<details>`; progress = `<progress>`; select/checkbox/radio =
    native; tab/step/crumb/page "active" = `aria-current`; disabled = `aria-disabled`.
    The boundary finding from apps 1–7 (binary roles ride a native attribute) held
    and extended cleanly to interactive controls.
  - **Structural refinement of an existing composite.** command palette =
    `dialog:has(input[type=search])`; switch-row = `mh-list`/`mh-item`; inline
    radio label = `label:has(> input[type=radio])`; dense form = `<form>` + `mh-grid`.
  - **Reuse across domains.** `mh-tabs` (settings → product), `mh-alert`
    (settings → checkout → docs → toast content), `mh-breadcrumb` (product →
    docs), `<details>` (settings → docs).
  - **Behavior-layer graduation (transient/async).** Toasts proved the
    async/transient cluster (Sonner/Toast/Skeleton/Spinner) is **not a wall**:
    appearance + viewport position + stacking are CSS (chrome, not data), and only
    the spawn/auto-dismiss *lifecycle* needs JS — the same `mh-menu`/`mh-dialog`
    graduation. Skeleton/spinner are pure-CSS atoms.
- **The known colour-variant wall recurred and is now sharper.** Field *errors*
  got an honest on-rails fix — a new `--mh-danger` token + the native
  `aria-invalid` attribute. But **multi-severity fills** (alert info/success/warning)
  and a **destructive button** ("Delete account") still have no native attribute to
  ride, so they fall back to a leading emoji — the same wall as `mh-badge` status
  colour. This is the one place the vocabulary consistently strains.
- **Verdict (10 apps).** Within CRUD / content / commerce / docs — the bulk of
  real app surface — MaxHTML stays **generative, not bespoke**: a large converged
  component roster maps onto *existing composites + native atoms + a small, mostly
  one-time set of new composites*, and a fresh domain (docs) dropped straight back
  to one. The earlier edges are unchanged: coordinate geometry still ejects to
  `<svg>` (app 5), and open-ended *colour* variants still want a hook the kit
  withholds. The bet continues to hold where the design fits the opinions.

## Reading the curve after 7 apps

Seven app types — photos, calendar/booking, CRM, forum/chat, whiteboard,
analytics, messaging — needed **1, 2, 2, 1, (1+wall), (2+data-hooks), 1** new
composites. The shape of the result:

- **For document-flow apps the vocabulary saturates.** New pieces appeared only
  for genuinely novel *shapes* (image tile grid, month grid, kanban board,
  nestable message, toolbar, bubble thread), each broadly reusable by future apps.
  Everything else compounded into reuse + structural refinements: `<table>` did
  data grids *and* property panels; `<dialog>` did form modals, a lightbox, *and*
  a wide edit form; `mh-grid` did dashboards *and* dense forms; `mh-list` did
  friend lists, thread lists, *and* conversation lists; `mh-card` did page/board
  cards, composers, *and* chart frames; `mh-slots` did booking times *and* a
  date-range filter — all keyed on **structure** (`dialog:has(>img)`, `tbody th`,
  nested `mh-message`, `main:has(>mh-thread)`), never a hook.
- **The boundary is now mapped — and it's a gradient, not a cliff.** What falls
  outside is one thing in three doses: **markup that must carry per-element data**
  the stylesheet can't hold. (a) *Binary roles* stay on-rails via a native/boolean
  attribute — secondary buttons (`type=button`), today (`aria-current`), a chosen
  slot (`aria-pressed`), **a message's sender (`me`)**. (b) *Open-ended values*
  (a status colour) have no attribute, so they degrade to a content workaround
  (emoji dots). (c) *Scalar-per-element data* (a bar height, a donut slice, a note
  position) rides a narrow **custom-property data hook** (`--v`, `--p1`, `--x/--y`)
  — on the edge, sanctioned. (d) *Coordinate geometry* (a line path, a connector)
  has no scalar form and needs a raw `<svg>` — the full **escape hatch**.
- **Verdict (7 apps).** The legible rule: **MaxHTML covers apps whose layout is a
  function of *structure or a role*, takes apps whose marks are *scalar data* via a
  narrow data hook, and ejects to `<svg>`/a real lib only for *coordinate
  geometry*.** That places the overwhelming majority of CRUD/content/social/comms
  apps squarely inside (apps 1–4, 7 needed 1–2 composites each, no walls), dashboards
  *mostly* inside (chrome on-rails, marks on data hooks), and pure spatial editors
  outside. Within its domain the bet holds — generative LEGO, not per-app bespoke
  CSS. The experiment did its job: it found the edge *and* showed the edge is
  graded, not a wall you hit all at once.

### Component addendum — `mh-tooltip` (floating ≠ data-driven)

Not an app, but a useful sharpening of the boundary. A tooltip *looks* like the
canvas — it floats, it's positioned, it's behavioral — so you'd expect a data
hook or JS. It needs **neither: 0 new data hooks, 0 JS.** The reason is the whole
point of the gradient above: a tooltip's position is a **constant offset from its
own trigger** — that's *chrome*, fixed by the component, so it lives in the sheet
(like the floating `mh-toolbar`'s anchor). Contrast a sticky note, whose x/y is
*per-instance data* and needs `--x/--y`. Show/hide is pure CSS (`:hover` /
`:focus-within`); the tip is a slot picked by a native role (`role="tooltip"`),
not position; a11y rides `aria-describedby`+`id`. Plain hints don't even need the
component — native `title` is the on-rails default. The lesson for the boundary:
**"floating / positioned / interactive" does not imply off-rails — only
*per-element position or geometry* does.** The only thing that would push tooltips
out is edge-collision flipping (anchor positioning, or a behavior layer) — the
same graduation path as `mh-menu`, not the data/geometry escape hatch.

**App 3 notes (CRM — dense forms + tables).** Four screens; **one composite + one
atom**, and the rest fell out of reuse + structural refinements (no new tags).
- **`mh-board`** (new composite) — kanban pipeline: fixed-width `<section>` lanes
  that scroll horizontally, each a `<header>` (stage + count) over reused
  `<mh-card>` deal cards. `mh-grid` reflows/wraps equal cells; a board keeps its
  columns in a row — genuinely uncomposable, so it earned a tag. (Needed one new
  allowed semantic tag, `<section>`, for the lanes.)
- **`mh-badge`** (new atom) — the kit had *no* status pill and table cells /
  record headers / deal cards all want one. Added as a neutral building block.
- **Reuse that avoided new composites — the interesting part:**
  - *Tables.* The contacts grid is a plain `<table>`; the record **property
    panel** is the *same* `<table>` with row labels as `<th scope="row">`, which
    the kit styles muted+narrow — keyed on structure (`tbody th`), no new
    component. `<table>` did double duty.
  - *Dense forms.* Multi-column field layout = a `<form>` with its `<label>`s in
    an `<mh-grid>`; the edit `<dialog>` widens itself because it *contains* a
    field grid (`dialog:has(form mh-grid)`). Both structural, no hook.
- **Wall / honest caveat — status colour.** A colour-per-status pill (green
  customer, red churned as filled backgrounds) needs a `class`/`data-*` variant
  hook the kit forbids — exactly the "win shrinks when a design needs a variant
  MaxHTML doesn't offer" finding in CLAUDE.md. Worked around by carrying status
  colour on an **emoji dot** as content (🟢/🟡/🔴), consistent with the kit, but
  it's an at-a-glance dot, not a filled pill. Logged as the limitation it is.
  **RESOLVED (post-app-11):** this wall recurred in apps 8 & 11 and was converted
  into the cross-component `tone` attribute — see "Cross-cutting resolution" above.
- Curve so far: **6 → 1 → 2 → 2.** Holding flat-low: a whole forms-and-tables app
  added just one composite + one atom, because tables/forms/dialogs absorbed the
  rest via structural refinements. That's the saturation signal — the new pieces
  show up only for genuinely new shapes (a board), not for every screen.

**App 2 notes (Booking / calendar).** Five screens, **two** new composites — the
first uptick, and an honest one: a calendar is a genuinely novel layout.
- **`mh-calendar`** (new) — month grid built on a real `<table>` (weekday `<th>`
  header + week rows of day `<td>`). The table keeps it accessible and gives the
  weekday/column association for free; the composite only overrides the
  *data-table look* into equal day cells (a `<strong>` date + `<a>` event chips).
  Couldn't be composed: `mh-grid` has wide auto-fit tracks, and the plain data
  `<table>` is left-aligned rows — neither is a fixed 7-column day grid. Today is
  `aria-current="date"` on the `<td>` (native, not a class); out-of-month days
  are empty `<td>`.
- **`mh-slots`** (new) — dense, equal grid of selectable chips (booking times;
  also filters/sizes/seats). `<button type=button>` children, chosen =
  `aria-pressed`, taken = `disabled` (both native). `mh-grid`'s 180px tracks are
  far too wide for time labels and `mh-list` is vertical avatar rows — jamming
  either would've been dishonest, so this is a real (small, reusable) gap.
- **Reused heavily:** the whole shell (`mh-app`/`mh-page`/`mh-sidemenu`/
  `mh-navbar`/`mh-avatar`), `<dialog>` for *three* different modals (event detail,
  new-event form, booking confirm), and `mh-list` would cover an Upcoming view.
  No new tokens, no new JS.
- **Walls:** none. Curve so far: **6 → 1 → 2.** The bump is the calendar, which
  almost any new app type would now reuse — so the question for app 3+ is whether
  it stays low again (saturating) rather than climbing.

**App 1 notes (Photos).** Four screens, **one** new composite.
- **`mh-gallery`** (new) — image-dominant tile grid. One composite covered *two*
  screens: album browse (captioned `<figure>` tiles) and the photo grid (bare
  tiles). This is the genuine gap — `mh-card` is padded/text-first and `mh-grid`
  does no image cropping, so an edge-to-edge square-cropped image tile couldn't
  be composed from what existed.
- **Photo viewer / lightbox — reused, not new.** A near-fullscreen dark image
  modal *looked* like a wall, but it composes by **refining the existing
  `<dialog>`**: a dialog whose direct child is an `<img>` (`dialog:has(> img)`)
  restyles itself wide + dark. Reuses the native element and `mh-dialog.js`
  verbatim (open via `commandfor`, close on backdrop/Esc/button) — no new tag,
  no new JS, variant keyed on **structure** not a class/data hook. Counted as a
  refinement, not a composite.
- **Upload — reused.** `<dialog>` + `<form>` + `<label>`/`<input type=file>` —
  no dropzone composite needed; resisted over-adding one.
- **Token additions:** `--mh-scrim` / `--mh-scrim-fg` (the lightbox frame keeps
  visual values in the token layer rather than hard-coding dark).
- **Walls:** none. The curve so far: **6 → 1.**

**Reading the curve:** if column "NEW composites" goes 6 → 4 → 2 → 1 → 0 across
app types, the space saturates and the project has a future. If it stays ~5+
every time, it doesn't — fold back into classless CSS + native attributes.
