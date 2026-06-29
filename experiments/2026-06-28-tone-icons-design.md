# Design: `tone` severity + `mh-icon` (mask-based, themeable)

Date: 2026-06-28
Status: Approved (brainstorm)

## Problem

Color carrying semantic meaning is a wall MaxHTML hit three times across the
saturation experiment and logged each time in `maxhtml.css`:

- `mh-badge` (App #3) — "MaxHTML doesn't do colour-per-variant… convey status
  with a leading emoji dot"
- `mh-alert` (App #8) — "severity colour can't ride a class… rides a LEADING
  EMOJI… logged as the known colour-variant wall"
- `mh-toasts` (App #11) — "severity still rides the leading emoji"

It is one missing primitive (semantic severity → color) hit three times, not
three problems. The emoji workaround also:

- can't be themed/recolored (emoji are fixed glyphs),
- makes the model emit a *rendering* (which glyph) — a decision the loaded layer
  should own (violates tenet 3),
- drifts (🟢 used for both "Operational" and "INFO"; 🟡 for both "New" and
  "WARN"),
- ejects poorly (a magic glyph vs a clean `variant`).

Precedent that the "kit forbids variant hooks" rule was already too strict:
`input[aria-invalid=true]` already pulls `--mh-danger` (color-per-state on a
native attribute, shipped).

## Decisions

### 1. Severity is a cross-component `tone` attribute (closed enum)

- `tone ∈ {success, warning, danger, info}`; **neutral = no attribute**.
- Native attribute (sanctioned by the brittleness rule), not a class.
- Color axis is **semantic-only** (valence). Categorical/palette hues (calendar
  event types, kanban lane colors) are explicitly **out of scope** — a future
  `accent` axis if ever needed (YAGNI).

Token quad, themeable from one place (only `--mh-danger` exists today):

```
--mh-success / --mh-warning / --mh-danger / --mh-info
```

Each component reads a local `--tone` var derived from the attribute. All rules
wrapped in `:where()` (zero specificity). Reskin by overriding the four tokens.

Per-component treatment (one attribute, component decides the look):

- **Badge** → colored dot (`::before` circle tinted by `--tone`) + subtle tint;
  label stays as text content.
- **Alert / toast** → leading severity **icon** (tinted) + colored left-border.

### 2. Badge label re-mapping

| Today | tone |
|---|---|
| Active / Operational / Closed / In stock | `success` |
| ERROR / Down / Churned / Payment failed | `danger` |
| WARN / Degraded / At risk | `warning` |
| INFO / Note / Heads up | `info` (fixes the 🟢-INFO drift) |
| New / Lead / Customer / General / Newsletter | **neutral** (no color) |

Pipeline stages (New/Lead/Customer) go neutral by decision — they have no
good/bad valence; pipelines distinguish stages by column, not badge color.

### 3. `mh-icon` (freeform icon component)

```html
<mh-icon name="message"></mh-icon>
```

- `mask` + `background: currentColor` → inherits text color, recolorable, themeable.
- `1em` square, `inline-block`, baseline-aligned.
- SVGs are **Lucide (ISC)**, inlined as URL-encoded data-URI masks in
  `maxhtml.css`. Amortized once; **zero emission tokens** (model emits only the
  tag + `name`).
- Severity icons reuse the same mask plumbing via `--tone-icon`, so `tone` and
  `mh-icon` share one mechanism.

Starter subset (~17): `success warning danger info` (Lucide circle-check,
triangle-alert, circle-x, info) + `message eye tag thumbs-up sparkles cart phone
mail pencil map-pin star search user`.

### 4. Avatars

Emoji faces removed. Fallback = initials when a name is known, else
`<mh-icon name="user">` for anonymous. `<img>` path unchanged.

### 5. Left alone

Existing CSS-pseudo glyphs (`▾` menu, `±` accordion, `/` breadcrumb, `✓` steps)
are already token-free CSS `content`, not emoji — no churn.

## Token honesty

`tone="danger"` (~3 tokens) is a slight increase vs an emoji (~1–2) per badge,
bought in exchange for real themeable color, killed drift, and clean eject.
`mh-icon` ≈ emoji cost (both ~1–3 tokens; SVG is amortized). The downstream
rendering (color, icon, dot, border side) becomes a loaded-layer decision the
model never emits — net more token-minimal *in spirit* (minimal signal in,
everything else free).

## Scope of changes

- `maxhtml.css` — add 3 tokens; `mh-icon` block + 17 mask rules; `tone` handling
  on badge, alert, toast; avatar fallback.
- Recipe pages + stories — migrate emoji status → `tone=` / `mh-icon`.
- `CONVENTIONS.md` — add `tone` + `mh-icon` to vocabulary, slot model,
  translation table.
- `PROMPT.md` — teach the rail to emit `tone=` / `mh-icon`, never emoji.
- `experiments/saturation.md` — log the color-variant wall converting into the
  `tone` primitive.
- `CLAUDE.md` — key-files/convention touch-ups if needed.

## Out of scope (YAGNI)

- Categorical/palette color axis (`accent`).
- Per-app stage hues.
- A JS behavior layer for `mh-icon` (pure CSS suffices).
- Full Lucide set (ship only what's used; log additions).
