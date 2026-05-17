# a11y/ — shared accessibility primitives

Drop-in WCAG 2.1 AA helpers used across all dcrader industry templates.
See `~/Documents/github/SHARED_A11Y_README.md` for the full installation
guide for individual repos.

## Components

| File | Purpose |
| --- | --- |
| `SkipToContent.astro` | First-focusable bypass link → `#main-content` (WCAG 2.4.1) |
| `VisuallyHidden.astro` | Screen-reader-only text wrapper (clip-path technique) |
| `AccessibleIconButton.astro` | Icon-only button/link with mandatory `aria-label` |
| `FocusTrap.astro` | Tab/Shift+Tab cycling + Esc-to-close for modals/menus |
| `AccessibleField.astro` | Label/hint/error wiring for form inputs |

## Stylesheet

`../styles/a11y.css` ships the globals: focus-visible reset,
`prefers-reduced-motion` baseline, `.a11y-sr-only` helper.

## Audit script

`../../scripts/a11y-audit.mjs` runs axe-core via Playwright against a
URL list and writes a JSON report. Requires devDeps `playwright` and
`@axe-core/playwright`.

## Color palette guidance

See `../styles/a11y-palette.md` for the contrast-audited token map.
