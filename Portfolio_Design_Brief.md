# PORTFOLIO DESIGN BRIEF
### For: Dr. Achanta Sampath Dakshina Murthy — Academic & Research Portfolio
### Purpose: Hand this document to an AI builder (ChatGPT/Claude/etc.) to generate the full site structure, section by section.

---

## 0. GLOBAL DESIGN SYSTEM

**Core Philosophy:** Premium, editorial, gallery-like. Think "digital museum exhibit" or "Apple product page" crossed with an academic journal — NOT a typical bootstrap "card grid" portfolio. Avoid boxed sections, drop shadows, neon/gradient buttons, and generic icon-in-circle patterns wherever possible. Let whitespace, typography scale, and motion do the work instead of borders and containers.

**Color Palette**
- Background: `#FFFFFF` (pure white), with one alternate near-white `#FAFAFA` / `#F5F5F3` for subtle section separation (no hard borders — use spacing + this tone shift instead).
- Primary text: `#0A0A0A` (near-black, not pure #000 — softer on eyes).
- Secondary text: `#6B6B6B` (mid-grey for meta info, dates, captions).
- Accent (used *sparingly*, e.g. underline, active nav dot, timeline line): `#1A1A1A` or a single deep charcoal — no color accent, keep it monochrome + photography for visual interest.
- Hairlines/dividers: `#EAEAEA`, 1px, used minimally.

**Typography**
- Font: Poppins throughout.
- Headings: Poppins SemiBold/Bold, generous letter-spacing on eyebrow labels (e.g. "EDUCATION" tracked out, uppercase, small size, grey).
- Display/hero size: 64–120px (responsive), Poppins Medium/SemiBold, tight line-height (0.95–1.05).
- Body: Poppins Regular/Light, 16–18px, line-height 1.7 for readability across dense CV content.
- Numbers/stats: Poppins SemiBold, tabular-nums, large scale for impact (h-index, paper count, etc.)

**Motion Language (used site-wide)**
- Scroll-triggered reveals: content fades up (`opacity 0→1`, `translateY 24px→0`) with slight stagger between siblings (60–100ms delay each), using an easing like `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) — nothing bouncy or cartoonish.
- Section transitions use **scroll-linked scrubbing** (tie animation progress to scroll position via IntersectionObserver + scroll percentage, or a library like GSAP ScrollTrigger / Framer Motion's `useScroll`) rather than only triggering once.
- Cursor: custom minimal cursor (small dot + thin ring that lags) that expands subtly on hoverable elements — reinforces premium feel.
- Page load: brief monochrome preloader (e.g. name letters drawing in as SVG stroke animation, or a vertical line "wiping" the screen open) — 1–1.5s max, skippable.

**Navbar**
- Fixed, transparent over hero, transitions to white background + black text with a thin bottom hairline once user scrolls past hero (animate background-color and add subtle blur/backdrop-filter, NOT a shadow).
- Logo/name mark on left as minimal wordmark (e.g. "ASDM" monogram in a thin custom underline).
- Right side: a handful of top-level anchors (About · Research · Experience · Publications · Recognition · Contact) — condense the 20+ CV sections into these top-level groups, each expanding to sub-sections on scroll (see structure below).
- On scroll DOWN, navbar hides (translateY -100%); on scroll UP, it reappears — smooth 300ms.
- Mobile: replace with a full-screen overlay menu, links stagger in one by one, large Poppins type, thin animated line under the active/hovered link.
- Add a **scroll progress indicator**: a 2px line at the very top of the viewport that fills left→right as the user scrolls the whole page — subtle, black on white.

---

## 1. HERO SECTION

**Layout:** Full viewport height. Large-scale name typography dominates, professional portrait integrated asymmetrically (not centered, not in a box/circle) — e.g. name text on the left 60%, portrait bleeding off the right edge of the viewport, desaturated to grayscale or duotone (black/white) to match the palette, color only appearing on hover/interaction if at all.

**Content shown:**
- Eyebrow label (small, tracked-out, grey): "SENIOR ASSOCIATE PROFESSOR · HEAD, VIGNAN'S CENTRE FOR INNOVATIONS & STARTUPS"
- Massive name: "Dr. Achanta Sampath / Dakshina Murthy" broken across two lines
- One-line positioning statement pulled from his research area: "Researcher in Human Motion Analysis, Biomedical Signal Processing & AI-Driven Diagnostics"
- Minimal scroll cue at bottom center: a thin vertical line that draws downward on a loop, or the word "Scroll" rotated 90° with a slow pulse — no bouncy chevrons.

**Animation:**
- On load: name splits into individual characters/words (SplitText style) and each animates up into place with a slight stagger, masked by an overflow-hidden wrapper (classic "text reveal from behind a mask" effect) — premium and common in agency sites, reads as elegant not flashy.
- Portrait image: starts slightly scaled up (105%) and clipped, un-clips/settles into position as the name finishes animating — parallax on scroll (image moves slower than text as user scrolls past).
- Background: perfectly flat white — all visual interest from type + one photograph. No particles, no gradients, no floating shapes.

---

## 2. ABOUT ME — SIGNATURE INTERACTIVE SEQUENCE

This is the centerpiece animation you described. Build it as a **pinned/sticky scroll sequence** (using ScrollTrigger's `pin: true` or Framer Motion's scroll-linked transforms) so the section stays fixed in the viewport while the user scrolls, and the animation plays out across that scroll distance in stages:

**Stage 1 — Arrival:** As the user scrolls into the About section, the portrait photo (grayscale, medium size, no frame/box — just the photo itself with a soft natural edge or subtle mask shape like a rounded organic blob rather than a hard rectangle) fades/scales in and centers itself in the viewport.

**Stage 2 — Name Orbit:** His name ("Achanta Sampath Dakshina Murthy") splits into individual words or letters, which animate along a circular/elliptical path around the photo — using CSS `offset-path` (motion path) or SVG path + Framer Motion, each word taking its position on the circle with a slight rotation so it appears to "revolve" once around the image (an animated arc, roughly 270–360° depending on desired pacing tied to scroll progress).

**Stage 3 — Settle to Text:** As the orbit completes, the individual words un-rotate and reassemble into a normal horizontal heading line, while the photo simultaneously shrinks and translates to the side (e.g. animates from center to a fixed left-aligned position, ~30% width) — this is the "image automatically goes to the side" step. Do this as one continuous scroll-scrubbed timeline so it feels physically connected, not like separate cuts.

**Stage 4 — Bio reveal:** Once the photo has docked to the side, the biography copy fades/types in next to it — a warm 3–4 sentence narrative synthesized from the CV (10+ years teaching, PhD in Image Processing, Post-Doctoral Fellowship in AI + biomedical sensing, Head of Vignan's Centre for Innovations & Startups, 100+ research papers/patents/awards). Include quick-glance stat chips *without boxes* — just large numbers with thin label underneath, laid out in a simple flex row with generous gaps (e.g. "10+ Yrs Teaching   ·   103 Papers   ·   h-index 15   ·   31 Patents/Design Patents").

**Unpin:** section releases and normal scroll resumes into Education.

*(Implementation note for the AI builder: this needs GSAP ScrollTrigger with `pin`, `scrub`, and a `motionPath` plugin, or Framer Motion's `useScroll` + `useTransform` driving `offsetDistance`/rotate/x/y on the word spans. Keep total pinned scroll distance to ~150–200vh so it doesn't feel like it drags.)*

---

## 3. EDUCATION — "BOOKSHELF" / VERTICAL LEDGER

Instead of a table or cards, treat this like a stacked academic ledger or bookshelf of "volumes":

- Each degree (Post-Doctoral Fellowship, Ph.D., M.Tech, B.Tech, Intermediate, Xth) is a full-width horizontal row, separated only by thin hairlines — like entries in an index/colophon page.
- Large year number sits on the left in oversized faded grey type (e.g. "2023" at 80px, low opacity) acting as a visual anchor; degree name + specialization + university sit to the right in normal weight.
- On scroll, each row's year number "prints" in (subtle blur-to-sharp + fade, like a stamp coming into focus) while the text content slides in from the right.
- On hover: the row's background tints to `#FAFAFA`, the hairline above/below thickens slightly, and a small animated arrow/plus icon appears on the right (optional expand to show more detail — not required since content is short).
- Optional "spine" motif: a thin vertical line running down the far left of the whole list, like a bookshelf spine, with small tick marks at each row — reinforces the "bookshelf" concept without literal 3D books (keep it flat/minimal, not skeuomorphic).

---

## 4. EXPERIENCE — VERTICAL TIMELINE / "ANOTHER PAGE" TRANSITION

Work Experience + Current Working Roles + Detailed Employer table (the CV has 3 overlapping experience lists — merge into one authoritative timeline).

- Central vertical line running down the page (thin, `#EAEAEA`), with small solid dots marking each role change, alternating content left/right of the line on desktop (classic timeline), single column with the line on the left on mobile.
- Each entry: role title (bold), institution, date range (grey, smaller), 1-line responsibility summary.
- As user scrolls, the vertical line should **draw itself progressively** (stroke-dashoffset animation tied to scroll position of that section) — like ink filling a pen line downward as you read, so the timeline visually "grows" rather than being static.
- Each dot pulses briefly (scale 0→1 with slight overshoot) as it comes into view, and its content entry fades in from its respective side.
- **"Another page" treatment**: for the *Current Working Roles* (Head of Vignan Centre, Associate Dean R&D, IQAC Coordinator etc.) and the long *Employer Responsibility table*, don't cram it into the same scroll flow — treat it as a distinct full-viewport "page" that slides up and overlays the timeline like turning to a new page in a book (`translateY(100%) → 0` with a slight shadow-free crossfade, or an actual page-corner-flip transform if you want to be literal — kept subtle, no skeuomorphic paper texture, just the motion). This section can use a clean two-column ledger table styled like the Education section.

---

## 5. RESEARCH FOCUS (Post-Doctoral + PhD) — "SPLIT REVEAL / MANUSCRIPT" LAYOUT

This covers the Post-Doctoral Fellowship (AI + Multi-Sensor Fusion for Sciatica Prediction) and PhD (Nature-Inspired Optimization in Gait Analysis) — his two flagship research projects deserve a distinct, editorial treatment, different from every other section.

- Full-bleed layout resembling an open manuscript/journal spread: Title in large serif-feel Poppins (use Poppins ExtraBold for contrast) at top, followed by a two-column "abstract" layout (like a printed journal page) for the summary text.
- A large faint watermark keyword or icon-free numeral (e.g. "01" / "02") sits behind the text at low opacity for each research project, reinforcing the "paper" feel.
- Animation: as the section enters, the two text columns rise in from below at slightly different speeds (subtle parallax offset between column 1 and column 2), giving a "unfolding page" sensation.
- Include a horizontal divider that draws itself (left to right) between the PhD and Post-Doc blocks.

---

## 6. RESEARCH SUMMARY / IMPACT STATS — "COUNTER WALL"

(h-index, papers published, patents, awards, books, citations etc.)

- Large full-width grid (no boxes/cards — just typography in a clean grid with generous gutters) of big animated counting numbers: h-index 15, 103 Papers, 20 Awards, 11 Patents Published, 6 Patents Granted, 14 Design Patents, 4 Copyrights, 9 Books, 15+ Editorial/Reviewer roles, 100+ Certificates.
- Animation: numbers count up from 0 to their final value when the section scrolls into view (easing out, ~1.2s duration, staggered start per number so they don't all finish simultaneously).
- Each stat's label sits below in small tracked-out grey caps. A thin underline animates left-to-right beneath each number on hover.
- Optional: include the H-index-by-database mini table (Scopus, ResearchGate, Publons, Google Scholar) as a compact secondary strip below the big counters, styled like a minimalist data table with subtle row-hover highlight.

---

## 7. INNOVATION & SEED FUND GRANTS — "FOLD-OUT CARDS WITHOUT BORDERS"

- Present as a horizontal scroll-snap gallery (drag or scroll-wheel horizontal) rather than a vertical list, since there are only ~6 grant items — gives a nice change of pacing.
- Each grant is presented as large type only: Grant title, funding body, amount, year — no box/border, just generous padding and a very faint background shift on the active/centered item as it scroll-snaps into focus.
- Subtle horizontal progress dots below indicate position in the set.

---

## 8. RESEARCH AWARDS (20 items) — "ACCORDION LEDGER"

Given the volume (20 awards), avoid a giant static list. Use a collapsed accordion / expandable list:

- Default state: shows award title + year only, one per row, minimal hairline separators.
- On click/hover: row expands smoothly (height auto-animate) to reveal the granting body + full description, while a small "+" rotates to "×".
- Add a filter/sort toggle at top (e.g. "Most Recent" vs "All") purely as a UI nicety, sorting years descending — 2025 down to 2017.
- Micro-animation: each row's year number shifts slightly left and bolds when expanded, drawing focus.

---

## 9. PROFESSIONAL MEMBERSHIPS — "STAMP / SEAL GRID"

International + National bodies (IEEE, IAENG, ISPRS, ISRS, IASED, IAOE, MIE, CSI, SCRS, IARA, INSC, ICTR).

- Treat each membership like a minimal official seal/stamp: organization acronym in large tracked-out type, membership ID + type (Lifetime/Annual) in small grey text beneath, arranged in a clean multi-column grid (4 cols desktop / 2 mobile), separated by generous whitespace not borders.
- On hover, the acronym gets a thin circular or hexagonal outline that draws itself around it (SVG stroke animation, stroke-dashoffset 100%→0) like a seal being stamped — this is the one place a geometric outline motif is appropriate since it reinforces "membership/certification."

---

## 10. PATENTS & COPYRIGHTS — "FILING CABINET / INDEX CARD FLIP"

Design Patents (14), Patents Granted (6), Patents Published (11), Copyrights (4) — largest content block after publications.

- Group into labeled sub-tabs (Design Patents / Granted / Published / Copyrights) with an animated underline indicator that slides between tab labels on click (like a segmented control).
- Within each tab, display entries as an "index card" list: title, application number, filing/publication/grant dates, authority (India/UK/Australia/South Africa/Canada) — laid out as clean rows with the authority country name treated as a small grey tag (just text, no colored pill) at the row's end.
- Micro-interaction: hovering a row causes it to lift very slightly (translateY -2px) and the row above/below to compress slightly, mimicking flipping through an index card box — keep it subtle, no shadows, use the background tint (`#FAFAFA`) for the lift feedback instead of a drop-shadow.

---

## 11. BOOKS PUBLISHED — "SHELF CAROUSEL"

9 books — genuine bookshelf metaphor here (contrast with Education's abstracted version):

- Horizontal scroll carousel where each book is represented as a tall vertical rectangle (like a book spine) in flat black/white/grey tones with the title set vertically (rotated 90°) — clicking/hovering rotates the "spine" open into a flat card showing full title, ISBN, publisher, year, and a link.
- Animate the whole shelf with a slow continuous idle drift (very slow autoplay, pausing on hover/interaction) so it feels alive without demanding attention.

---

## 12. INVITED TALKS / ADVISORY ROLES — "SPEAKER MARQUEE"

- A slow, continuous horizontal marquee (infinite scroll ticker) of conference/event names and roles (Session Chair, Advisory Committee Member, Invited Speaker) running behind or above the detailed list — decorative, pauses on hover.
- Below the marquee, the actual detail list (10 items) in the same accordion ledger style as Awards for consistency, but keep visually distinct via the marquee header.

---

## 13. PUBLICATIONS (60+ papers — SCI / ESCI / Conference / UGC) — "LIBRARY CATALOGUE SEARCH"

This is the largest dataset in the CV. Do NOT list all 60+ papers as flat scrolling text — build a mini interactive catalogue:

- A search/filter bar at top (filter by category: SCI International / ESCI-WoS / Conference & Book Chapters / UGC Care) — implemented as pill-less text tabs with animated underline.
- Below, a dense but legible list: each entry shows citation-style text (authors, title, journal, year) with the journal name in italics, DOI as a small subtle link icon on the right (arrow that slides right 4px on hover).
- Virtualize/paginate or lazy-load in batches of ~10 with a "Load more" reveal (fade + slide up) rather than rendering all 60 at once, for performance and pacing.
- Entrance animation: rows fade up in a tight, fast stagger (30–40ms each) since there are many — should feel like a list "printing out" quickly, not a slow luxurious reveal (contrast with the slower hero/about pacing).

---

## 14. TEACHING — SUBJECTS TAUGHT, LABS HANDLED, STUDENT PROJECTS — "CHALKBOARD GRID"

- Subjects Taught (15) and Labs Handled (10): present as a flowing tag/word-cloud style grid — varied but consistent type sizes (not literal word-cloud randomness, keep it a clean grid), each tag simply underlines on hover, no pill backgrounds.
- Technical Projects table (student projects by year, M.Tech/B.Tech) presented as a clean two-column list (Year | Project Title), sorted descending, with a thin animated left-border accent that grows on hover per row.

---

## 15. FDPs / WORKSHOPS / CERTIFICATIONS — "STAMPED PASSPORT" STRIP

Given the huge volume (28 online certs + 30 workshops/FDPs), summarize rather than list exhaustively on the main flow:

- Show as a horizontal auto-scrolling strip of "stamp" style badges (organization name + year only, flat monochrome), similar seal-outline hover treatment as Section 9.
- Include a "View all 60+ certifications" expandable drawer/modal that slides up from the bottom of the screen (like a bottom sheet) listing every item in a simple dense table, with a close (×) that slides it back down — keeps the main scroll flow uncluttered while preserving full CV content.

---

## 16. EXTRACURRICULAR / ADDITIONAL QUALIFICATIONS — "FOOTNOTE STRIP"

- NCC certificates, quiz prizes, art certificates, volunteering — treat as a compact single-row or two-row footnote-style list near the bottom of the page, small type, grey, understated — this is supporting color, not a headline section, so keep visual weight low.

---

## 17. CONTACT / FOOTER — "CLOSING CREDITS"

- Large closing statement/CTA: "Let's Connect" or similar, in hero-scale type again (bookends the site — matches hero's scale for symmetry).
- Email, phone, and links to ORCID / Scopus / Google Scholar / VIDWAN / ResearcherID presented as a simple vertical list of large text links, each with an arrow that animates from → to ↗ on hover with a slight translate.
- Footer base: minimal — name, "Portfolio designed & built [year]", back-to-top control (a circular button that fades in after scrolling past hero, smooth-scrolls to top with the same expo-out easing used elsewhere).
- Repeat the scroll-progress top bar resetting to 0 here to close the loop.

---

## IMPLEMENTATION NOTES FOR THE BUILDER AI

- **Recommended stack:** React (or plain HTML/CSS/JS) + GSAP with ScrollTrigger (and MotionPath plugin for the About section orbit) — or Framer Motion if using React and preferring a JS-driven approach. Either is fine; the key requirement is scroll-scrubbed (not just on-load) animation for the pinned About sequence and the timeline draw.
- **Images:** convert the provided portrait to grayscale/duotone via CSS `filter: grayscale(100%)` (or a pre-processed asset) to match the black/white palette; keep all other imagery (if any decorative photos are added later) equally desaturated so the palette stays consistent.
- **Performance:** lazy-load below-the-fold sections' animations (only initialize ScrollTrigger instances as sections approach viewport) given the page is long and content-heavy.
- **Accessibility:** respect `prefers-reduced-motion` — provide a simple fade-only fallback for all scroll-scrubbed and orbit animations.
- **Responsive:** the About section's orbit animation should simplify on mobile (e.g. skip the circular path, just do a straightforward photo-then-text fade sequence) since fine motion-path work doesn't translate well to small viewports.
- **Section order (top-level nav grouping):** Hero → About (signature animation) → Education → Experience Timeline → Current Roles ("new page" overlay) → Research Focus (PhD/Post-Doc) → Impact Stats → Grants → Awards → Memberships → Patents & Copyrights → Books → Talks/Advisory → Publications catalogue → Teaching → Certifications strip + drawer → Extracurricular footnote → Contact/Footer.

---

*End of design brief — every section and data point from the source CV is represented above with its own distinct layout metaphor and motion treatment, unified by the white/black/Poppins system and the signature pinned "About Me" orbit sequence.*
