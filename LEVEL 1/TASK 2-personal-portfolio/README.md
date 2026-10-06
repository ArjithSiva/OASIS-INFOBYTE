# Arjith A — Portfolio

Built with React, TypeScript, Tailwind CSS v4, Vite, Framer Motion, and GSAP.
Two visual modes, both built around Solo Leveling's "system window" look —
**Shadow Mode** (violet, Season 2 energy) and **System Mode** (deep navy blue
with the Shadow Soldiers' icy accent, Season 1 energy) — toggle from the
sidebar with a full-screen sweep transition between them, or default to
whichever the visitor's device prefers. One font (Lato) is used site-wide.
Every card is the same layered "system window" panel (`SystemPanel`): an
unclipped glow, a glowing bar across the top and bottom edges, tick-mark
"circuit trace" accents down the sides, a chamfered gradient frame (cut at
the top-left and bottom-right corners), and a white-outlined inner content
box.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Things to swap in before you consider this "done"

1. **Your photo** — the Profile section currently shows a placeholder "A" glyph
   where your portrait should go. Drop an image in `public/images/` and swap it
   into `src/sections/Profile.tsx`.
2. **Resume file** — `public/resume.pdf` already has your uploaded resume in it,
   so both the "View Resume" (in-page preview) and "Download Resume" buttons
   work right now. Replace that file whenever you update your resume; neither
   button needs to change.
3. **Ambient audio** — `public/audio/ambient.mp3` is a synthesized placeholder
   drone so the mute/unmute toggle has something to actually play. Swap in
   your own track at the same path and it'll just work — the player already
   loops it and respects the mute toggle.
4. **Contact form inbox** — the Guild section posts to
   `https://formsubmit.co/ajax/aarjith2006@gmail.com` (in `src/sections/Contact.tsx`).
   The form collects name, email, company, phone, subject, and message —
   company and phone are optional. **Important**: FormSubmit requires a
   one-time confirmation the *first* time a message is sent to a given
   address — check that inbox and click the activation link after your first
   real test submission, or messages will silently not arrive. No backend or
   API key needed beyond that.
5. **Favourite GitHub repos** — the Progress section shows your 6 most
   recently-updated public repos automatically, plus 3 hand-picked
   "Favourites." Pick those 3 by editing `featuredRepositories` in
   `src/data/github.ts` — use the exact repo name from the URL
   (`github.com/ArjithSiva/<this-part>`), not the display title. No UI code
   to touch. Everything else about GitHub (stats, contribution graph,
   descriptions, languages, stars, last-updated dates, live-demo links) is
   fetched live from `api.github.com` at runtime — nothing fabricated, and
   if a repo has no `homepage` URL set on GitHub, no demo button shows for
   it. If the API is ever unreachable, the last successful fetch (cached in
   the browser) is shown with a "Cached" label instead of breaking.
6. **Social links** — GitHub, LinkedIn, YouTube, Spotify, Duolingo, and Email
   all live in one place: `src/data/socials.ts`. Edit the `href` values there
   and every usage (Contact section, desktop sidebar, mobile menu) updates
   together.

### Why there's no live Duolingo stats card

There's no official public Duolingo API, and the unofficial one isn't
reliably reachable from a browser on a static site (no server to route
around its CORS restrictions from — see the earlier discussion). Rather
than ship a "stats" widget that would silently be wrong or empty most of
the time, Duolingo is just a profile link in `src/data/socials.ts`, same as
the others. If you ever want to revisit a live stats card, that'd mean
standing up a small server-side proxy (e.g. a Cloudflare Worker) to make
the request on the site's behalf — a real infrastructure addition, not a
frontend change.

## Default theme

On a visitor's first-ever visit (no saved preference yet), the site now
matches their OS/browser color-scheme setting — light-mode devices get
System Mode, dark-mode (or no-preference) devices get Shadow Mode. A tiny
inline script in `index.html` applies this before first paint so there's no
flash of the wrong theme; the logic is duplicated (deliberately) in
`getInitialMode()` in `src/hooks/useTheme.tsx` — keep both in sync if you
ever change it. Once someone manually toggles the mode, that choice is
saved and takes over from then on.

## Deploying to GitHub Pages

This is set up as a **project page** at `ArjithSiva.github.io/portfolio` (i.e.
the repo is named `portfolio` and lives separately from your `ArjithSiva.github.io`
user-site repo, if you have one). That means every asset path needs the
`/portfolio/` prefix, which is handled in one place:

```ts
// vite.config.ts
const REPO_NAME = 'portfolio'
export default defineConfig({
  base: `/${REPO_NAME}/`,
  ...
})
```

If you ever rename the GitHub repo, update `REPO_NAME` to match — that's the
only place the path is hardcoded.

**To deploy:**

1. Push this repo to `github.com/ArjithSiva/portfolio`.
2. In the repo's Settings → Pages, set **Source** to "GitHub Actions".
3. Push to `main` — `.github/workflows/deploy.yml` builds and deploys
   automatically. First deploy can take a minute or two to go live.

**Troubleshooting a blank white page after deploy**

If `https://arjithsiva.github.io/portfolio/` loads a white page (tab title shows,
no content) and the browser console says `Failed to load resource ... 404` for
`src/main.tsx`, the site is serving the raw source instead of the built app. This
happened on the first deploy:

- Cause: Pages was still set to "Deploy from a branch" (`main` / root), so GitHub's
  automatic `pages build and deployment` run published the repo as-is and overwrote
  the built `dist` from the workflow.
- Fix: Settings → Pages → **Source: GitHub Actions**, then Actions → "Deploy to
  GitHub Pages" → **Run workflow** (or re-run the latest run). Confirm Settings →
  Pages says it was last deployed by "Deploy to GitHub Pages", then hard reload
  (Ctrl+Shift+R).
- `package.json`, `package-lock.json` and `vite.config.ts` must sit at the **repo
  root** (not inside a subfolder) for the workflow as written to work. If the
  project lives in a subfolder, add `working-directory: <folder>` to the build steps
  and set the upload `path` to `<folder>/dist`.
- A `tsc` error fails the build and blocks the deploy — check the Actions log.
- To test the production build locally: `npm run build && npm run preview`, then
  open `http://localhost:4173/portfolio/`.

No router is used — the whole site is one page with anchor-linked sections
(`#awakening`, `#profile`, etc.), navigated via smooth scroll rather than
URL routes. This sidesteps the classic GitHub Pages SPA-routing problem
(deep links 404ing on refresh) entirely, since there's nothing to 404 —
every "page" is just a scroll position on `index.html`.

## Project structure

```
src/
  components/
    background/   theme-aware ambient backdrop + the mode-switch sweep transition
    navigation/    desktop sidebar + mobile menu (nav, socials, theme toggle)
    cursor/        custom cursor (desktop, fine-pointer only)
    audio/          background audio player
    projects/       drag-to-browse project slider
    progress/       GitHub repo cards + grid (Progress section)
    ui/             buttons, tags, section headings, theme toggle, brand icons,
                    SystemPanel (the card shape — see below)
  data/             content — projects, skills, experience, section registry,
                    social links, GitHub favourites config
  hooks/            theme state, scroll-spy, mouse position, reduced-motion,
                    GitHub data
  lib/              GitHub data provider (fetch + localStorage cache),
                    date formatting
  types/            shared TypeScript types for GitHub data
  sections/         the seven page sections, one file each (Resume also
                    renders the in-page resume-preview modal)
```

GitHub data flows through a small provider layer (`src/lib/githubProvider.ts`)
so UI components never know or care where the data came from — live fetch or
browser cache produce the same typed shape (`src/types/github.ts`).

### The "system window" card shape

Every card site-wide — project cards, repo cards, the contact form panel, the
Profile photo frame, the resume-preview modal — is a `<SystemPanel>`
(`src/components/ui/SystemPanel.tsx`), which always renders the same layered
markup (`.sw-panel` rules in `src/index.css`):

1. an unclipped, blurred glow behind everything (so it isn't cut off by its
   own or a parent's clipped edge)
2. a glowing bar across the top edge and another across the bottom edge
3. tick-mark "circuit trace" accents down the left/right edges (skip this
   with `trace={false}`, or it's off by default on `size="sm"` cards)
4. a gradient frame chamfered at the top-left and bottom-right corners only
   (the sharp corners run bottom-left to top-right — that asymmetry is
   deliberate, matching the reference)
5. an inner content box with a thin white outline

Everything recolors automatically between Shadow and System mode because
it's built entirely from the `[data-theme]`-scoped custom properties in
`index.css` — no per-component theme branching needed. Pass `size="sm"` for
a tighter corner-cut on compact cards (repo cards), and `fullHeight` when a
card needs to stretch to match its neighbors in a grid.

### The Quest Board (Projects slider)

`src/components/projects/ProjectSlider.tsx` renders one `SystemPanel` that
never moves or resizes as you page through projects — only the content
swaps (fast fade-out, then the tagline/title type in via
`TypewriterText`). Height is fixed to whichever project has the most
content: every project renders once, stacked invisibly in the same CSS
grid cell (`grid-area: 1 / 1`), so the grid naturally sizes to the tallest
one; the real, interactive, animated card sits absolutely positioned on
top of that reserved space. Swiping still works but rubber-bands back to
the same spot (`dragSnapToOrigin`) instead of carrying the card away.

### Hero name (StrokeText) and mobile nav (StaggeredMenu)

Both are adapted from [React Bits](https://reactbits.dev) into TypeScript,
living in `src/components/effects/StrokeText.tsx` and
`src/components/navigation/StaggeredMenu.tsx` — animation logic is
unchanged from the originals; only typing and (for the menu) the visual
skin changed. Both depend on `gsap`.

- **StrokeText** draws the Hero name's outline in, then fills it. Colors
  are picked per theme in `Hero.tsx` and the component is remounted (`key={mode}`)
  on a theme switch, so the name redraws in the new palette rather than
  just recoloring instantly.
- **StaggeredMenu** replaces the mobile menu only (`src/components/navigation/MobileNav.tsx`)
  — desktop keeps the `Sidebar`/`LineSidebar`. Its CSS
  (`StaggeredMenu.css`) was reskinned to use the site's fonts/color tokens
  instead of the original's hardcoded white panel/black text. Colors that
  feed GSAP's color tweens (`menuButtonColor`, `openMenuButtonColor`,
  `accentColor`, the prelayer `colors`) are passed as literal hex values
  per theme from a small map in `MobileNav.tsx`, not as `var(...)`
  references — GSAP needs a parseable color to tween, not a CSS custom
  property.

Content lives in `src/data/*.ts` — update project descriptions, skills, or
experience there without touching any component code.
