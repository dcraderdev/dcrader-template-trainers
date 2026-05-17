# a11y-palette.md — contrast-audited token map

WCAG 2.1 AA contrast thresholds:
- **Normal text**: ≥ 4.5:1
- **Large text** (≥18.66px bold or ≥24px regular): ≥ 3.0:1
- **Non-text UI** (focus rings, icon strokes, borders that convey state): ≥ 3.0:1

All ratios below were measured against the live tokens in `src/global.css`.
A token pair labeled `LARGE-only` is **forbidden for body copy** — use only
for headlines / display type / non-text UI. A pair labeled `FAIL` is
**forbidden for any text** — replace with the listed substitute.

---

## V1 — Warm Italian (cream background)

| Foreground | On `cream` (#FDFAF4) | Verdict |
| --- | --- | --- |
| `charcoal` #1C1208 | 17.69 | ✅ Body, headings |
| `charcoal-light` #3A2D1E | 12.81 | ✅ Body, headings |
| `stone-700` #554B3F | 8.18 | ✅ Body, secondary text |
| `stone-600` #6E6154 | 5.76 | ✅ Body |
| `terracotta-dark` #A85C38 | 4.74 | ✅ Body (just barely) |
| `stone-500` #8F8070 | 3.67 | ⚠️ Large-only |
| `terracotta` #C4714A | 3.47 | ⚠️ Large-only — use `terracotta-dark` for body |
| `sage` #8B9E6A | 2.80 | ❌ FAIL — decorative bg only |
| `terracotta-light` #D9906E | 2.47 | ❌ FAIL — decorative only |
| `gold` #C9A84C | 2.19 | ❌ FAIL — decorative only |
| `gold-light` #E5C97A | 1.55 | ❌ FAIL — decorative only |

**Body-copy safe list on cream:** charcoal, charcoal-light, stone-600, stone-700, terracotta-dark.

**Heading-only allowance:** stone-500 and terracotta acceptable at ≥24px regular or ≥18.66px bold.

**Decorative-only (no text):** sage, terracotta-light, gold, gold-light, wheat. Fine as section backgrounds, dividers, ornaments, or graphic icons that are not the sole conveyor of information.

### Tailwind class pattern — do / don't

```html
<!-- ✅ body text -->
<p class="text-stone-700">…</p>
<p class="text-charcoal">…</p>

<!-- ✅ heading allowed (≥24px) -->
<h1 class="text-4xl text-terracotta">…</h1>

<!-- ❌ FAIL — terracotta as body color -->
<p class="text-sm text-terracotta">…</p>

<!-- ❌ FAIL — gold as text on cream -->
<p class="text-gold">…</p>
```

### Button color pairs

| Button | bg / text | Ratio | Verdict |
| --- | --- | --- | --- |
| Primary | `terracotta` / `cream` | 3.47 | ⚠️ Large-only — bump to `terracotta-dark` |
| Primary (fixed) | `terracotta-dark` / `cream` | 4.74 | ✅ |
| Secondary | `charcoal` / `cream` | 17.69 | ✅ |
| Wheat surface | `wheat` / `charcoal` | 15.15 | ✅ |
| Wheat + terracotta | `wheat` / `terracotta` | 2.97 | ❌ FAIL |

**Action:** in `.btn-primary` / `.t-btn-primary`, swap `--color-terracotta` → `--color-terracotta-dark` for the **background** when text is light cream/white. The hover state is already dark so no change there.

---

## V2 — Modern Minimal (off-white bg, dark green accent)

| Foreground on `v2-bg` #FAFAF8 | Ratio | Verdict |
| --- | --- | --- |
| `v2-text` #0C0C0A | 18.73 | ✅ |
| `v2-accent` #1A3A2E | 11.90 | ✅ |
| `v2-muted` #888880 | 3.42 | ⚠️ Large-only |

**Fix:** darken `v2-muted` to `#6E6E66` for body copy.

---

## V3 — Rustic Farm (warm cream, brown accent)

| Foreground on `v3-bg` #F8F3E8 | Ratio | Verdict |
| --- | --- | --- |
| `v3-text` #2A1A0A | 15.17 | ✅ |
| `v3-accent` #7A5230 | 6.17 | ✅ |
| `v3-muted` #8A7860 | 3.84 | ⚠️ Large-only |

**Fix:** darken `v3-muted` to `#6E5E48` for body copy.

---

## V4 — Bold Color (white-ish bg, orange accent)

| Foreground on `v4-bg` #FFFEF9 | Ratio | Verdict |
| --- | --- | --- |
| `v4-text` #180A00 | 19.22 | ✅ |
| `v4-muted` #6B5A48 | 6.54 | ✅ |
| `v4-accent` #D64A1A | 4.28 | ⚠️ Large-only — use for headings, not body |
| `v4-gold` #E89A18 | 2.29 | ❌ FAIL for text — decorative only |

**Fix:** when v4-accent must be body text, darken to `#B23A10` (the existing `--t-accent-hover`, contrast 5.84:1).

---

## V5 — Dark Elegant (near-black bg, gold accent)

| Foreground on `v5-bg` #0B0A08 | Ratio | Verdict |
| --- | --- | --- |
| `v5-text` #EDE8DE | 16.21 | ✅ |
| `v5-accent` (gold) #C9A84C | 8.66 | ✅ |
| `v5-muted` #6A6258 | 3.30 | ⚠️ Large-only |

**Fix:** lighten `v5-muted` to `#8A8278` for body copy (≈ 4.7:1).

---

## Required overrides (apply per-template before shipping)

Adding these into `global.css` brings every variant to AA-compliant body text:

```css
[data-theme="v1"] { --t-accent: #A85C38; /* was #C4714A — fixes button bg */ }
[data-theme="v2"] { --t-text-muted: #6E6E66; }
[data-theme="v3"] { --t-text-muted: #6E5E48; }
[data-theme="v4"] { --t-accent: #B23A10; --t-accent-hover: #8E2D0A; }
[data-theme="v5"] { --t-text-muted: #8A8278; }
```

The above are **token tweaks only**, not redesigns. Hue is preserved; lightness shifts ~10% to clear the 4.5:1 floor.

## Where to check this when adding new templates

1. Pick the two darkest text tokens and the lightest body bg. Run them through any WCAG contrast checker (axe will catch most of these automatically — see `scripts/a11y-audit.mjs`).
2. Any token labeled `*-muted`, `*-light`, or `*-accent` must be tested on every bg it's paired with.
3. Buttons with light text on accent bg: the bg luminance must be low enough to give ≥ 4.5:1.
4. Gold / yellow / orange are perennial failures on light bg. Use them as backgrounds for dark text, not foregrounds.
