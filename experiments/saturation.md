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
