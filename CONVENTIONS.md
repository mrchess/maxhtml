# MaxHTML conventions

MaxHTML is a closed component vocabulary you build an app's UI with quickly and
cheaply. It's designed with **two exits** — you pick one at the end, not up front:

- **Exit A — Handoff.** Translate the stable vocabulary into Tailwind (or your
  own design system) via the table below.
- **Exit B — Stay.** Override the token layer to theme it and ship as-is. The
  markup is valid W3C and accessible, so it's production-safe.

One artifact, two exits. Nothing here forces the choice early.

## The north star: minimise emitted tokens

Everything else in MaxHTML is in service of one goal — **the fewest tokens an LLM
must emit to build and iterate on UI.** That's why styling lives in an external
sheet (amortised, never re-emitted), why the tag name *is* the component, and why
variants ride on native attributes instead of net-new hooks.

The operational corollary, which every other rule descends from:

> **Emit nothing the loaded layer can decide.** Styling, positioning, placement,
> collision, sizing, and theme are decided by the stylesheet/behavior layer — they
> are loaded once and cost zero emission tokens. The model emits only the minimum
> *semantic* markup. In particular it never emits a **runtime/layout decision it
> can't even see** (where an element renders, which side a tooltip flips to); that
> is the layer's job. When two expressions carry the same meaning, emit the
> lighter one (native `title` over a `<mh-tooltip>` wrapper; a native attribute
> over a new element).

This is also why a behavior layer (JS) is *free* on tokens: like the stylesheet,
it loads once and is never re-emitted — so "CSS vs JS" for something like tooltip
collision is a robustness choice, never a token one.

## Naming rule

> **Custom tag where it names a component; semantic tag where HTML already has the concept.**

- **Components** are custom elements with the `mh-` prefix: `mh-layout`,
  `mh-sidemenu`, `mh-submenu`, … The prefix makes them *valid custom-element
  names* (conforming W3C, zero JS, collision-proof) while staying nearly as
  tight as a bare tag.
- **Semantic HTML** is used for anything HTML already has a tag for: `<main>`,
  `<nav>`, `<header>`, `<a>`, `<button>`, `<form>`, `<label>`, `<input>`,
  `<h1>`–`<h6>`, `<p>`. These cost zero extra tokens, carry the accessibility
  tree (Exit B), and act as translation hints (Exit A) — `<button>` says
  "primary action", `<nav>` says "navigation landmark".

Never replace a semantic tag with a custom one.

## The slot model

MaxHTML focuses on **composites, not atoms**. A composite owns its structure and
exposes a small set of named **slots** — usually a **content** slot and an
**actions** slot. Primitives (`<button>`, `<input>`, `<h1>`, `<p>`) are *not*
standalone components you choose from; they are the **content you put in slots**.

- The vocabulary you pick from is **composites**. Inside a slot you just write
  ordinary semantic tags.
- Primitives are styled by their **slot context** (`mh-card > footer button`),
  not as global standalone components — so the same `<button>` looks right in a
  card footer vs a page header automatically, with no variant attribute. A thin
  global base keeps them from ever being unstyled; per-slot rules refine them.

### Distinguishing primitives without brittleness

Inside a slot, tell primitives apart by **context + role**, never by counting:

| Signal | Example | Safe? |
|---|---|---|
| **Slot context** (where) | `mh-card > footer button` | ✅ fixed by the composite |
| **Native attribute** (role) | `button[type=button]` = secondary | ✅ self-describing, edit-proof |
| **Position** (which Nth) | `button:last-child` = primary | ❌ breaks on reorder |

**Rule: slot for context, native attribute for role, never sibling position.**

## Vocabulary (current)

**Composite layouts** (the focus — region arrangers):

| Component | Role | Slots |
|---|---|---|
| `mh-app` | full dashboard shell (topbar + sidebar + content) | `mh-navbar` + `mh-sidemenu` + `<main>` |
| `mh-layout` | two-column shell (sidebar + content) | `mh-sidemenu` + `<main>` |
| `mh-page` | page header + body | `<header>` (title + actions) + body |
| `mh-grid` | responsive auto-fit grid | tiles / cards |
| `mh-hero` | centered hero band (landing) | `<h1>` + `<p>` + `<footer>` (buttons) |
| `mh-section` | centered content band (landing) | `<h2>` + body + optional `<footer>` |
| `mh-split` | asymmetric two-column split (rail + main, ~1:2, stacks on mobile) | narrow first child (rail — stats/TOC/aside) + wider second child (main). Order = structure; for *equal* columns use `mh-grid` |
| `mh-list` / `mh-item` | row list with actions | item: `mh-avatar` + `<header>` (name/meta) + `<footer>` (actions) |
| `mh-center` | centered single-column shell (auth, empty) | one child (usually `mh-card`) |
| `mh-profile` | profile header | big `mh-avatar` + `<header>` (name/meta) + `<footer>` (actions) |
| `mh-gallery` | image tile grid (albums, photo grids) | `<figure>` tiles: `<img>` (square-cropped) + optional `<figcaption>` (`<strong>` title + `<small>` meta) |
| `mh-calendar` | month grid | a `<table>`: `<thead>` weekday `<th>` row + `<tbody>` week rows of day `<td>` (`<strong>` date + `<a>` event chips). Today = `aria-current="date"` on the `<td>` |
| `mh-slots` | selectable chip grid (booking times, filters) | `<button type=button>` chips; chosen = `aria-pressed="true"`, unavailable = `disabled` |
| `mh-board` | kanban board (deal pipeline, task board) | `<section>` lanes: `<header>` (stage + `<small>` count) + a stack of `<mh-card>` cards; scrolls horizontally |
| `mh-message` | comment / chat message (nestable) | `<mh-avatar>` + `<header>` (author + time) + `<p>` body + optional `<footer>` (actions/reactions); nest `<mh-message>` for threaded replies |
| `mh-toolbar` | floating tool bar (editor/canvas) | `<button type=button>` tools (active = `aria-pressed`) + optional `<hr>` divider |
| `mh-canvas` / `mh-note` | free-form canvas (**escape hatch**) | surface + `<svg>` connectors + `<mh-note style="--x;--y;--note">` stickies. See "Escape hatch" below — positions are inline *data*, the one sanctioned exception to "no `style=`" |
| `mh-bars` / `mh-bar` | bar chart | `<mh-bar style="--v:.62">` (value 0–1 as a data hook); frame in `mh-card` |
| `mh-donut` | donut chart | `<mh-donut style="--p1:40; --p2:30; …">` segment %s (palette `--mh-c1…c5`); legend in the card `<footer>` |
| line/area chart | (no tag) styled inline `<svg>` | `<polygon>`/`<polyline>`/`<circle>`/`<line>` styled by tag inside an `mh-card` — coordinate data inline (escape hatch) |
| `mh-thread` / `mh-bubble` | sender-aligned messaging thread | `<mh-bubble>` incoming (left); `<mh-bubble me>` outgoing (right, accent) — `me` is a self-describing boolean role. `<small>` = timestamp, `<header>` = day divider |

**Components:**

| Component | Role | Slots |
|---|---|---|
| `mh-sidemenu` | sidebar / vertical nav | `<header>` (brand) + `<nav>` of `mh-submenu`s |
| `mh-submenu` | labelled link group | `<header>` (label) + `<a>` links |
| `mh-navbar` | horizontal top bar | `<strong>` (brand) + `<a>` links |
| `mh-card` | titled container | `<header>` + body + `<footer>` (actions) |
| `mh-stat` | metric tile | `<header>` (label) + `<strong>` (value) + `<small>` (delta) |
| `mh-menu` | dropdown (needs `maxhtml.js`) | `<button>` (trigger) + `<a>` items |
| `mh-tooltip` | themed hover/focus hint | a trigger + `<small role="tooltip">` tip; a11y via `aria-describedby`+`id`. **Placement is automatic** (top + anchor-positioning auto-flip; no placement attribute to emit). Plain hints: use native `title` instead |
| `mh-avatar` | round user image | an `<img>` (photo), initials when the name is known (`AL`), or `<mh-icon name="user">` when anonymous — never an emoji face |
| `mh-icon` | icon (atom) | `<mh-icon name="…">` — a mask-based SVG that lives in `maxhtml.css`; `background: currentColor` so it takes the surrounding text colour and is fully themeable. Model emits only the tag + `name` (the artwork is amortised, ~emoji cost). Closed icon set; add one = add a mask rule |
| `mh-badge` | status pill (atom) | a short label; status colour rides the native **`tone`** attribute (`tone="success\|warning\|danger\|info"`, no attribute = neutral) → a leading colour dot + faint tint. Label stays as text. Count/decorative badge → an `<mh-icon>` inside instead (`<mh-icon name="message"> 18`) |
| `<dialog>` | modal (needs `maxhtml.js`) | `<header>` + body/`<form>` + `<footer>`; open via `<button commandfor="id">`. **Image variant (lightbox):** content is an `<img>` → wide, dark photo viewer, keyed on structure (`dialog:has(> img)`), no new tag/hook |
| `<table>` | data table | native — styled by the kit, no classes. **Property panel variant:** a row label as `<th scope="row">` in `<tbody>` → muted/narrow key column (keyed on structure, no hook) |
| `mh-tabs` | horizontal in-page section nav (settings, profile, product detail) | `<a>` tabs; active = `aria-current="page"` (same model as `mh-submenu`). Each routes to its own URL — the content-level cousin of the vertical sidebar nav. In-page panel switching needs JS |
| `mh-alert` | inline notice / banner | optional `<strong>` lead + body + trailing `<button>`; severity rides the native **`tone`** attribute (same axis as `mh-badge`) → tinted left border + a matching severity icon, both from the stylesheet (no attribute = neutral accent notice) |
| `<details>` / `<summary>` | accordion / disclosure | native — styled by the kit, zero JS. `<summary>` = header (with +/− affordance); the rest = panel. Stack for an accordion |
| native form controls | checkbox · radio · switch · select · progress | native, styled by the kit (atoms, not new tags). A **switch** = `<input type=checkbox role=switch>` (self-describing role, no class). Field hint = `<small>` in the `<label>`; error = `aria-invalid="true"`. `<progress value max>` = determinate bar |
| `mh-carousel` | horizontal scroll-snap strip (product images, featured row) | slides are `<img>` (full-bleed) or `<mh-card>`/`<figure>`; CSS scroll-snap, zero JS. Distinct from `mh-gallery` (wrapping grid) and `mh-board` (fixed lanes) |
| `mh-breadcrumb` | trail nav | `<a>` crumbs; last = `aria-current="page"`. `/` separators inserted by CSS, never typed |
| `mh-steps` | ordered step indicator (checkout, onboarding, wizard) | an `<ol>` of `<li>`; current = `aria-current="step"`. Done steps derive from structure (`li:has(~ li[aria-current])`) — one marker, no per-step class |
| `mh-pagination` | numbered pager (search results, tables, index) | `<a>` page links (current = `aria-current="page"`) + prev/next (`aria-disabled="true"` to disable an end) + `<small>` ellipsis |
| `<dialog>` command-palette variant | ⌘K palette | a `<dialog>` whose content leads with `<input type=search>` → top-anchored, search-first (results in `mh-list`, hints as `<kbd>`). Keyed on structure, like the lightbox — no new tag |
| prose atoms | lists · blockquote · kbd · code | native `<ul>`/`<ol>`/`<li>`, `<blockquote>`, `<pre><code>`, inline `<code>`, `<kbd>` — styled by the kit for long-form docs |
| `mh-toasts` | fixed transient-notification stack (bottom-right) | children are reused `<mh-alert tone>`s + a `<button>✕</button>`. Position is chrome (CSS, not a data hook); zero JS to render. `maxhtml.js` adds auto-dismiss + `mhToast(html, {tone})` / `[data-toast][data-tone]` spawn |
| `mh-empty` | empty / zero state | optional big leading `<strong>` glyph + `<h2>` + `<p>` + optional `<footer>` actions |
| `mh-skeleton` / `mh-spinner` | loading atoms | `<mh-skeleton>` = pulsing placeholder line (stack for paragraph/card); `<mh-spinner>` = indeterminate ring (determinate → `<progress>`) |
| `mh-prompt` | dark "paste this" prompt / terminal block (LLM / dev-tool landing) | prompt **text** only (whitespace preserved, author flush-left); optional `<a>` links + `<strong>` emphasis. Reuses the `--mh-scrim` dark surface tokens |

**Icons:** `<mh-icon name="…">` — mask-based SVGs (Lucide, ISC) that live in
`maxhtml.css`; the model emits only the tag + `name`, never the artwork, so an
icon costs ~the same as an emoji while being themeable and recolorable
(`background: currentColor`). The set is closed; add an icon = add one mask rule
(and log it). No emoji in chrome (status, severity, avatars, labels, toolbars);
emoji remain only as genuine *user content* (a chat message, a reaction).

**Severity — the `tone` axis:** semantic status colour is one cross-component
native attribute, `tone="success|warning|danger|info"` (no attribute = neutral).
It's the converged replacement for the old "leading emoji" status hack (logged
3× as the colour-variant wall across badge/alert/toast). The model emits the
*meaning* (`tone="danger"`); the stylesheet decides the *rendering* (the hue, the
badge dot, the alert icon + border) from the `--mh-success/-warning/-danger/-info`
tokens. Themeable, recolorable, and ejects to a `variant` prop. **Categorical**
colour (chart series, calendar event types, kanban-lane hues — no good/bad
valence) is a *separate* concern, served by the `--mh-c1…c5` palette, not `tone`.

**Borrowed from Radix, collapsed:** MaxHTML takes the *anatomy* of established
component libraries (what slots exist) but not their tag-per-part verbosity. A
Radix sidebar is ~9 nested components (`Sidebar`/`SidebarHeader`/`SidebarGroup`/
`SidebarGroupLabel`/`SidebarMenuButton`/…); MaxHTML expresses the same anatomy as
`mh-sidemenu` + `<header>` + `<nav>` + `mh-submenu` + `<a>`, reusing semantic
tags for the parts HTML already names.

The library grows by adding a component here, a rule block in `maxhtml.css`, and
a `<section>` story in `stories/` + an `mh-submenu` link in `index.html`.

## The escape hatch (free-form canvases)

Almost everything in MaxHTML is document-flow: stacks, grids, lists, tables. One
class of app isn't — **free-form spatial canvases** (whiteboard, diagram,
mind-map), where each element has a *position* `(x, y)` and connectors have
*geometry*. That is **per-instance data**, not reusable style, so it cannot live
in an external stylesheet — the kit's entire premise doesn't reach it.

The sanctioned hatch, used **only** here:

- Position/size/colour ride on **custom properties** set via `style=` —
  `<mh-note style="--x:60px; --y:80px; --w:12rem; --note:#fde68a">`. The `style`
  attribute carries *only data* (numbers, a colour token); every actual visual
  rule (paper, shadow, type, the dotted grid) still lives in `maxhtml.css`.
- Connectors are a raw `<svg>` layer (`<line>`/`<path>` with inline coordinates).
- Dragging is a behavior layer (`mh-canvas.js`) that writes **only** `--x/--y` —
  never a style string, never a class.

This is a deliberate, narrow exception to rule 1 ("never write `style=`"), not a
general allowance. It exists because positions are data; for anything that's
actually *styling*, take an exit instead. In the saturation experiment this is
logged as the first genuine **wall** — the edge of what the vocabulary covers.

## Token layer (Exit B — theming)

Override these CSS custom properties in your own `:root` to reskin everything
from one place. Because every rule is wrapped in `:where()` (zero specificity),
you can also override any individual component's CSS without a specificity war.

| Token | Purpose |
|---|---|
| `--mh-bg` | page background |
| `--mh-surface` | raised/recessed surfaces (sidemenu, code blocks) |
| `--mh-fg` | primary text |
| `--mh-muted` | secondary text |
| `--mh-line` | borders / dividers |
| `--mh-accent` | brand / active / primary |
| `--mh-accent-fg` | text on accent |
| `--mh-success` / `--mh-warning` / `--mh-danger` / `--mh-info` | the `tone` severity axis (badge dot, alert/toast icon + border) — override to reskin every tone'd component at once |
| `--mh-c1`…`--mh-c5` | categorical chart palette (donut segments, multi-series) — no good/bad valence |
| `--mh-scrim` / `--mh-scrim-fg` | immersive overlay surface + its text (lightbox) |
| `--mh-hover` | hover tint (flip to translucent white on dark themes) |
| `--mh-shadow` / `--mh-shadow-lg` | popover / dialog shadows |
| `--mh-backdrop` | modal backdrop |
| `--mh-radius` | corner radius |
| `--mh-gap` | default spacing unit |
| `--mh-side-w` | sidemenu width |
| `--mh-font` / `--mh-mono` | UI / monospace font stacks |

**Shape tokens** (theme these for a tighter/looser feel — e.g. shadcn): `--mh-text-base`
(body/control size), `--mh-h1`, `--mh-h2`, `--mh-weight` (medium 500), `--mh-weight-strong`
(semibold 600), `--mh-weight-bold` (bold 700), `--mh-control-py` / `--mh-control-px`
(the control padding / tightness lever).

```css
/* example theme: dark + rounded + wider sidebar */
:root {
  --mh-bg: #0f1115;
  --mh-surface: #161a20;
  --mh-fg: #e8eaed;
  --mh-muted: #9aa4af;
  --mh-line: #262b33;
  --mh-accent: #5aa6ff;
  --mh-radius: 12px;
  --mh-side-w: 280px;
}
```

## Translation table (Exit A — handoff)

Because the vocabulary is closed and stable, translation is a deterministic
lookup. Expand each component to its target-framework equivalent; keep the
semantic inner tags as-is.

| MaxHTML | Tailwind equivalent |
|---|---|
| `<mh-layout>…</mh-layout>` | `<div class="grid grid-cols-[250px_1fr] min-h-screen">…</div>` |
| `<mh-sidemenu>…</mh-sidemenu>` | `<aside class="flex flex-col gap-5 p-4 bg-gray-50 border-r">…</aside>` |
| `<mh-submenu>…</mh-submenu>` | `<div class="flex flex-col gap-0.5">…</div>` |
| `<mh-navbar>…</mh-navbar>` | `<header class="flex items-center gap-5 px-5 py-3 border-b">…</header>` |
| `<header>` (in sidemenu) | `<header class="px-2 text-lg font-bold">` |
| `<header>` (in submenu) | `<header class="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">` |
| `<a>` (in submenu) | `<a class="block px-2.5 py-2 rounded text-sm hover:bg-black/5">` |
| `<main>` | `<main class="p-10 max-w-5xl">` |
| `<mh-badge tone="success">Active</mh-badge>` | `<span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold text-green-700 border-green-200"><span class="size-2 rounded-full bg-green-600"></span>Active</span>` (map `tone` → the colour quad) |
| `<mh-alert tone="danger">…</mh-alert>` | `<div role="alert" class="flex items-center gap-2 rounded border border-l-[3px] border-l-red-600 p-3"><LucideCircleX class="size-5 text-red-600"/>…</div>` |
| `<mh-icon name="user">` | `<LucideUser class="size-[1em]"/>` (or `<i class="i-lucide-user">`) — the `name` maps 1:1 to the Lucide icon |
| `<mh-split>…</mh-split>` | `<div class="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8 items-start">…</div>` |
| `<mh-prompt>…</mh-prompt>` | `<pre class="rounded-lg bg-slate-900 text-slate-200 p-6 font-mono leading-relaxed whitespace-pre-wrap shadow-lg">…</pre>` |

Inner semantic tags (`<nav>`, `<button>`, `<a>`, `<h1>`) translate to themselves
— they already carry the right meaning.
