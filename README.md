# MaxHTML

**A tight, consistent encoding of the converged 2026 UI vocabulary, optimized
for cheap and on-rails LLM emission.**

MaxHTML is an opinionated component kit for one job: letting an LLM generate and
iterate on UI *cheaply*. You build with a small, closed set of custom-element
components (`<mh-card>`, `<mh-sidemenu>`, …); all the styling lives in one
external stylesheet the model never has to write. When you're done, you can
**eject** to Tailwind or **stay** and theme it.

## The problem it solves

When you ask an LLM to build or rearrange UI, it emits inline `style=` and full
`<style>`/CSS blocks on *every turn* — and that drains your token budget fast.
The styling, not the structure, is the expensive part.

MaxHTML fixes that by **keeping CSS outside the markup**:

```html
<link rel="stylesheet" href="maxhtml.css">   <!-- loaded once, never re-emitted -->

<mh-card>
  <header>Reservoir Logs</header>
  <p>Aggregated sensor logs, updated hourly.</p>
  <footer>
    <button>More info</button>
    <button type=button>Share</button>
  </footer>
</mh-card>
```

The model emits **markup only**. No inline styles, no `<style>` blocks, no class
soup. "Move this section," "regenerate this form," "build me a dashboard" all
cost markup tokens and nothing else.

## Philosophy

- **Opinionated.** A closed vocabulary with fixed structure and *no primitives* —
  no raw `<div>`/`<span>`, no inline styles. The constraint is the point: output
  stays consistent and on-rails, and the model can't wander off into bespoke CSS.
- **Composites, not atoms.** We don't compete on buttons and inputs — native HTML,
  Pico, and Shoelace already cover those. The focus is the level above: composite
  *layouts* (dashboard shell, split, grid, page header) and whole-page *recipes*.
  That's where token cost is high, conventions are strong, and other kits leave a
  gap. Atoms are just the building blocks.
- **Token-minimal — the north star.** Everything else serves one goal: the fewest
  tokens an LLM must emit to build and iterate on UI. The tag name *is* the
  component; variants come from native attributes and structure (`<button>` vs
  `<button type=button>`), never net-new styling hooks. The corollary the rest
  follows from: **emit nothing the loaded layer can decide** — styling,
  positioning, placement, collision, and theme are the amortized CSS/JS's job
  (loaded once, never re-emitted), so the model never writes them, and never
  emits a runtime decision it can't even see. (A behavior layer is free on tokens
  too — so "CSS vs JS" is a robustness call, not a token one.)
- **CSS lives outside.** Every visual decision is in `maxhtml.css`, loaded once
  via one `<link>` and never re-emitted. This is the whole trick.
- **Ejectable.** Because the vocabulary is closed and stable, converting off
  MaxHTML is a deterministic table lookup, not a rewrite (see below).
- **Themeable.** A `--mh-*` token layer + `:where()` (zero specificity) lets you
  reskin everything from one place, or pick from preset themes.

## Two exits — decide at the end, not the start

You build once. When the UI is right, pick a door:

**Eject (handoff).** A closed vocabulary maps 1:1 to your target framework, so
the conversion is a script or a single LLM pass over a translation table:

```
<mh-card>    →  <div class="rounded-lg border border-gray-200 p-5">
<mh-sidemenu>→  <aside class="flex flex-col gap-5 p-4 bg-gray-50 border-r">
```

Semantic tags inside (`<button>`, `<header>`, `<nav>`) translate to themselves.
The structure is already right — ejecting *decorates*, it doesn't restructure.
Full table in [CONVENTIONS.md](CONVENTIONS.md).

**Stay (theme).** Override the `--mh-*` tokens and ship it — the markup is valid
W3C (the `mh-` prefix makes them conforming custom elements) and accessible (real
`<nav>` landmarks, `<button>`s, labels). ~12 variables reskin the whole app:

```css
:root {
  --mh-bg: #0f1115; --mh-surface: #161a20; --mh-fg: #e8eaed;
  --mh-accent: #5aa6ff; --mh-radius: 12px; --mh-side-w: 280px;
}
```

## The vocabulary today

| Component | Role |
|---|---|
| `mh-layout` | two-column app shell |
| `mh-sidemenu` | sidebar / vertical nav |
| `mh-submenu` | labelled link group |
| `mh-navbar` | horizontal top bar |
| `mh-card` | card (header / body / footer) |
| `mh-menu` | dropdown (the one JS component) |
| + bare `button`, `form`, `input`, `label`, `main`, `h1`, `p` | styled semantic primitives |

Naming rule: **custom tag where it names a component; semantic tag where HTML
already has the concept.** Full conventions, tokens, and the translation table
in [CONVENTIONS.md](CONVENTIONS.md).

## Running it

There's no build step — it's static HTML + one CSS file. You just need a local
web server (not `file://`, because the Storybook **fetches** its story fragments
and the recipe pages link assets by path).

```bash
# from the repo root
python3 -m http.server 8080
```

Then open any of these:

| URL | What |
|---|---|
| http://localhost:8080/index.html | **Start here** — the dogfooded component explorer |
| `…/recipes/login.html` `…/recipes/dashboard.html` `…/recipes/friends.html` `…/recipes/profile.html` `…/recipes/landing.html` | baseline recipe pages |
| `…/recipes/albums.html` `…/recipes/photos.html` | photos app |
| `…/recipes/calendar.html` `…/recipes/booking.html` | calendar / booking app |
| `…/recipes/crm.html` `…/recipes/contact.html` `…/recipes/pipeline.html` | CRM app |
| `…/recipes/forum.html` `…/recipes/thread.html` `…/recipes/chat.html` | forum / chat app |

Any other static server works too — e.g. `npx serve` or `php -S localhost:8080`.

The **Storybook** is dogfooded — it's built *from* MaxHTML components and it
documents them. Pick a component in the sidebar to see live examples + usage, or
a **Recipe** to see a whole page assembled from the kit (each recipe is also a
standalone file you can open directly, links only `maxhtml.css`, and emits zero
styling). The recipe pages double as the running log of the
[saturation experiment](experiments/saturation.md).

## Progressive enhancement: CSS first, JS only when needed

Most components are pure CSS (undefined custom elements styled by the
stylesheet) — they render instantly with no JS. A component graduates to a real
Web Component *only* when it needs behavior CSS can't express. `mh-menu` is the
example: a dropdown needs close-on-outside-click, close-on-Escape, and live
`aria-expanded` — so it's [mh-menu.js](mh-menu.js), loaded with one `<script>`.
The `mh-` prefix means the same markup works either way.

## Honest limitations

MaxHTML is a bet, not a silver bullet. What testing showed:

- **The token edge over Pico/Shoelace is modest (~10–15%) and uneven.** It's
  biggest on attribute-heavy styled components and interactive widgets; it
  shrinks or reverses on simple content and ad-hoc layout. **Tokens alone don't
  justify it** — the real value is consistency, app-shell/dashboard coverage that
  classless/widget libraries lack, no-JS rendering, and ejectability.
- **The kit doesn't enforce itself.** "No inline styles" comes from the *prompt*,
  not from the stylesheet existing. The rail is [PROMPT.md](PROMPT.md) — paste it
  as the system prompt.
- **Opinionation buys consistency at the cost of flexibility.** You win tokens
  exactly as much as you give up per-instance configurability. When a design
  needs a variant MaxHTML doesn't offer, that's your signal to take an exit.

If you just need one styled page once, tell the model to use Pico or Shoelace —
it already knows them. MaxHTML earns its keep when you're generating *a lot* of
UI and care about consistency and per-iteration cost.

## Status

Prototype, focused on the Storybook and growing the component vocabulary. Today:
core layout/nav/card/menu components, a dogfooded Storybook, and the LLM rail
([PROMPT.md](PROMPT.md)). Next: the app-shell/dashboard components — table with
row-actions, list with item-actions, modal, stat cards — exactly where classless
frameworks force the model back into inline styles.
