# MaxHTML

> A tight, consistent encoding of the converged 2026 UI vocabulary, optimized
> for cheap and on-rails LLM emission.

## What it is

An **opinionated, LLM-friendly** component kit: a closed set of custom-element
components (`mh-*`) styled by a single **external** stylesheet. The model emits
only markup; all styling lives in CSS, loaded once and never re-emitted. Build a
UI in MaxHTML, then **eject** (translate to Tailwind/your design system) or
**stay** (theme via tokens).

## The real problem it solves

When you iterate on UI with an LLM, the model defaults to emitting inline
`style=` and full `<style>`/CSS blocks *every turn* — which drains tokens fast.
MaxHTML moves all styling **out of the markup** into one `<link>`ed stylesheet
the model never re-emits. So "move this section / regenerate that form / build a
dashboard" costs **markup tokens only**.

## Philosophy / tenets

1. **Opinionated.** Closed vocabulary, fixed structure, no primitives (no raw
   `<div>`/`<span>`, no inline styles). The constraint *is* the value: output is
   consistent and on-rails, and the model can't drift into bespoke styling.
2. **Composites, not atoms.** We don't compete on buttons, badges, and inputs —
   native HTML, Pico, and Shoelace already cover those. MaxHTML's focus is the
   level *above*: composite **layouts** (region arrangers — dashboard shell,
   split, grid, page header) and page **recipes** (conventional whole-page
   assemblies). That's where token cost is high, conventions are strong, and
   classless/widget libraries leave a gap. Atoms exist only as the building
   blocks of composites — we style them, we don't innovate on them.
3. **Token-minimal — the north star.** The single goal every other tenet serves:
   the fewest tokens an LLM must emit to build *and* iterate on UI. The tag name
   *is* the component's meaning; variants ride on native attributes/structure,
   never net-new class/style/data hooks. **Corollary: emit nothing the loaded
   layer can decide.** Styling, positioning, placement, collision, sizing, and
   theme are decided by the amortized CSS/JS (loaded once, zero emission tokens) —
   the model never emits them, and especially never emits a runtime/layout
   decision it can't even see (where something renders, which side a tooltip
   flips). A behavior layer is therefore *free* on tokens too: CSS-vs-JS is a
   robustness choice, never a token one. When two markups mean the same thing,
   the lighter one wins (native `title` over a `<mh-tooltip>` wrapper).
4. **CSS lives outside.** All design in one external stylesheet, amortized, never
   re-emitted by the model. This is the actual fix for the token drain.
5. **Ejectable.** A closed vocabulary maps to a deterministic translation table
   (`mh-* → Tailwind`). One artifact, two exits: translate (handoff) or theme
   (stay). See CONVENTIONS.md.
6. **Themeable.** A `--mh-*` token layer + every rule wrapped in `:where()`
   (zero specificity). Reskin from one place; ship a handful of preset themes.
   Structure is fixed; skin varies.
7. **Standards-friendly.** The `mh-` prefix makes them valid W3C custom elements
   (zero JS). Semantic tags (`main`/`nav`/`button`/`header`/`a`) are used inside
   for accessibility *and* as translation hints. Never replace a semantic tag
   with a custom one.
8. **Progressive enhancement.** CSS-first; a component graduates to a JS Web
   Component only when it needs behavior (e.g. `mh-menu`). The prefix means the
   *same markup* works both as a CSS-styled tag and a JS-backed component.

## Scope: three layers

MaxHTML is organized in three layers, and the *focus is the middle one*:

- **Atoms** — button, input, badge, card. Mostly native HTML or trivial CSS; we
  style them but don't innovate here. They're building blocks, not the product.
- **Composite layouts (the focus)** — region arrangers that each get a tag:
  `mh-app` (topbar + sidebar + content), `mh-split` (master/detail), `mh-grid`,
  `mh-page` (header + body), `mh-section`. High token cost to hand-assemble,
  strongly converged, and exactly what classless/widget libraries lack.
- **Page recipes (the payoff)** — conventional whole-page assemblies (login,
  settings, dashboard home). Shipped as documented Storybook recipes + PROMPT
  patterns, **not** as opaque tags — baking a whole page into one tag is too
  rigid to fill with real content.

Primitives (`button`, `input`, text) are **not a fourth layer** — they're the
**content of slots**. Each composite exposes named slots (usually content +
actions); primitives live inside them and are styled by slot context, not as
standalone components. Distinguish them by **slot + native attribute, never by
sibling position**. Full rules: the slot model in CONVENTIONS.md.

## Honest findings (do not over-claim)

These were established by measurement and argument; respect them.

- **The token edge scales with how verbose the baseline is by default.**
  Measured on two real app screens (dashboard + CRM), emitted markup only,
  framework CSS amortized: **~69% vs Tailwind** (utility-class soup), **~27% vs
  Pico/Shoelace** at the app/dashboard level (where they have no shell
  composite). On **atoms and simple content** the Pico/Shoelace edge shrinks to
  **~10–15% and can reverse** — Pico's classless `<article>` is already a card.
  **Tokens alone do not justify the kit.** (Hand-authored first-order signal;
  see the Token benchmark story. Model-generated run pending.)
- **Real differentiators:** consistency (closed vocab, no drift), coverage of
  app-shell/dashboard components Pico/Shoelace lack, no-JS rendering, and
  ejectability.
- **The kit does NOT enforce itself.** The "on-rails / no styling" property comes
  from the **prompt** (or the GBNF grammar), not from the CSS existing. The rail
  must be shipped alongside the kit.
- **Brittleness rule:** distinguish components by a **fixed slot or a native
  attribute** (robust, edit-proof) — *not* by counting identical siblings
  (`button:last-child = primary`), which silently breaks on reorder/edit. Use
  `<button>` vs `<button type=button>`, `aria-current`, etc.
- **Opinionation dissolves brittleness** by removing the freedom to vary; the
  cost is rigidity, relieved by the two exits + a sanctioned escape hatch.
- The win is **concentrated where the design fits the opinions** (primary/
  secondary, the one fixed look) and **shrinks** the moment a design needs a
  variant MaxHTML doesn't offer (pill shape, sizes). Semantic *severity* colour
  used to be on this list but is now covered by the cross-component `tone` axis
  (`success/warning/danger/info`) — a recurring wall that converted into a
  primitive (see `experiments/saturation.md`). A self-contained widget like
  Shoelace's `<sl-rating>` (one tag) MaxHTML can only tie, not beat.

## Saturation experiment (current focus)

We're testing whether the vocabulary saturates the design space: build several
different app types through the same accumulating kit and measure how many NEW
composites each needs. If that number drops fast, MaxHTML is generative and has
a future; if it stays high, it doesn't. **When given an app prompt, follow the
protocol in `experiments/saturation.md`** — reuse aggressively (composite-first),
add composites only at a real wall, build the standard way (scoped `> tag` CSS +
story + recipe + doc sync), verify, and log the new-composites count. Honesty on
the count is the entire point.

## Key files

| Path | What |
|---|---|
| `maxhtml.css` | the library — tokens + components/composites, all `:where()`, slots scoped with `> tag` |
| `mh-menu.js`, `mh-dialog.js` | behavior layers (Web Components / native dialog) for the few components needing JS |
| `index.html` + `storybook.css` + `stories/` | dogfooded explorer; a fetch router loads `stories/<id>.html` into the shell |
| `recipes/*.html` (e.g. `login`, `dashboard`, `landing`) | recipe pages — standalone, link only `../maxhtml.css`, zero styling emitted |
| `PROMPT.md` | the rail — system prompt that keeps an LLM emitting MaxHTML (markup only) |
| `CONVENTIONS.md` | vocabulary, naming rule, the slot model, theming tokens, translation table |
| `experiments/saturation.md` | the saturation-experiment protocol + running log |

The project is deliberately small: the kit, the rail, and a dogfooded Storybook.
Earlier token-comparison experiments (vs Pico/Shoelace) were removed once the
northstar was clear — their conclusions live in the findings above.

## Core convention

> **Custom tag where it names a component; semantic tag where HTML already has
> the concept.** Full rules in CONVENTIONS.md.
