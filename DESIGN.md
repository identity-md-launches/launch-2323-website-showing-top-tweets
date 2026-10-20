# Pepe Wire design system

Source of truth: `src/styles.css` (tokens and all component styles), `src/App.tsx` (markup and
components), `public/pepe-armed.svg` and `public/favicon.svg` (art). There is no CSS framework.

## Overview

Pepe Wire is a one-page reader for the top X posts about IdentityMD. Its audience is IMD holders
and operators who want the notable posts in one place. The look the brief asked for is dark green
with pepes armed with AI: a near-black green page, slightly lighter green surfaces, one lime accent,
and a hand-drawn pepe in a glowing visor holding a neural blaster with an AI chip on its shirt.

Hierarchy is carried by size and space, not decoration. The page reads top to bottom: site bar,
intro (headline, one plain line, the art), the filter panel, then the ranked feed. The art is the
only illustration; everything else is flat surfaces with one hairline border.

## Colors

All colors are hex custom properties on `:root` in `src/styles.css`. Primitives (`--green-*`,
`--lime-*`) are never used by components directly; components use the role tokens.

| Role token | Primitive | Value | Use |
| --- | --- | --- | --- |
| `--color-bg-page` | `--green-950` | `#06130c` | Page background, input fills, segmented-control track, rank badge |
| `--color-bg-surface` | `--green-900` | `#0b1f14` | Filter panel and post cards |
| `--color-bg-surface-hover` | `--green-850` | `#10291b` | Hover fill on unselected segments and the Open on X button (hover-capable pointers only) |
| `--color-border` | `--green-700` | `#2a5238` | Structural borders: panel, cards, empty state, footer rule |
| `--color-border-control` | `--green-500` | `#4f805c` | Boundaries of inputs, the select and the Open on X button |
| `--color-text-primary` | `--green-100` | `#e3f2e6` | Body text, headings, author names |
| `--color-text-secondary` | `--green-300` | `#a3c7ac` | Lede, meta lines, metrics, count line, placeholder, footer |
| `--color-accent-solid` | `--lime-400` | `#8be36a` | Fill of the one selected/primary control: checked sort segment, Clear filters, skip link |
| `--color-accent-text` | `--lime-400` | `#8be36a` | Links, Show full post, rank numbers |
| `--color-on-accent` | `--green-950` | `#06130c` | Text on accent fills |
| `--color-focus` | `--lime-300` | `#b5f08f` | 2px focus outline, 2px offset |

Contrast computed from these declared pairs (WCAG formula, run during validation): primary text on
page 16.37:1, on surface 14.84:1; secondary text on surface 9.28:1, on hover fill 8.36:1; accent
text on surface 10.89:1; on-accent on accent 12.02:1; focus ring on surface 12.97:1; control
border on surface 3.75:1 and on page 4.14:1. The structural `--color-border` is 1.94:1 on surface
and is only used where a boundary is decorative grouping, never as the only edge of a control.

The art uses its own fixed colors inside the SVG (pepe green `#5aa441`, outline `#102a12`, lips
`#b4533a`, shirt `#1f5a7a`, visor glow `#8be36a`). There is one theme (dark); `color-scheme: dark`
is set so native controls and scrollbars match.

## Typography

- Family: `--font-sans` = `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
  sans-serif`. No web fonts are loaded, so the rendered face is the platform UI font.
- Weights: 400 (body), 600 (labels, author names, buttons, segments), 700 (brand, h1, rank).
- Scale (five sizes, all in `:root`):

| Token | Size | Roles |
| --- | --- | --- |
| `--text-h1` | `clamp(1.75rem, 1.1rem + 2.6vw, 2.75rem)` (28px at 390, 44px at 1440) | Page headline only; line-height 1.1, letter-spacing -0.02em, `text-wrap: balance` |
| `--text-h2` | 1.25rem | Section heading "Ranked posts", brand name |
| `--text-body` | 1rem | Body, post text, inputs and select (16px so iOS does not zoom) |
| `--text-ui` | 0.9375rem | Field labels, segments, buttons, metrics, count line, nav link |
| `--text-sm` | 0.8125rem | Handle and date, media note, footer |

- Body line-height 1.55. Post text is capped at `65ch` and uses `white-space: pre-line` so the
  authors' line breaks survive; `overflow-wrap: anywhere` keeps long URLs inside the card.
- Counts use `font-variant-numeric: tabular-nums`. Copy is stored in sentence case; no
  `text-transform` and no tracked capitals anywhere.
- Font smoothing is set once on `html`.

## Layout

- Container: `.wrap`, `max-width: 72rem`, inline padding `1rem` (or the safe-area inset if larger).
- Spacing steps: `--space-1` 0.25rem, `-2` 0.5rem, `-3` 0.75rem, `-4` 1rem, `-6` 1.5rem,
  `-8` 2rem, `-12` 3rem. Inside a group the gap is 0.25 to 0.75rem; between groups it is 1rem or more.
- Breakpoints come from the content and use `rem`:
  - Below 40rem (mobile): intro is a two-column grid of text and a 6.5rem pepe; filter panel stacks
    search, author and sort; feed is one column; post footers wrap so Open on X drops under the
    metrics at 320.
  - 40rem and up: art grows to 10rem; search and author sit side by side, sort spans the row.
  - 64rem and up: art 15rem, intro gets 2rem block padding; search, author and sort share one row;
    the feed becomes two equal columns.
- The headline, search field, sort control and the top of the first post are all on the first
  screen at 390x844 (measured tops 72, 288, 435 and 601px).
- Logical properties (`padding-inline`, `margin-block-start`, `inset-inline-start`) are used
  throughout.

## Elevation and depth

Deliberately flat. There are no shadows. Depth is two tonal layers (page, then surface) plus a
1px `--color-border` on surfaces. No surface has both a border and a shadow, and no card sits
inside another card. Avatars get a `1px` outline of `oklch(1 0 0 / 0.1)` inset by 1px so light
photos keep an edge on the dark card.

## Shapes

- `--radius-card` 16px: filter panel, post cards, empty state.
- `--radius-control` 10px: inputs, select, segments, buttons, skip link.
- The segment track uses `calc(var(--radius-control) + var(--space-1))` so its corners stay
  concentric with the 0.25rem-inset segments.
- Circles: avatars and the rank badge.
- The empty state uses a dashed border to read as a placeholder, not content.

## Components

All components live in `src/App.tsx`; their styles share the class names below in `src/styles.css`.

- **Site bar** (`.site-bar`, `.brand`, `.bar-link`): brand link to `./` with the favicon art and
  an external "Visit imd.fun" link. Both are at least 44px tall.
- **Intro** (`.intro`, `.lede`, `.intro-art`): one `h1` of five words, one plain line, the art
  with descriptive alt text.
- **Filter panel** (`form.controls[role=search]`): a labelled search input (placeholder is an
  example, not the label), a native `select` of authors, and the sort control. Filtering is live;
  the form never submits.
- **Segmented sort** (`fieldset.sort`, `.segments`, `.segment`): native radio buttons stretched
  invisibly over their labels, so click, Tab, arrow keys and Space all work natively. The checked
  segment takes the accent fill; focus shows the focus outline on the visible segment; forced-colors
  mode adds a `CanvasText` outline to the checked one.
- **Count line** (`.count-line[role=status]`): "Showing N of 8 posts", a polite live region present
  from first render.
- **Post card** (`PostCard`, `.post article`): rank badge, avatar, author name, handle and UTC date
  in a `time` element, the post text, an optional "Show full post" / "Show less" toggle
  (`.link-button`, `aria-expanded`, `aria-controls`) for posts over 280 characters, an optional
  media note, metrics (likes, reposts, replies, views as compact numbers with the exact number in
  `title` and a visually hidden label), and the Open on X button (`.open-link`, new tab, the hidden
  text names the author and says it opens a new tab). Collapsed posts show a 240-character excerpt
  cut at a word boundary with blank lines folded, ending in a single ellipsis character.
- **Empty state** (`.empty`): names the query, gives one hint, and a filled "Clear filters" button
  (`.button`) that resets search and author and returns focus to the search field.
- **Skip link** (`.skip-link`): first tab stop, jumps to `#feed`, which takes programmatic focus.
- **Footer** (`.site-foot`): snapshot date and source of the counts.

Motion: colors change over 150ms on segments and the Open on X button. With
`prefers-reduced-motion: no-preference`, `.button` and `.open-link` scale to 0.96 on press. No
endless or entrance animations.

## Data

Posts live in `src/data/posts.json`, written by `scripts/capture-posts.mjs` from FxTwitter's
public status API, with avatars saved to `public/avatars/`. `src/feed.ts` holds the typed data,
sort options and the pure `selectPosts` filter and sort function.

## Do's and don'ts

- Do take colors only from the role tokens; add a role token when a new job appears.
- Do keep one filled accent control per view (the checked segment, or Clear filters in the empty
  state). Other actions use the bordered `.open-link` style or text links.
- Do use `--color-border-control` for any control boundary and `--color-border` for grouping only.
- Do stay on the five-size scale and three weights; inputs stay at `--text-body`.
- Don't add shadows, gradients behind text, all-caps labels or emoji in the site's own copy.
- Don't add a second illustration style; reuse `pepe-armed.svg` or draw in its outline and palette.
- To add a page section: wrap it in `.wrap`, give it an `h2` at `--text-h2`, put items in
  `.post article`-style cards on `--color-bg-surface` with a 16px radius, and space sections with
  `--space-8`.
