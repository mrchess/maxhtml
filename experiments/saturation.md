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

## Reading the curve after 4 apps

Baseline aside, four very different app types (photos, calendar/booking, CRM,
forum/chat) needed **1, 2, 2, 1** new composites — it stays low and flat, never
climbing. The pattern underneath matters more than the numbers:

- **New pieces appear only for genuinely novel *shapes*** — an image tile grid, a
  month grid, a kanban board, a nestable message. Each is something no prior
  composite could be, and each is broadly reusable by *future* apps (the calendar
  and board especially).
- **Everything else compounded into reuse + structural refinements** — `<table>`
  served data grids *and* property panels; `<dialog>` served form modals, a
  lightbox, *and* a wide edit form; `mh-grid` served dashboards *and* dense form
  layouts; `mh-list` served friend lists *and* thread lists; `mh-card` served
  page cards, board cards, *and* composers. The refinements rode on **structure**
  (`dialog:has(>img)`, `tbody th`, nested `mh-message`), never a class/data hook.
- **The one real wall stayed exactly where CLAUDE.md predicted** — colour-coded
  variants (status badges), worked around with emoji dots, not hidden.

So far the bet holds: the vocabulary behaves like generative LEGO, not like
per-app bespoke CSS. The honest caveat is sample size — four apps in conventional
domains. The next stress test is a genuinely odd domain (a map/canvas editor, a
spreadsheet, a music timeline) where the converged vocabulary might not reach.

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
