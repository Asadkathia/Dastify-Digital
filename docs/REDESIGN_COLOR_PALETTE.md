# Dastify_Isaac Redesign — Color Palette

Canonical color reference for the v2 redesign. Source: design bundle at
`/tmp/design-drop/dastify-digital-isaac/project/src/tokens.jsx` (the runtime
`window.Dastify` token engine) plus per-page CSS files.

All colors below are **already mapped into [src/app/globals.css](../src/app/globals.css)**
under the existing `--purple` / `--blue` / `--green` token names (kept stable
so existing block CSS reskins automatically) plus new v2 aliases
`--primary` / `--accent` / `--support`.

---

## Brand colors (the three load-bearing hues)

| Role | Hex | CSS var (v2) | CSS var (legacy alias, same value) | Notes |
|---|---|---|---|---|
| **Primary** | `#0025E8` | `--primary` | `--blue` | Deep blue. Nav bar, primary CTAs, link hover, link underlines, focus accents. |
| **Accent** | `#6F3EE5` | `--accent` | `--purple` | Purple. Featured pricing tier, hero emphasis gradients, glassmorphic glows. |
| **Support** | `#63DB24` | `--support` | `--green` | Vitality green. Status dots, "live" indicators, success states, animated counter highlights. |

### Brand color tints (semi-transparent variants used everywhere)

| Hex / RGBA | CSS var | Used for |
|---|---|---|
| `rgba(0, 37, 232, .08)` | `--blue-lt` | Soft chip backgrounds, hover-tinted cards |
| `rgba(0, 37, 232, .22)` | `--blue-bd` | Borders on chips/badges |
| `rgba(0, 37, 232, .25)` | — | Soft drop shadows on primary buttons (`hp2-btn--primary:hover`) |
| `rgba(111, 62, 229, .09)` | `--purple-lt` | Accent chips |
| `rgba(111, 62, 229, .22)` | `--purple-bd` | Accent chip borders |
| `rgba(111, 62, 229, .2 / .4 / .5)` | — | Featured pricing tier glow + border |
| `rgba(99, 219, 36, .10)` | `--green-lt` | Success chips, pricing-card check icons |
| `rgba(99, 219, 36, .25)` | `--green-bd` | Success chip borders |

---

## Ink (foreground / text) scale

Derived from `--ink: #11100F` per `tokens.jsx`'s `mix()` math.

| Role | Hex | CSS var | Used for |
|---|---|---|---|
| **Ink 900** (near-black) | `#11100F` | `--ink-900` / `--ink` | Headings, primary body text |
| **Ink 700** | `#2A2A28` | `--ink-700` | Strong body, hover-darkened text |
| **Ink 500** | `#5C5C58` | `--ink-500` | Secondary text |
| **Ink 64% alpha** | `rgba(17, 16, 15, .64)` | `--t2` | Body text on light bg (medium emphasis) |
| **Ink 40% alpha** | `rgba(17, 16, 15, .40)` | `--t3` | De-emphasized text, captions |
| **Ink 16% alpha** | `rgba(17, 16, 15, .16)` | `--bd-md` | Borders (medium) |
| **Ink 10% alpha** | `rgba(17, 16, 15, .10)` | `--bd-dk` | Default borders |
| **Ink 6% alpha** | `rgba(17, 16, 15, .06)` | `--bd-lg` | Soft section dividers |

---

## Surfaces (light backgrounds — clean white system)

| Hex | CSS var | Used for |
|---|---|---|
| `#FFFFFF` | `--bg` | Default page background |
| `#F7F8FB` | `--bg2` | Tinted bands, alternating sections |
| `#EEF0F5` | `--bg3` | Heavier tint, FAQ bg |
| `#E4E7EF` | `--bg4` | Card backgrounds where contrast needs lift |

---

## Dark band (footer + dark hero variants)

| Hex | CSS var | Used for |
|---|---|---|
| `#0B1220` | `--dark-bg` | Footer, dark CTA bands, hero A/C dark gradient base |
| `#07094a` | — | Featured pricing tier subtle blue tint (one-off literal in design) |

### White overlays on dark backgrounds (extracted from per-page CSS)

Used for borders, hover states, and tile backgrounds inside `--dark-bg` regions
(footer, hero, dark CTA, pricing).

`rgba(255, 255, 255, .03 / .04 / .05 / .06 / .07 / .08 / .10 / .12 / .15 / .16 / .18 / .20 / .30 / .35 / .40 / .45 / .50 / .55 / .60 / .65 / .70 / .72 / .75 / .78 / .80 / .82 / .85 / .90)`

The most common steps:

| Step | Used for |
|---|---|
| `.05–.08` | Translucent card backgrounds (pricing tiers, glass) |
| `.10–.16` | Borders on dark surfaces |
| `.30–.50` | Dim secondary text |
| `.55–.70` | Body text on dark |
| `.80–.90` | Strong text + active link state |

---

## Black overlays (dark drop shadows on light surfaces)

| RGBA | Used for |
|---|---|
| `rgba(0, 0, 0, .05)` | Subtle elevations |
| `rgba(0, 0, 0, .25)` | Mid drop shadows |
| `rgba(0, 0, 0, .50)` | Strong drop shadows / lightboxes |

---

## Gradients

All gradients are pairwise combinations of the three brand colors.

| CSS var | Definition |
|---|---|
| `--g1` | `linear-gradient(135deg, #6F3EE5, #0025E8)` (accent → primary) |
| `--g2` | `linear-gradient(135deg, #0025E8, #63DB24)` (primary → support) |
| `--g3` | `linear-gradient(135deg, #63DB24, #6F3EE5)` (support → accent) |
| `--g1-lt` | Light tinted version (~7% / 10% alpha) of `--g1` |
| `--g2-lt` | Light tinted version of `--g2` |
| `--g3-lt` | Light tinted version of `--g3` |

Used for: hero background washes, section underlay tints, featured-card glows,
gradient text on numerals (HeroB tiles, HeroC emphasis word, Results stats).

---

## Tonal scales (auto-generated from brand hues)

The `tokens.jsx` runtime exposes a `scale(hex)` helper that builds a 9-step
tonal scale (50…900) for any hex by mixing toward white (steps 50–400) or
black (steps 600–900). These are not statically baked into the codebase but
are available at runtime via `window.Dastify.scale(hex)`.

```
50:  mix(hex, #ffffff, .94)   → very pale
100: mix(hex, #ffffff, .86)
200: mix(hex, #ffffff, .72)
300: mix(hex, #ffffff, .55)
400: mix(hex, #ffffff, .28)
500: hex                       → base brand color
600: mix(hex, #000000, .18)
700: mix(hex, #000000, .34)
800: mix(hex, #000000, .50)
900: mix(hex, #000000, .66)   → near-black tint
```

---

## Colors by component context (quick lookup)

| Component | Color usage |
|---|---|
| **Nav (`.nav`)** | bg `--primary`, text `#fff`, CTA pill bg `#fff` → text `--primary`; CTA hover bg `--support` → text `--ink-900` |
| **Footer (`.site-footer`)** | bg `--dark-bg`, text `rgba(255,255,255,.65)`, highlight links `--support`, social icon bg `rgba(255,255,255,.05)` border `rgba(255,255,255,.15)` |
| **Hero (HeroA/B/C)** | bg `--dark-bg` + `--g1` overlay; emphasis em uses gradient text-clip; HeroC orbs `color-mix(--accent/--primary/--support 30%, transparent)` blur 80px |
| **Service cards** | bg `#fff`, border `--bd-dk`, hover border `--primary` |
| **Pricing tiers** | bg `rgba(255,255,255,.04)`, border `rgba(255,255,255,.10)`; featured: bg gradient w/ `rgba(111,62,229,.18 → .05)`, border `rgba(111,62,229,.40)`, glow shadow `rgba(111,62,229,.25)` |
| **WeServe specialty cards** | bg `--bg2`, hover bg `color-mix(--primary 4%, #fff)` border `--primary` |
| **GrowthFunnel steps** | bg `#fff`, border `--ink-300`; open state border `--primary` + halo `rgba(0,37,232,.12)` |
| **AboutPreview band** | bg `color-mix(--primary 4%, #fff)`, hairlines `color-mix(--primary 10%, transparent)` |
| **About timeline dots** | `--primary` filled, halo `rgba(0,37,232,.20)` on hover |
| **Final CTA orb** | radial gradient mixing all three brand hues at low opacity over `--dark-bg` |

---

## Where this is enforced in code

- **Token block:** [src/app/globals.css](../src/app/globals.css) lines 1–80 (`:root` declarations)
- **Per-page hp2 / ab2 / sv2 / cs2 / ct2 / bk2 / bl2 / bp2 styles:** appended in dedicated `/* v2 ... */` blocks at the bottom of `globals.css`
- **Override block at EOF:** ensures per-page CSS blobs from PageConverter don't undo the redesign nav/footer treatment

---

## Don'ts

- **Don't add new hex codes outside this palette.** If a new shade is needed,
  derive it from `color-mix(in srgb, var(--primary) <pct>%, transparent/#fff/#000)`.
- **Don't reintroduce the cream `#F5F1E8` or muddy blue `#0367a5`** from the
  pre-redesign token set.
- **Don't bypass the v2 aliases.** New code should reference `--primary` /
  `--accent` / `--support` / `--ink-900` / `--dark-bg`. The legacy `--purple` /
  `--blue` / `--green` aliases exist only because hundreds of older block
  rules depend on them.
