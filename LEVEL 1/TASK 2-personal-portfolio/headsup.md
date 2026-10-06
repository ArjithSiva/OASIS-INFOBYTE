# Handoff notes — portfolio session (continues from portfolio-solo-leveling-v2.zip)

If you're picking this up in a fresh chat: re-upload the zip attached alongside this
file (`portfolio-solo-leveling-v3.zip`) — the sandbox doesn't persist between chats,
only this note and Claude's memory do.

## What changed this session

**Skill Runes (Gear/LogoLoop)**
- Every logo now has a real `href` to its official site; FormSubmit removed from the loop.
- Added: Antigravity, PostgreSQL, Ollama, Hermes Agent, Gemini, ChatGPT, Perplexity,
  Microsoft Office, Windows, Fedora, Vercel, Google.
- Real logo images (not text badges) for VS Code, Bolt.new, React Bits, Antigravity,
  ChatGPT/OpenAI, Windows, and Microsoft — sourced from the CC0-licensed
  `gilbarbara/logos` GitHub repo and saved to `public/icons/`.
- **Hermes Agent has no standalone icon anywhere I could verify** (checked Simple
  Icons, gilbarbara/logos, and the NousResearch/hermes-agent GitHub repo directly —
  only a wide pixel-art wordmark banner exists there, not a square mark). Used a
  letter/glyph icon instead: the caduceus (☤), the same symbol Nous Research puts next
  to "Hermes Agent" in their own README. If a real logo shows up later, swap
  `public/icons/hermes-agent.svg`.
- React Bits uses their actual site favicon (extracted from their `favicon.ico`,
  saved as `public/icons/reactbits.png`) — not their full wordmark logo.
- Bolt.new has no dedicated mark of its own; using StackBlitz's (its parent company)
  bolt icon (`public/icons/stackblitz.svg`).
- Left-edge spacing fixed (was flush against the sidebar).
- `LogoLoop.tsx` verified line-by-line against the real reactbits.dev source
  (`src/ts-tailwind/Animations/LogoLoop/LogoLoop.tsx`). It was already a faithful port;
  the one real gap was the reduced-motion RAF loop not actually stopping (it was only
  masked visually via a CSS `!important` override, so it kept computing every frame
  for nothing on reduced-motion devices) — fixed to match the official early-return.

**Skill Tree (Awakened Skills / MagicBento)**
- Restructured from 6 single-language cards into 8 category cards matching Arjith's
  own skills list: Programming Languages, Web Development Kit, IoT Technologies,
  Hardware, AI, Agents & Tools, Database Management, Others. Data lives in
  `src/data/languages.ts`.
- Grid CSS (`MagicBento.css`) retuned for 8 cards: two wide cards on top, four even
  cards in the middle, two wide on the bottom.
- **New: click-to-reveal description per skill.** Each skill chip is now a button;
  clicking it shows a one-line description under the chip list (click again, or
  another chip, to switch). Implemented in `Skills.tsx` (`SkillCardBody`) +
  `.skill-chip-desc` in `MagicBento.css`.
- ⚠️ **The description text for all ~35 skills was drafted by me, not supplied by
  Arjith.** They're short and factual but worth a read-through/edit pass — especially
  the AI/Agents & Tools ones (Hermes Agent, Antigravity, NotebookLM, Aider, v0, etc.)
  since I was inferring intended use rather than being told specifics.

**Sidebar / navigation**
- Labels changed (sidebar/mobile nav only, page headings untouched): "Awakened
  Skills"→Skills, "Progress Log"→Progress, "Summoned Projects"→Projects, "Hunter
  Network"→Network.
- Record moved above Network — both the nav order (`data/sections.ts`) and the actual
  physical section order on the page (`App.tsx`), with `SectionHeading` index numbers
  (08/09) swapped to match in `Resume.tsx` / `HunterNetwork.tsx`.
- SkillRack, Duolingo, and HackerRank removed from the small icon rows (desktop
  sidebar footer + mobile menu "Socials" list) via a new filtered export,
  `hunterNetworkQuickLinks`, in `data/hunterNetwork.tsx`. The full Hunter Network
  *section* on the page still lists all 9 — only the two nav quick-link rows were
  trimmed, since that's what was asked.
- Volume slider: removed the `disabled={!audio.enabled}` prop on both desktop and
  mobile — you can now drag it to set volume while muted, it just stays silent until
  unmuted.
- Mobile-only volume slider bumped from 16 to 30 bars (denser, thinner) per request.

**Bugs found and fixed**
- **Profile picture misalignment**: `ProfileCard.css` sized the card off `80svh`
  (viewport height) instead of its actual 280px column width, so on wide/tall screens
  it overflowed into the bio text. Now sized from `width: 100%` of its column.
- **Rainbow/holographic tilt effect**: toned down the saturate/contrast/brightness
  swing in the hover-driven filter formula (was maxing out into near-full rainbow
  saturation toward the edges of a tilt). Still holographic, just calmer.
- **Shadow Army "empty loop"**: `RepoDriftWall.css` had two CSS masks
  (`mask-composite: intersect`) stacked on top of each other — a radial vignette AND
  a top-to-bottom linear gradient — which together blanked out a much bigger band
  than intended, mostly near the top, making the wall look like it had dead gaps
  mid-loop. Reduced to a single vignette mask. Also brightened the resting-tile
  opacity (0.72→0.88, overlay 0.32→0.16) and expanded description text from 2 to 3
  lines, since the dimming was making things hard to read without hovering.
- **Mobile menu purple edge**: the StaggeredMenu's prelayer wipe-effect container was
  left at `opacity: 1` permanently after opening (relying purely on the panel's
  higher z-index + opaque background to hide it), which let a sliver of its bright
  `#7c3aed` layer color bleed through at the screen edge — almost certainly a
  `backdrop-filter` edge-blur rendering quirk. Now explicitly hidden
  (`opacity: 0`) once the open animation completes, and restored right before the
  close animation needs it again. Also added explicit `overflow-x: hidden` on the
  panel as a second line of defense. **Not visually re-verified on a real device** —
  worth a fresh screenshot to confirm.
- **Cursor**: replaced the glowing blob (heavy `box-shadow` blur) with a crisp
  crosshair/reticle (thin ring + tick marks, no blur). Also fixed the resume-viewer
  cursor issue properly: the resume preview is a real `<iframe>` (the PDF renders in
  the browser's own viewer — a separate document the page's cursor-hiding trick can
  never reach into). `Resume.tsx` now broadcasts open/close via a
  `RESUME_VIEWER_STATE_EVENT` custom event; `CustomCursor.tsx` listens and steps aside
  (renders nothing, restores the native cursor) while the viewer is open.
- **Quests / "Client Website Modernization" status**: was hardcoded `"Live · 2024–2026"`
  implying a closed date range; changed to `"Live · 2024–present"` since it's ongoing.
- **Duolingo icon**: swapped the generic `Bird` icon for lucide's `Languages` icon in
  `data/hunterNetwork.tsx`.
- **Favicon (Shadow Mode)**: was a purple radial glow over a dark-purple background
  (read as "light" at favicon size); replaced with a flat `#030005` background and
  the "A" set in Cinzel, colored `#a855f7`. Only the favicon changed — the "ARJITH A"
  logo text elsewhere (sidebar, mobile menu) was intentionally left alone per Arjith's
  clarification.

## Known limitations / things I couldn't do

- **Sandboxed network access**: `bash_tool` can only reach a small domain whitelist
  (npm, PyPI, GitHub/raw.githubusercontent.com, a few OS mirrors) — no general
  internet. `web_fetch` can only pull pages/URLs that already appeared as a top-level
  search or fetch *result*, not arbitrary asset URLs found embedded inside a fetched
  page's HTML (tried this for Nous Research's own CDN-hosted Hermes logo — blocked).
  This is why every real logo added this session came from GitHub-hosted sources
  specifically (gilbarbara/logos, react-bits' own repo) rather than the brands' own
  sites. If a better/official Hermes Agent icon exists somewhere GitHub-reachable,
  it's worth another look.
- The mobile-menu color fix and the DriftWall mask fix are my best diagnosis from
  reading the CSS/animation code carefully, not from watching it render live in a
  browser — this environment has no visual browser preview. Worth a real screenshot
  pass before considering both fully closed.

## Still open (not addressed / no answer given yet)

- The never-clarified `Background.tsx` / Gate Raids slider "delay" complaint from an
  earlier session — still unresolved, never re-raised either.
- General polish: the JS bundle is >500KB (vite build warning), could be code-split;
  not addressed as it was never asked for.

---

## Session 3 (follow-up from user screenshots): bugs found in the session-2 work

The user sent screenshots after testing session 2's build and reported real regressions
— all fixed and confirmed via a clean `npm run build`, but **none visually re-verified**
in an actual browser (still no live preview in this sandbox).

**Profile card — root cause of both the misalignment and the "Contact wraps to 2 lines" bug**
`ProfileCard.css` still had several rules sized in `svh` (viewport height) — `.pc-details
h3/p` font-size, plus three `@media (max-width: 768/480/320px)` blocks that *also* set
`.pc-card` height in `svh`. Session 2 fixed the card's own width/height to be driven by
its ~280px column instead of viewport height, but missed that these other rules existed
and were keyed to **viewport width**, not the card's actual (now-constant ~280px)
rendered width — so on a normal desktop viewport none of the "compact" overrides ever
fired, even though the card itself was only 280px wide. Fixed by making the compact
sizing the permanent default (card width never changes now, so there's nothing to key a
breakpoint off), removing all `svh` usage, and adding `white-space: nowrap` +
`flex-shrink: 0` to the Contact button so it can't wrap.

**Skill Tree — click-to-describe was hiding content, not revealing it**
The per-card inline description (session 2) pushed a fixed-height MagicBento card past
its own bounds, so the chip list + description got clipped/hidden instead of shown —
visible in the user's screenshot as chips cut off mid-row once one was selected.
Restructured: `Skills.tsx` now lifts selection state up one level and renders a single
shared `.skill-detail-panel` **below the whole grid**, with a "Select any skill above to
see details" placeholder when nothing's chosen. Cards themselves are back to just
rendering the chip list, so they can't overflow again.

**Skill Runes (Gear/LogoLoop) — several fixes**
- *Monochrome tint*: the real-image logos (VS Code, Bolt.new, React Bits, Antigravity,
  ChatGPT, Microsoft, and now Google) rendered in their original brand colors, clashing
  with the rest of the loop's flat `currentColor` tint. `LogoLoop.tsx` now renders image
  items as a `currentColor`-masked `<span>` (`mask-image` + `background-color:
  currentColor`) instead of a raw `<img>` — same flat tint and hover-to-accent behavior
  as every icon-font logo, but using the real logo shape as the mask.
- *Google*: swapped the thin `react-icons` outline "G" for the real multi-color Google
  G mark (`gilbarbara/logos` again), now rendered through the same mask/tint treatment.
- *Windows removed, Microsoft consolidated*: dropped the separate Windows entry; one
  "Microsoft" entry (the four-square mark) now covers both and links to
  `microsoft.com` instead of the old Office 365 URL.
- *Hermes Agent removed* from the loop entirely, per request (was the caduceus ☤ letter
  icon from session 2 — file deleted too).
- ***Actual bug found***: the loop's root container was missing `overflow: hidden`
  entirely. Checked against the real reactbits.dev source — the original Tailwind
  version has `overflow-x-hidden` on this exact element; it was dropped when the
  component was ported from Tailwind classes to a separate stylesheet. This is why logo
  content kept being visible past the fade gradient on the left edge — nothing was
  actually clipping it, the fade was just a color overlay on top of unclipped content.
  Fixed by adding `overflow: hidden` to `.logoloop`.
- *Mobile dead space*: the `pl-6 md:pl-10` left-inset added in session 2 (to pull the
  loop away from the desktop sidebar) was applying on **mobile too**, where there's no
  sidebar to avoid — that's the dead space the user saw. Changed to `lg:pl-10` only,
  matching the breakpoint where the fixed sidebar actually exists.

**Volume slider — muted audio still silent after raising volume**
Session 2 made the slider draggable while muted, but dragging it only ever changed the
stored `volume` number — it never actually resumed playback, since `enabled` (paused/
playing) is a separate piece of state that nothing was flipping. `useAmbientAudio.tsx`'s
exposed `setVolume` now also sets `enabled: true` as a side effect, since dragging the
slider is itself a real user gesture and satisfies the browser's autoplay-requires-
a-gesture rule. Moving the slider now actually starts/resumes audio, same as tapping
unmute would.

## Still not visually re-verified (carried over from session 2)
- Mobile menu stray purple edge fix (StaggeredMenu prelayer opacity change).
- Shadow Army DriftWall double-mask fix.
- Everything from this session (3), since it's also based on code review + the user's
  screenshots rather than a live render.

---

## Session 4 (follow-up from more screenshots)

**Profile card**
- Name ("Arjith A") bumped back up in size (1.7rem → 2.1rem — session 3 had shrunk it
  while fixing the misalignment bug and apparently went too far) and given an explicit
  `font-family: var(--font-display)` (Lato) — it should already have inherited Lato from
  `body`, but it's now set explicitly on `.pc-details h3/p` so there's no ambiguity.
- Handle (`@ArjithSiva`) was truncating with `text-overflow: ellipsis` inside a tight
  flex row, which is almost certainly what read as "the a is getting cut" — removed the
  `white-space: nowrap` + `ellipsis` combo entirely so it wraps instead of ever losing a
  character.

**Skill Tree — reshaped per request**
Went back to a giant-box layout like the original 6-card design, and reorganized around
specialization rather than one category per card. `languages.ts` now has 6 cards: one
giant "Languages" card (spans a 2x2 grid area) holding three specialization groups —
Web Development, Application, IoT/Embedded — followed by Hardware, AI, Agents & Tools,
Database Management, and Others as normal-sized cards (Others is a full-width band on
its own row at the bottom). `Skills.tsx` renders the giant card's groups as labeled
sub-sections (`.skill-group-block` / `.skill-group__label`), each with its own chip
list feeding the same shared description panel below the grid.

***Actual bug fixed***: `.magic-bento-card` had a hardcoded `aspect-ratio: 4/3` +
`overflow: hidden`. Any card whose content needed more vertical room than that fixed
ratio allowed (Agents & Tools' 6 chips, Hardware's 4) got its content clipped — visible
in the screenshots as chips cut off mid-card. Removed the `aspect-ratio`; cards now grow
to fit their own content (CSS Grid auto-sizes the row), so nothing gets clipped
regardless of how many chips a card holds.

**Skill Runes (Gear/LogoLoop)**
- *React Bits icon*: was rendering as a near-invisible dark blob. Root cause: the
  favicon.ico I extracted in session 2 has an opaque black circular background (not a
  transparent one) — the mask I added in session 3 used alpha-mode, so that whole opaque
  black circle became "visible" (tinted solid), not just the flower/orbit linework.
  Regenerated the icon myself with Pillow: computed per-pixel luminance and used that as
  the new alpha channel (light lines → opaque white, dark background → transparent),
  producing a proper alpha-masked silhouette. Confirmed visually against a dark backdrop
  before shipping it.
- *Bolt icon — unresolved, needs your input*: you said the current icon (a lightning
  bolt, from StackBlitz — bolt.new's parent company, confirmed via their own GitHub org
  `stackblitz/bolt.new`) is wrong, and that Bolt's real logo is a stylized "b". I looked
  for this and found something worth flagging: there's a **separate, unrelated product**
  called **BoltAI** (by Podzim LLC — a native macOS ChatGPT client, `boltai.com`), a
  completely different tool from Bolt.new. I couldn't confirm either way whether Bolt.new
  itself has a "b" lettermark distinct from the StackBlitz bolt shape (their own site's
  markdown didn't expose a clear icon asset path, and I have no way to visually inspect
  a rendered page in this sandbox). **I left the current stackblitz.svg icon in place
  rather than guess again** — please confirm: is it Bolt.new's icon you want changed
  (and if so, a link to the actual asset would help, since I can only pull files from a
  small domain whitelist), or did you actually mean BoltAI, the different app?
- Left-edge overflow, Windows/Microsoft consolidation, Hermes Agent removal, and the
  real Google logo — all done last session, unaffected by anything this session touched.

**Favicons**
- Shadow mode: letter color changed from the purple accent to plain white, everything
  else (flat `#030005` background, Cinzel) unchanged.
- Light mode (`favicon-system.svg`): rebuilt to match the same template as shadow mode —
  flat background (now the light theme's own `#d5f0ff`), Cinzel "A" — instead of its old
  radial-glow-over-icy-blue style. Used deep navy (`#0a2f6b`, the light theme's own
  accent/text color) for the letter since white or the light theme's cyan accent would
  have very poor contrast against that pale background.

## Still not visually re-verified
Everything in this session, plus everything carried over from sessions 2 and 3 (mobile
menu edge-color fix, DriftWall mask fix) — still no live browser preview available in
this sandbox. A round of real screenshots covering all of these would be the most useful
next step.

## Session 5: first live deploy + mobile fixes
**Deployment (GitHub Pages)** — the site is now live at
`https://arjithsiva.github.io/portfolio/`. Getting there hit two problems, both now
documented in README ("Troubleshooting a blank white page"):
1. No workflow existed in the repo (`.github/` was missing from the zip), and Pages
   was set to "Deploy from a branch". `.github/workflows/deploy.yml` is now **included
   in the zip** (Node 22, `npm ci`, `npm run build`, upload `dist`, deploy-pages).
2. After switching to a workflow, the site was blank with a 404 for `src/main.tsx`:
   GitHub's own branch-deploy run (raw source) finished after the workflow's build
   and overwrote it. Setting Source to "GitHub Actions" and re-running the workflow
   fixed it.

**Mobile fixes**
- *Skills grid stacking*: `.magic-bento-card--wide { grid-column: span 2 }` does not
  clamp on a one-column grid — it creates a hidden implicit second column, which
  squeezed the IoT / AI cards into a narrow sliver side by side. Added a mobile
  (`max-width: 599px`) override after that rule: `grid-column: auto` on wide cards and
  `minmax(0, 1fr)` on the grid, so all 8 cards are full-width, one after another.
  Tablet (2-col) and desktop (4-col) layouts unchanged.
- *Profile photo missing on mobile*: the ProfileCard wrapper in `sections/Profile.tsx`
  had `max-w-[280px] mx-auto` but no width. With auto margins in a grid it shrink-wraps
  to 0px, and the card's height comes from `aspect-ratio`, so it collapsed to nothing
  (blank gap under the heading). Added `w-full`; desktop unchanged (`md:mx-0`).

**Not visually verified**: no headless browser could be installed in this sandbox, so
both mobile fixes are reasoned from the CSS and confirmed only by a clean
`npm run build`. Please check on your phone after the next deploy.
