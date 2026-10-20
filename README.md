# Pepe Wire: top posts about IdentityMD

A one-page static site that ranks notable X posts about IdentityMD (the IMD agent network). Dark
green, guarded by a pepe armed with AI. Search the posts, filter by author, sort by most liked,
most viewed or newest, expand long posts, and open any post on X.

Built with Vite 5, React 18 and TypeScript. The finished export is committed in `dist/` with
relative asset URLs (`base: "./"`), so it works from an IPFS gateway subpath or an ENS name with
no server rewrites.

## Install, preview, rebuild

Requires Node 18 or newer (validated with Node 24.9.0, npm 11.6.0).

```sh
npm ci              # install from package-lock.json
npm run dev         # local dev server with hot reload
npm run typecheck   # tsc --noEmit
npm run build       # writes the static export to dist/
npm run preview     # serves dist/ locally to check the production build
```

Commit `dist/` after rebuilding; the host serves the committed export and does not build.

## Updating the posts

The posts and counts are a snapshot in `src/data/posts.json`, captured from FxTwitter's public
status API (`https://api.fxtwitter.com/status/{id}`, no X login or key). To refresh the counts or
change which posts appear, edit `POST_IDS` in `scripts/capture-posts.mjs`, then:

```sh
npm run capture-posts   # rewrites src/data/posts.json and public/avatars/
npm run build
```

The share image `public/og.png` is rendered from `public/pepe-armed.svg` with Playwright:
`IMD_PLAYWRIGHT=/path/to/playwright/index.mjs npm run make-og` (Playwright is not a project
dependency; install it anywhere outside the repo).

## Layout

- `src/App.tsx` page and components, `src/feed.ts` data and pure sort/filter logic,
  `src/styles.css` tokens and styles, `src/data/posts.json` the post snapshot.
- `public/` favicon, art, share image and avatars (copied to `dist/` as is).
- `scripts/` capture and share-image scripts.
- `DESIGN.md` design system; `artifacts/validation.md` the full review and test record.

## Validation results (final build, 2026-10-20)

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Production build | `npm run build` | exit 0; `dist/index.html` 1.34 kB, CSS 8.54 kB, JS 165.00 kB (54.80 kB gzip) |
| Interactions | Playwright script serving `dist/` under `/preview/`, run with `node` | 29 of 29 passed |
| Design probe | `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | 16 of 16 checks passed |

The interaction run covered: 8 posts render in most-liked order; the headline, search, sort and
first post sit on the first screen at 390x844; sort by most viewed and newest match the data
order; keyboard Space and arrow keys change the sort with a visible focus outline; search narrows
the list and updates the live count; a no-match search shows the empty state, and Clear filters
restores all posts and refocuses search; the author filter; Show full post expands and Show less
collapses; every Open on X link is an `x.com/.../status/...` URL opening in a new tab with
`noopener`; the skip link is the first tab stop and moves focus to the feed; no horizontal scroll at
320, 390, 768, 1024 and 1440; no console errors or failed local requests.

Limitations: the test script and screenshots lived in `test/scratch/`, which is not submitted (two
final screenshots are kept in `artifacts/screenshots/`). No screen-reader session, physical device
or native 200% zoom test was run. Counts are a fixed snapshot and will drift from live X numbers.
The ranking covers the eight posts listed in `scripts/capture-posts.mjs`, not every post on X.
