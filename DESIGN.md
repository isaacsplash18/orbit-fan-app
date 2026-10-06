---
name: ORBIT
description: ORBIT, the fan app for Kai Rivera, powered by Fanframe. Dark stage-light world — gold for what you earned, ember for what you paid, cool rim for the scan.
colors:
  key-light-gold: "#F0C36B"
  gold-bloom: "#FFE1A6"
  gold-deep: "#A9761F"
  ember-wash: "#E05545"
  cool-rim: "#84B9C6"
  affirm-green: "#93C08A"
  house-dark: "#07060A"
  midnight: "#0D0B11"
  velvet-panel: "#15121B"
  velvet-raised: "#1C1824"
  velvet-high: "#241F2D"
  bone: "#F4EFE6"
  bone-muted: "#A79C93"
  bone-dim: "#877F8C"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, Noto Sans Thai, Times New Roman, serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, Noto Sans Thai, Times New Roman, serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.12
  body:
    fontFamily: "Schibsted Grotesk, Noto Sans Thai, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Spline Sans Mono, Noto Sans Thai, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  sm: "9px"
  md: "13px"
  lg: "18px"
  pill: "999px"
spacing:
  gutter: "18px"
  card-pad: "14px"
  section-air: "30px"
  stage-width: "400px"
components:
  button-primary:
    backgroundColor: "{colors.key-light-gold}"
    textColor: "#221703"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
  button-ember:
    backgroundColor: "{colors.ember-wash}"
    textColor: "#2a0f08"
    rounded: "{rounded.pill}"
    padding: "12px 18px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.bone-muted}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  card:
    backgroundColor: "{colors.velvet-panel}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.velvet-raised}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "12px 13px"
---

# Design System: ORBIT

## Overview

**The product is ORBIT** (Isaac, 27 Aug 2026). Kai's fans are Orbiters, and the
app carries their name rather than the company's. **Fanframe** is the platform
underneath and is credited quietly — a small mono "powered by Fanframe" on the
sign-in masthead, at the foot of More, and closing the terms sheet. It is never
the topbar mark: at 400px a sub-mark there collides with the Artist chip and the
language segments and reads as a second brand, so the topbar carries **ORBIT**
alone. "Fan Passport" is retired as a product name in every fan-facing string;
the invite card is the **Orbiter card**.

The starlit register is already in the system and is worked from the inside —
Stardust as the currency, the stardust ring as the signature shape, the light ladder
Spark → Constellation — plus addressing the fan as an Orbiter where the copy
carries it. No cherubs, no wing icons, no new accent colour: the restraint is
what keeps the name from reading as a costume.

**Creative North Star: "Front Row at Midnight"**

The design is the feeling of standing closest to the stage after the house
lights go down. The ground is near-black velvet; everything the fan has earned
glows warm gold like a key light finding them in the crowd; anything bought
with money sits in an ember wash; the scan — the door into the room — carries a
cool rim light. Intimacy is the organizing emotion: the interface should feel
like proximity to one artist, not like software.

Surfaces stay quiet — hushed velvet grounds, hairlines where a boundary has to
exist — so that the moments of light mean something. The reward animation (the
earn burst) is the one place the system is allowed to be loud. Density is low,
one idea per screen, built for a 400px canvas held in one hand in a dark venue.
Imagery direction follows the artist's own grid: deep black tailoring against
ivory, carmine as the money color, golden-hour warmth.

**The product is an edition, not an app shell** (editorial rebuild, Aug 2026).
Fan-facing listings are set as editorial runs, not stacks of cards: an item
with a photograph is full-bleed with a bottom scrim and the On-Photo voice, an
item without one is a typographic entry separated by a rule, and the standfirst
always sits in the gutter *below* the picture. Card chrome survives only where
interaction demands it — locked veils, inputs, buttons, the badge case, the one
inverted panel. Everything else earns its place with type and air.

**The photography is one cold film stock inside a warm velvet frame** (film
reference, Aug 2026). An L'Officiel fashion film of the artist was studied and
four things were taken from it: a universal photography grade, a glass streak,
a deeper ember drench on the premium hero, and a media reveal. Not a single UI
colour changed. `docs/FILM-REFERENCE-NOTES.md` records the reference, the four
adoptions, the two rejections (no ground cooling, no colour-as-earned) and what
is parked.

**Key Characteristics:**
- Committed single dark look (no light theme); explicit backgrounds everywhere.
- Light = meaning: gold is earned, ember is paid, cool is scan. Never mixed.
- One signature motif (the stardust ring) reused at three scales.
- Serif display voice with a working grotesk and a counting mono.
- Drawn monoline icons only; no emoji, no glyph stand-ins.

## Colors

A stage-lighting palette: three lights over a velvet ground.

### Primary
- **Key-Light Gold** (#F0C36B): everything earned — the Stardust balance, level
  ring, badges, earn animations, focus rings, active states. Blooms to
  **Gold Bloom** (#FFE1A6) at highlights and grounds to **Gold Deep**
  (#A9761F) in gradients.

### Secondary
- **Ember Wash** (#E05545): **money, and only money** — the premium tier,
  exclusive locks, prices, the buttons that spend. Warm but unmistakably not
  gold; deepened to carmine after the artist's-grid review (Aug 2026).
  **Artist mode came off ember** in the Aug 2026 semantics sweep: no money
  changes hands in Kai's own room, and colouring it carmine said otherwise.
  It reads as a tonal step up now (Velvet High, bone text, hairline) —
  present and enclosed, and uncoloured.
  The carmine hue does one non-money job, deliberately: the **error and
  destructive family** (an invalid field, a wrong quiz answer, the Reset
  hover). That is the hue reading as "stop", not as "pay", and inventing a
  fifth light to say it would be worse than sharing this one.

### Tertiary
- **Cool Rim** (#84B9C6): **the scan lane, and the one chip that says a room
  is open right now.** It used to mark every event date and every upcoming
  night as well, on the reasoning that a date is a "when are you in the room"
  fact — which turned Cool Rim into the events colour and spent the scan's
  light on a calendar. A plain date is now a neutral chip; Cool Rim survives
  on the viewfinder, its brackets and sweep, and the live chip with its
  pulsing dot. **Affirm Green**
  (#93C08A): success/ownership chips (Unlocked, Ordered, Registered).
- **Clay** (#C2724E, text tint #D08C63): a content tone, not a fourth light.
  Permitted only inside the tennis/sport context (the artist's clay-court
  material, keyed per item in `MOTIF`), where it tints the mono line riding
  the photograph. It never marks state, value or interaction, and it never
  appears on a surface that is not about sport.

### Neutral
- **House Dark** (#07060A): the page ground. **Midnight** (#0D0B11): the
  device canvas. **Velvet Panel / Raised / High** (#15121B / #1C1824 /
  #241F2D): three steps of surface layering. **Bone** (#F4EFE6): primary
  text. **Bone Muted** (#A79C93): secondary text. **Bone Dim** (#877F8C):
  labels and placeholders (kept ≥4.5:1 on all grounds).
- Hairlines: rgba(244,239,230,.085) and .17 for borders and dividers.

### Named Rules
**The Earned Light Rule.** Gold marks only what the fan earned. A purchase, a
price, a paid tier, or **the button that spends money** never renders in gold —
money lives in ember. This is the compliance line (earned-only Stardust) expressed
as a color system. Audited Aug 2026: shop prices, the premium price label, the
shop Buy button and the checkout Pay button all moved from gold to ember; the
Stardust unlock button correctly stays gold, because Stardust is earned.

**The Quiet Surface Rule.** Grounds are hushed and glow is reserved for reward
moments. The rarity of light is the point — if everything glows, nothing was
earned. Since the editorial rebuild the rule is stricter about chrome as well
as light: a hairline is a boundary a reader needs, not a decoration, so a
listing separates with a rule and an image separates with its own edge.

## Typography

**Display Font:** Cormorant Garamond (Georgia fallback; Noto Sans Thai for th)
**Body Font:** Schibsted Grotesk (Helvetica fallback; Noto Sans Thai for th)
**Label/Mono Font:** Spline Sans Mono (ui-monospace fallback; Noto Sans Thai for th)
**CJK fallback (one job):** Noto Serif SC (`--cjk`), used only for the Chinese
glyphs of the artist's bilingual name lockup. It is a fallback-tier face, never
a brand face and never used for UI copy or content.

**Character:** A stage-poster serif that speaks, a plainspoken grotesk that
works, and a mono that counts. The mono is semantic, not decorative: it marks
numbers the fan earned and codes they scanned.

### The scale (one scale, nine steps)

Every rule in the file, across all three faces, sits on one of these nine
sizes. There is no tenth, and no half-step:

| px | Role |
|---|---|
| **11** | every mono caps label, chip, dateline, field label, tab label, foot line — the floor |
| **13** | secondary UI: quiet rows, sheet paragraphs, chat bubbles, perk lines, small buttons |
| **15** | body — paragraphs, ledes, standfirst body, buttons, inputs |
| **17** | the lead voice: the balance numeral, the detail page's italic "what this is" line, the editorial standfirst, a set reading |
| **20** | sub-titles: rail on-photo titles, Thai title retunes, the CJK half of the lockup |
| **24** | titles and headlines: feed and announcement titles, section headings, sheet headings, on-photo detail heroes, campaign deks, counted numerals |
| **30** | screen titles, the member card name, the premium name, the big burst title |
| **38** | the passport numeral, the burst count |
| **47** | the sign-in masthead |

**Weights: two per family, no more.** Display 500 / 600, UI 400 / 600, mono
400 / 500. The three stray 700s (the topbar mark, the story subhead, the
detail lead-in) came down to 600 in the Aug 2026 consolidation, and the
webfont request was trimmed to match — the file no longer downloads a weight
it does not set.

**Tracking.** Display tightens as it grows: −0.02em at 30px and up. The one
exception is `.prem-name`, which is set in capitals, where the tracking opens
to +0.06em instead — capitals need room, not less of it. Mono caps labels sit
between +0.06em and +0.16em, retuned down from the old 9px values so an 11px
label occupies roughly the room its 9px ancestor did. The level ladder is the
one label set nearly untracked (+0.02em), because six mono words only clear a
400px stage that way.

**Leading, in three classes, never per-rule.** `--lh-display` 1.12 for 24px
and up and for counted numerals; `--lh-ui` 1.3 for chrome and one-line UI
text; `--lh-read` 1.55 for anything read in runs. Thai keeps two locale
leadings of its own — 1.72 on the body and 1.95 in a set reading — because
tone marks need the room and that is a script rule, not a scale step.

### Hierarchy
- **Display** (600, 30px, 1.12, −0.02em): screen titles. The sign-in masthead
  runs to 47px italic (upright at 38px in Thai).
- **Headline / Title** (600, 24px, 1.12): section headings ("Badge case"), feed
  entry titles, announcement titles, sheet headings. The 22/23/24/25/26/27
  drift collapsed onto one step in the Aug 2026 consolidation.
- **Body** (400, 15px, 1.55): reading text, ledes, standfirst body. The lead
  voice above it is 17px. Thai gets 1.72 line-height via `html[data-lang="th"]`.
- **Label** (500, 11px, +0.06–0.16em, uppercase): mono micro-captions — chips,
  field labels, dates, tab labels. **Floor: 11px, everywhere, en and th.** The
  old 8.5–10.5px labels all came up; nothing a fan has to read is under 11px,
  including the tab bar.
- **On-Photo** (500, +0.06–0.08em, uppercase): titles set over imagery only —
  light and wide, never bold caps (adopted from the Velocity Black study, Aug
  2026). 20px in a rail tile, 24px on a feed unit or a detail hero. It carries
  exactly one mono metadata line under it (`.on-photo-m`, 11px caps): type then
  date, or date then place. Never two lines.
- **Bilingual lockup** (identity, not a size role): "KAI RIVERA" in the
  display or mono face, a short rule, then 吴翊歌 set in the CJK fallback face
  (`--cjk`, Noto Serif SC) at +0.2em. Reads identically in EN and TH because
  it is the artist's own signature device, not localised copy. It appears in
  two places only: the sign-in masthead and the passport. It is **not** bound
  to the string table: a `data-i18n` binding on the passport transliterated the
  Latin half in Thai and broke the pairing the device exists to make. It also
  takes no Thai retune — a signature does not change face, size or tracking
  because the page around it changed language.
- **Campaign Dek** (display 600, ~24px, +0.045em, uppercase, authored line
  breaks): the takeover block's stage-bill voice. Occasional, feed only, never
  a section header (that job stays with the mono rail voice).

**A note on scale (rewritten Aug 2026).** This file used to argue that
optically-tuned intermediate sizes were craft and a uniform grid was the
machine tell. That argument had stopped being true of the implementation: it
had drifted to **37 distinct font sizes** across 197 declarations, including
eleven separate steps between 8.5px and 14px. That is not optical tuning, it
is entropy — nobody chose 12.5px over 12px for a reason anyone could state,
and a fan reading a 8.5px label was paying for it. The nine steps above are
the whole system now. A new rule picks the nearest step; if none of the nine
fits, the answer is that the role is wrong, not that the scale needs a tenth.

### Named Rules
**The Three Voices Rule.** Cormorant speaks, Schibsted works, Spline Mono
counts. A string never switches voice mid-role; a number the fan earned is
always mono.

**The Latin-in-Thai Rule.** Thai copy carries Latin words inside it ("Neon
Tide", "Inner Circle", "Stardust"). A Thai title renders its Thai in Noto Sans Thai
but was falling to Cormorant for those words, so a serif appeared mid-line in a
sans sentence. In Thai the display-title stack leads with the UI face instead:
the Thai is untouched, because Schibsted carries no Thai and the fallback still
resolves to Noto Sans Thai, and the embedded Latin now matches the script it
sits inside. Titles only — body copy already runs in the UI face.

**The Thai Retune Rule.** Every uppercase-tracked mono label gets an
`html[data-lang="th"]` override (UI face, no tracking, +1px) — Thai script is
never letter-spaced. Extended Aug 2026 to slope: Thai has no italic, so **every**
italic role renders upright in Thai and lets the display face, size and tone
carry it instead — the detail page's `.d-line` and `.d-closer`, the sign-in
masthead, and the feed's note-entry title. Extended again in the editorial
rebuild to size: the display titles that grew for Latin (30px screen titles,
24px entry titles, the 47px masthead) step back down in Thai, where the taller
line-height and heavier stroke need less point size to carry the same weight.

**The Detail Grammar Rule.** A detail page reads in one fixed order: mono caps
micro-label, sentence-flow display title, one italic line saying what the thing
is, body paragraphs opened by a bold Schibsted lead-in ("What you'll love:"),
and an italic muted closer naming place and date. Pure typography in the three
committed faces — the grammar adds no surface, no colour and no new value.
The micro-label is a **muted status line** (`--dim`, the type *and* the date on
one line, or the status and the city), never a gold decorative kicker; that
distinction is what keeps it off the Don't list below. State chips sit under
the italic line so the eyebrow → title → line run is never interrupted, and a
chip is never shown that the page already says in full (a locked item's chip is
left off, because the gate block below states the price and the promise). A
locked item skips the closer and ends on its unlock.

**Where a photograph exists it takes the top of the page**: full-bleed 4:5
hero, bottom scrim, the On-Photo title and its one mono line at the gutter's
left edge, and the nav floats over the picture (a `.back.float` link, or the
chevron-down dismiss when the page was pulled up from a rail) under a soft top
scrim. The eyebrow and title below are then skipped — the photograph is doing
their job, and saying it twice is chrome. Locked readings close on a **gate
block**: a hairline in the matching light (gold for Stardust, ember for paid), the
ask, and the button. No card wraps it.

## Layout

A single 400px "stage" column (`--stage-w`), centered on desktop over the
house-dark ground with a faint gold wash and a mono stage-note caption.
Screens are section.page blocks toggled by a hash router; one surface visible
at a time.

**Rhythm** (retuned in the Aug 2026 editorial rebuild): 18px gutters (`--pad`)
for everything except full-bleed imagery, which runs the whole stage width.
Sections and listing entries are separated by 30px (`--air`) with a rule that
belongs to the entry above it — the old 12–14px card gap read as an app. A
screen masthead gets 24px above the title and 12px below the block. Rails: header
→ 6px → subcopy → 14px → track → 30px → next section.

Sticky translucent topbar (blur + saturate) carrying the brand and the Stardust
meter; fixed 5-tab bar at the bottom with a raised circular scan button at
center. Both stay: the 5-tab bar is a decided rule, and the reference's
tab-bar removal is on the rejected list. Body never scrolls horizontally.

**The meter carries two different facts at two different altitudes.** The
spendable balance is the mono numeral with its gold unit; the level sits under
it; lifetime progress is a `--dim` sentence a step below that ("340 more earned
to Radiant"), never a second figure beside the balance at equal weight. The
ladder those levels come from is named once, on the passport: six mono words
(Spark → Constellation) with the fan's own step in gold, so a level reads as a
position on a climb rather than a number with no scale.

**Artist mode is enclosed.** Kai has no Stardust and no fan tabs, so while he is
composing neither is on screen; the mode leaves by its own door, the artist
bar's "Back to fan view".

**Toasts rise from the bottom**, above the tab bar, never from the top: at the
old 96px they landed exactly on a screen's masthead and covered the title they
were confirming.

**Ground texture.** The house dark carries two static SVG noise tiles (a fine
grain at `overlay`, a coarser one blended at `soft-light`) plus one linear haze
veil in the device background. Texture, not light: the ground is still exactly
one key light and one floor vignette (AI-TELLS #22). Both tiles halve under
`prefers-reduced-motion`.

## Motion

Motion in this app does two unrelated jobs, and the mistake to avoid is
letting one borrow the other's timing.

**The interaction system** answers the finger. It has **one curve**
(`--ease`, `cubic-bezier(.16,1,.3,1)`), **three durations** (`--t-1` 120ms for
a state flipping in place, `--t-2` 160ms for the pressed state and most
things, `--t-3` 200ms for something arriving or leaving) and it animates
**transform and opacity only**. Nothing between 200ms and the reward system
exists; nothing transitions a colour, a background, a border or a box size.
A colour that changes instantly reads as responsive; a colour that fades over
200ms reads as a slow app.

**The pressed state is one anatomy, declared once.** Every `button`, every
`a[href]` and everything carrying `role="button"` takes
`transform:var(--press)` — `scale(.97)` — on `:active`, over `--t-2` on
`--ease`. It is a single global rule rather than a per-component decision,
because the tell that a control was bolted on later is that it does not answer
the press. A `[disabled]` control does not answer, because it is not tappable.

**The reward system** is the other job, and it is deliberately slower and
louder: the stardust ring's `stroke-dasharray` fill (0.9–1s), the count-up
(950ms), the expanding burst rings, the badge drop. It is named as an
exception in the stylesheet so nobody "fixes" it into the interaction
durations. It fires on earning, and nowhere else.

**Four named exceptions, and they are a closed list.** The reward system
above is the first. The **scan lane's ambient loop** — the sweep line and the
live dot — is the second: it says a machine is watching, which is a state and
not a response to a finger, so it runs on its own clock. The third is the media
reveal, below; the fourth is the Companion's typing indicator, after it.

**The media reveal** (film reference, Aug 2026). A full-bleed hero photograph
fades in on arrival: **opacity only, ~400ms, `--ease`, once**. No transform,
no loop, no stagger, and it is not a page transition — only the picture
dissolves, and only where a picture is the top of the screen (the sign-in
hero, a feed or events editorial unit, a detail hero, the premium hero).

Its rationale is the reference film, which never cuts: it dissolves between
shots, slowly, and that dissolve is most of why the thing reads as film rather
than as footage. Porting the whole grammar would have meant animating
navigation, which this app has correctly refused. So it is ported at **the
smallest honest size** — one property, on the one element that is actually
photographic, at a duration only twice the interaction system's longest. It is
an exception because 400ms is outside the three durations and because it is
scheduled by arrival rather than by a finger, not because it is loud.

**It cannot fail closed.** The keyframe is written `from { opacity: 0 }` with
**no fill mode**, and nothing sets a resting opacity below 1. If the animation
never runs — reduced motion, an old engine, an element rebuilt outside the
normal path — the photograph is simply there. Visibility is never gated behind
a class that has to arrive, because the failure mode of that pattern is a
blank hero, and a blank hero is worse than no dissolve.

Under `prefers-reduced-motion: reduce` the dissolve is removed outright and the
picture arrives instantly. The photography grade is untouched by that setting:
a grade is not motion.

**The typing indicator** (the Companion, Sep 2026; the Circle's rooms since
9 Sep 2026). Three 4px dots in a Kai-side bubble while the scripted reply
composes, and in an Orbiter-side bubble while a room's scripted answer does:
**opacity only, one step, 1.35s, `steps(1,end)`, staggered .45s apart,
looping.** No travel, no scale, no fade curve — each dot is either at .9 or at
.3, and the loop is what carries the sense of work happening. It is one rule
serving both screens, not a second exception: the exception list is closed.

It is filed under the **same rationale as the scan lane's ambient loop**, which
is why it did not need a new argument: it reports that a machine is working,
which is a state rather than an answer to a finger, so it runs on its own clock
rather than on `--t-1/2/3`. The alternatives were both worse. A static
three-dot mark says nothing a fan can read as "wait"; an eased fade would put
a fifth timing curve on screen for a decoration.

**It fails to a legible still.** Under `prefers-reduced-motion: reduce` the
animation is removed and the three dots hold at a fixed stagger (.9 / .55 / .3)
so the row still reads as a pause in the conversation with nothing moving in
it. Nothing about the reply is gated on the indicator: it is removed by the
same render that appends the reply, and it lives about 700ms.

**Reduced motion** stills the travel and keeps the feedback. Under
`prefers-reduced-motion: reduce` the sweep, the pulse dot, the ring fills and
the burst animations stop, the hover chevron stops sliding, the grain halves,
the big burst keeps its wider geometry without moving — and the pressed state
survives with `transition:none`, because 3% of feedback is not the kind of
motion the setting is about. The surface still answers the thumb; it just
stops easing to do it.

## Elevation & Depth

A hybrid: **tonal layering carries structure** (House Dark → Midnight →
Velvet Panel → Raised → High), hairlines separate surfaces, and **shadows
carry occasion**.

**Two shadow tokens, and only two** (Aug 2026). Both are pure black alpha —
a shadow says how far off the page a thing sits and never says what the thing
means, so a tinted shadow is a category error.

- **`--shadow-raised`** — a surface *sitting on* the page: the primary pill,
  the Orbiter card, the raised scan tab. Three stacked layers at .08 / .06 / .05,
  because one big blur reads as a sticker and three stepped ones read as a
  surface with a contact edge.
- **`--shadow-overlay`** — a surface *floating above* the page: the sheet, a
  toast, the desktop stage surround. Three stacked layers at .16 / .24 / .32.

Everything that had a hand-rolled `box-shadow` now routes through one of the
two. The exceptions are the two reward glows, which are not elevation at all:
the earn burst's core and the scan lane's sweep line. The stardust rings do their
glow with `filter: drop-shadow`, which keeps them out of the elevation
vocabulary entirely.

Two tinted shadows came off in the sweep. The Orbiter card's three concentric
gold ring shadows became a single drawn border — the motif was carried by the
ring, and the glow behind it was a paid-looking bloom on an earned surface.
And the **scan tab lost its gold glow**: it is the app's one raised control
and it had the app's one piece of stage light sitting on a surface where
nothing had been earned yet. Its gold stroke and gold icon carry the identity;
its elevation is now neutral, like everything else's.

## The Photography Grade

**One film stock, on the one choke point** (film reference, Aug 2026). Every
photograph on the page is built by `paintMedia()` as a `.slot-shot`, so the
whole edition is graded by a single rule:

```
.slot-shot { filter: grayscale(.55) contrast(1.06) saturate(.68) brightness(.97); }
```

The point of it is not the photographs. It is that a warm, saturated picture
was **competing with the three stage lights**: on the events screen a
gold-orange theatre sat directly under a gold "Scan in" button, and gold could
not read as the hottest thing on a screen whose photograph was already golden.
Desaturating the imagery is what makes the earned light hot. The Quiet Surface
Rule, applied to photography instead of to chrome.

The grade **desaturates and never tints**. No `hue-rotate`, no `sepia`, nothing
that would walk a picture toward gold, ember or cool — those are meanings, and
a photograph does not get to carry one. It leans cool only in the sense that
pulling the warmth out of a picture leaves it cooler than the velvet frame
around it; no cool is added, which is what keeps this off the Cool Rim's
rationed budget.

It is **not animated and not conditional**. A grade that came and went would be
an effect; this is a stock, and a stock is the same in every frame. It survives
`prefers-reduced-motion` untouched, because a grade is not motion.

**Artist-mode upload previews take the grade too.** Kai composing sees the
world the Orbiter will see — a preview that looked different from the published
picture would be a lie about his own edition, and the "one world" principle is
worth more here than a technically truthful thumbnail.

The five approved placeholders were checked one by one under it, and the
strongest evidence it is right is the clay court: at full saturation it read as
a tourist brochure, and graded it reads as dust under low sun.

## The Scrim Standard

**One recipe, everywhere text is set over a photograph** (Aug 2026):
`linear-gradient(to top, rgba(0,0,0,.55) calc(100% - 66px), transparent)` —
`--scrim`, with `--scrim-top` as its mirror where the text zone is at the top
of the picture (the sign-in mark, the floating back link over a hero).

It is **black, never tinted**, and it is **sized to the text zone, not to the
picture**. That second half is the change: the feed used to hang a separate
sheet over the bottom 62% of every image, which is dimming a photograph rather
than making words readable, and which covered a different amount of the frame
on a 4:5 feed unit than on a 16:10 event. The scrim now belongs to the caption
that needs it — `.fi-ed-cap`, `.dm-hero-cap`, `.prem-cap` each carry it as
their own background with a ~66–70px lead-in — so it is exactly as tall as the
words and the picture keeps the rest of itself.

**The fade is the lead-in; the words sit on the solid.** The recipe first
shipped as a fade across the whole caption box, which quietly meant the
title's first line stood on whatever alpha its position happened to earn —
about .27 on a 4:5 feed unit — and over the rooftop placeholder's blown-out
sky that measured 2.15:1 at the worst composited pixel behind the type.
Lengthening the lead-in could not repair it: the fade's top stays pinned to
the box, so even a 190px lead-in — the scrim over more than half the frame,
which this rule exists to forbid — measured only 4.49:1 at p95 and 3.01:1 at
the worst pixel. The fix is in the recipe: the gradient holds .55 through the
text zone and spends its entire fade inside the 66px lead-in, so no caption
may use a lead-in shorter than 66px.

Measured with caption text hidden, on the brightest composited pixel in the
exact rect the title occupies, against #FFF. The rooftop golden-hour unit —
the worst case in the set, its blown sky right behind the title's first
line — went 2.15 → 5.12 at the worst pixel (3.28 → 7.08 at p95); the clay
court went 2.63 → 5.90 (5.37 → 9.53 at p95). Both now clear AA at the single
worst pixel, not just in aggregate, and the scrim zone itself is unchanged in
size. The premium hero keeps its carmine wash as the money light, but the
wash no longer does the legibility work — the same black scrim does, because
legibility is one problem with one answer.

**The mirror was failing the same way, unreported.** `--scrim-top` carries one
piece of type over a photograph — the floating back link on a detail hero —
and on the rooftop it measured **4.07:1** at the worst pixel, below AA, for
exactly the reason the title did: the fade ran the whole band and left the
link on partial alpha. Mirroring the corrected recipe took it to **6.51:1**
(3.95 → 6.56 in Thai). This is the argument for `--scrim-top` staying a true
mirror rather than a second recipe: the two ends of a picture have the same
problem, and a fix applied to one of them is half a fix.

**The named worst case is the rooftop, and it is asserted, not remembered.**
`tools/browser-suite.js` measures all six — the feed 4:5 title, the detail
hero title, and the back link, in EN and TH — by hiding the type, screenshotting
the exact rect it occupied, and taking the brightest composited pixel in it.
The clay court is no longer the benchmark: it passed at 2.63:1-worst while the
rooftop sat at 2.15, which is how this shipped broken in the first place. A
brightest-*placeholder* test is not a brightest-*pixel-behind-the-words* test,
and only the second one is the standard.

### Named Rules
**The Stage Glow Rule.** The gold glow is an identity motif, not an elevation
system: it may appear only on the stardust ring family, the scan lane, and reward
moments. Everything else that needs depth uses neutral dark shadows with real
offsets.

## Shapes

**One base, three derived steps** (Aug 2026). `--radius: 9px` is the only
number; `--r-s` is the base, `--r-m` is `calc(base + 4px)`, `--r-l` is
`calc(base * 2)`, `--r-pill` is 999px. The visual values are unchanged — the
change is that retuning the app's tailoring is now one edit instead of three,
and a new component cannot invent a fourth radius by accident. Three literals
are deliberately not steps and stay literal: `0` is a full-bleed edge, `50%`
is a circle, and the 1–2px caps on the waveform bars and the scan sweep line
are stroke terminals.

Tailored, not bubbly: 9px inputs, 13px surviving cards and rail tiles, 18px
sheets, full pills for buttons, chips, and the language toggle. Rings and
circles belong to the reward system (meter, burst, badge coins, slot markers).
Media slots keep fixed aspect ratios: **4:5 for a full-bleed feed or detail
hero, 16:10 in the events listing, 3:2 for the premium hero and hero rail,
1:1 in the shop, 66%/88% cards in a rail**. A full-bleed slot has no radius and
no border at all — an image that runs to the edge of the stage is framed by the
stage. Hairlines elsewhere; the only 2px borders are the scan-frame corner
brackets.

**The premium ember surfaces** carry a still silk-sheen gradient (a single
diagonal light sweep, no animation, no glow) over the carmine scrim, matching
the pass card's satin. The Stage Glow Rule still holds: nothing here glows.

**The glass streak is one recipe with three homes** (film reference, Aug 2026).
`.pass-satin` lies on the Orbiter card, `.prem-silk` on the ember hero, and
`.hero-silk` on every other full-bleed photograph — the sign-in hero, the feed
and events editorial units, and the detail heroes. Same geometry every time: a
single still diagonal sweep at 112–115deg, transparent to about 30%, a warm
white at .05–.075 through the middle, gone by 64%. Static, no animation, no
glow, and never a second sweep crossing the first.

Its **colour is warm white and nothing else**. The other two run gold-bloom and
ember-warm because each sits on a surface that already has a meaning; a
photograph has none, so this one stays at bone temperature and never leans on
an accent. It is deliberately a whisper — it reads on the dark heroes, where a
piece of light on glass would actually be visible, and disappears over a bright
sky, which is what light does.

It always layers **under** the scrim and the caption — emitted directly after
the slot and before `.fi-ed-cap` / `.dm-hero-cap` / `.signin-fade` — so the
words keep the full black scrim between them and the picture. Measured after
adding it, every caption's contrast went **up**, not down, because the grade
underneath it took more brightness out than the streak puts back.

**The premium drench was deepened with the grade** (.14 → .16, .44 → .50). The
photography grade pulled the carmine out of the corridor photograph itself, so
the money light had to come from the wash rather than from the picture. The
Scrim Standard's own acceptance test was re-measured on the worst composited
pixel behind the type, not asserted: the white name went 5.64 → 6.42 and the
ember price 4.47 → 4.82, which is the first time that price has actually
cleared AA. The scrim zone is unchanged and still sized to the words. The
scrim-geometry fix that followed (the fade now spends itself inside the
lead-in) lifted both again: 11.62 for the name and 5.42 for the price at the
worst pixel.

## Components

### Buttons
- **Shape:** full pill (999px), 12px×18px padding, 15px/600 text (`btn-sm` 13px).
- **Target floor:** every button clears 44px high and 88px wide, `btn-sm`
  included — small is a type size, not a smaller target. A pill sized to its
  label is fine in English and useless in Thai, where "ดู" is two glyphs.
  Tab items carry the same 44px floor; the topbar language segments and the
  artist chip reach it through an invisible `::after` hit area, so the header
  keeps its measured height while the finger gets a real target.
- **Primary:** Key-Light Gold gradient (Gold Bloom → Key-Light Gold), near
  -black text (#221703), neutral elevation shadow. The press is the app's one
  pressed state (scale .97, 160ms, `--ease`), not a button-specific rule.
- **Ghost:** hairline border, bone text, faint wash on hover.
- **Ember:** ember gradient for every action that spends money — Join Inner
  Circle, shop Buy, checkout Pay. A gold button spends Stardust, an ember button
  spends money, and the two never swap (the Earned Light Rule).
- **Focus:** 2px Key-Light Gold outline, 2px offset (global rule).

### Chips
- **Style:** pill, mono 11px uppercase +0.10em, hairline border, muted text.
- **Variants:** chip-stardust (gold), chip-ember (paid), chip-cool (scan),
  chip-ok (owned/success) — tinted text + border + faint wash of same hue.

### Editorial units and entries (the feed grammar)
The fan-facing listings — feed, events, announcements, missions, shop — carry
no card. Two forms only:

- **Editorial unit** (a photograph exists): the image runs full-bleed at 4:5
  (16:10 in the events listing), a bottom scrim rises over ~62% of it, the
  On-Photo title and its one mono line sit on the gutter's left edge, and the
  standfirst, state chips and action sit in the gutter *below* the picture.
  No border, no radius, no panel.
- **Typographic entry** (no photograph): mono micro-label + state chips + date,
  then a 24px display title, then the standfirst, then the action — separated
  from the next entry by a rule that fades out to the right at 72%.

A locked entry has no box to tint, so its rule carries the state: gold for a
Stardust unlock **or a rank gate**, ember for a paid one. Locked veils, buttons and
inputs keep their chrome; nothing else does.

### The scan lane
Cool Rim's only home, and until the Aug 2026 fix pass the one screen it was
missing from. The plate is a **dark viewfinder**, never a QR: the code is on
the venue's wall and the fan is holding the camera. Corner brackets and the
sweep line are Cool Rim; the ground is a cool vignette closing on the frame.
One primary action ("Check in", gold, because a check-in is earned), the code
field as the fallback beneath it, and the demo shortcut behind a **long press
on the viewfinder** or a small mono chip inside the frame — discoverable in a
room, quiet in a screenshot. Pre-claim copy promises the night and never prices
it. After the check-in the page swaps state: the title becomes the confirmation,
the sweep stops, the brackets turn Affirm Green, and the action, the code field
and the demo chip all leave. A claimed reward is never advertised again.

### The order block
Where money changes hands the sheet reads as a receipt before it reads as a
form: rule-separated rows in the counting mono (item, price, shipping, total,
then a mono delivery line), the total the only weight, in ember. Membership
uses the same block for tier, price, billing period and renewal date. Both
close on the cancel/refund terms and **one honest-prototype line** ("Demo
checkout, no payment taken") in the mono voice — the one place the prototype
admits what it is, at the moment the fan is deciding rather than welded to a
price on a hero. A recurring charge is never one tap away, and a cancel dialog
never uses a bare "Cancel" as its dismiss: both buttons name their own action.

### The typographic reward
A reading with no photograph is a set page, not a thin one. The type steps up
(17px on `--lh-read`, with the paragraph gap opened to 19px instead of a fourth
leading), the line that says what the thing is takes
the photograph's room as a **pull-quote** between rules, and the reading closes
on the stardust ring at its smallest scale as an end mark, in `--dim` — a printer's
mark, not a reward. Nothing is written for it: the same pack strings, set
properly. Where a video or photo set has no media, a **watching plate** stands
exactly where the hero would: full stage width, no border, no radius, tonal
velvet under one soft top light, carrying the title in the On-Photo voice and
one mono line. It takes the photograph's job and therefore its rule — the
eyebrow and title below are skipped, because saying the title twice is chrome.

### The chat thread (the Companion, Sep 2026)
The one screen in the app where the fan and the artist alternate, so it is the
one place where two speaking surfaces sit next to each other. Both are built
out of the velvet steps and the hairline, and **neither borrows a light**:

- **Kai's side** is Velvet Panel with the full hairline (`--hair-2`), left
  aligned, corner 13px with the bottom-left corner tightened to 5px so the
  bubble has a foot pointing at its speaker.
- **The fan's side** is Velvet Raised with the faint hairline (`--hair`), right
  aligned, with the same tightening mirrored to the bottom-right.
- **No gold on either.** A message is not something the fan earned, so the
  Earned Light Rule keeps gold off both bubbles — the fan's side used to be a
  gold wash back when the composer was closed and the screen was a mock-up. The
  only gold on the screen is the Send pill, which is the primary action, and
  the only ember is inside the pack sheet, which is the only place money moves.
- **And no chat-app blue**, which is not a rule so much as an observation: this
  palette contains no blue except Cool Rim, Cool Rim belongs to the scan lane,
  and a bubble is not a scan.
- **Kai is marked, the fan is not.** Each Kai-side row carries a 30px drawn
  mark in a hairline circle, set in Bone Muted; the fan's side carries none,
  because a fan does not need to be told which messages are theirs. Alignment
  does the rest, and screen readers get a `.sr-only` speaker prefix per bubble.
- **The mark itself** is a monoline glyph in the `BADGE_ICONS` / `GLYPHS`
  stroke language (1.4–1.8, round caps, no fill): a stylised figure whose crown
  line sweeps up and off to the right, under a faint ring at 55% opacity. It is
  a drawing and never a likeness — **a produced cartoon Kai waits on the artist's management's
  licensing (PRD §11)** exactly as photographs do, and this glyph is the
  placeholder register until then. It heads the page at 46px as well, which is
  the same drawing and not a second asset.
- **The honesty plate** rides the top of the thread rather than the foot of the
  screen, because it has to be read before the fan types: a centred plate on a
  blurred velvet ground, display title at 24px, 13px body in `--muted`. It says
  the replies are written in advance, what the real Companion will be trained
  on, and that voice comes later.

### The message meter
The allowance under the composer, in the counting mono the ledger and the scan
codes use: 11px, `+.12em`, uppercase, `--dim`, centred, one line — "183 of 200
free messages". It is deliberately **not** a progress bar and not a warning
colour: a bar would dramatise a number that is only interesting when it reaches
zero, and colouring it would spend a light on a count. Members read the same
line with their monthly figure and the word "free" drops out of it. At zero it
says so and offers the way on, and it is the same 11px `--dim` line saying it.

It is also the demo affordance, which is the one place this screen bends: the
meter is a button, and pressing it walks the count down to the last free
message so the exhausted state and its pack sheet can be shown inside a
three-minute walkthrough. Discoverable rather than prominent — it looks exactly
like the count it is, and its accessible name is what says it is a demo
control. The pack sheet it leads to is the confirm-sheet pattern unchanged
(order rows, ember price, placeholder caveat, demo-payment line, both buttons
naming their own action), with one line the other sheets do not carry: money
buys messages only, Stardust never buys messages, and messages never buy Stardust, a
level or a badge.

### The edition entry (collector's editions, Sep 2026)
A listing of objects, so it is the **typographic entry** and not a card: the
display name at 24px, one mono line numbering it ("Edition 07 of 50"), the
price in ember, the description in `--muted`, then the **provenance line** in
Bone at reading size, then the action, closed by the rule that fades out to
the right at 72%. Three rules govern it:

- **The number is a counted fact**, so it lives in the counting mono next to
  the ledger and the scan codes, and never in gold. Nothing about a number
  stamped on an object was earned. Both halves are padded to two digits once
  the run is under ten ("Edition 02 of 03"), because "02 of 3" reads as a
  typing slip rather than as a run.
- **The provenance line is said once and repeated verbatim.** It is written in
  the pack, and the shop entry, the checkout order, the fan's own shelf and any
  Exchange listing of that edition all print the same sentence. A promise that
  is paraphrased on its second appearance is not a promise.
- **An owned edition leaves the run.** The fan's shelf ("Your editions") leads
  the section and carries the number and the provenance; the object then drops
  out of the run below it, so nothing is stated twice on one screen.

Gated, the section still shows what has been made, one step back at .72, and
**carries no control at all** — not even a disabled one. The Inner Circle gate
(`.d-gate.gate-prem`, unchanged) moves to the **top** of the section, directly
under the head, so the rule is read before three prices rather than two screens
under them, and the single ember button in it is the only live thing on the
section for a non-member.

### The Exchange listing and the royalty line
Same entry grammar, with the seller handle in the mono micro-label above the
name and the asking price a step larger (17px) because it is the number the
whole row is about. The **royalty is the mechanism of the market**, so it is
stated wherever a price is, always in the counting mono, never as a badge and
never in a colour:

- **The rule, once**, at the top of the market: "10% of every resale goes to
  Kai (placeholder)".
- **The figure, per listing**: "Royalty to Kai ฿1,450 (placeholder)". Each row
  carries its own number rather than reprinting the same sentence three times
  down one screen.
- **The split, in the order block**, on both sheets: asking, to Kai, to seller
  (or "you receive"), then the total. The buyer pays the ask and the royalty
  comes out of it, so the two middle rows add up to the top one.

The listing sheet is the confirm-sheet pattern with one addition: the maths is
**live**, recomputed as the price is typed, so the fan watches the split rather
than being told it after the fact. It names the object and its number before it
prices it, and closes on the demo line ("Demo listing, nothing is sold"). The
compliance line sits at the point of doubt, which is the moment before listing:
only an edition you already own can be resold, and Stardust, levels and badges are
earned, never sold, by anyone.

### The room list entry and the chat log (the Circle, Sep 2026)
Shipped on 9 Sep 2026 as a forum — a thread list over three boards — and
converted the same day on Isaac's direction: *"the community chat should be
more of a chat than a forum."* The design argument inverted with it, and the
inversion is the point worth recording. A forum is a **reading surface**, so
its entry was a headline over a standfirst and the room was an archive the fan
browsed. A room is a **conversation**, so its entry is the last thing anybody
said in it and how many Orbiters are standing in it. **Belonging reads as
presence, not as an archive** — the first version could tell the fan that
people had been here, and only the second can tell them people *are*.

**The room list entry** (`.cm-room`). Three rooms in one run under one head,
because three rooms are one list and not three sections. Each entry is:

- the room name at the **sub-title step** (20px display, not 24px — three
  rooms at 24px is a stack of headlines);
- **one line of the last thing said**, with the handle in front of it
  (*"Orbiter pim-1183: You saved my week."*), clipped by the CSS at the end of
  the line rather than cut by a character count, because Thai does not space
  its words and a counted cut lands mid-syllable. A preview that wraps to
  three lines is not a preview;
- the **two counted facts** in the counting mono the ledger and the scan codes
  use, never in gold: who is in the room, and when it last moved;
- and the rule that fades out to the right at 72%, the same close every
  typographic entry in the app takes.

**The presence figure** is *"128 Orbiters here"*, and it is **demo-only and says
so**. It lives in the pack (`rooms[].here`), never moves, and one quiet mono
run-out under the whole list admits it once — *"The count of Orbiters in a room
is invented for this demo and never moves"* — rather than being disclaimed
beside each of three figures, which would be the same sentence three times in
one flow. It is `--dim` mono at 11px and carries no light: nobody earned it,
and a live-looking number in gold would be the app's worst possible lie.

**The chat log** (`.rm-log`) is **the Companion's bubbles, reused**. This is
the reversal: the forum version deliberately refused bubbles, and once the
surface is a chat, the Companion is the app's established chat grammar and
growing a second one would be the drift. `.bubble.me` is literally one rule
shared by both screens; `.bubble.them` joins `.bubble.kai` on the other side.

- **The fan's side** is Velvet Raised with the faint hairline, right-aligned,
  bottom-right corner tightened to 5px. **Everybody else** is Velvet Panel
  with the full hairline, left-aligned, bottom-left tightened.
- **A mono handle line over each run**, which the Companion did not need and a
  six-speaker room does: alignment can separate two speakers, never six. The
  handle sits left, the time right; on the fan's own runs the header mirrors
  with them, so their side of the room is one column.
- **Consecutive lines from one handle are one group** under one header
  (`.rm-grp`), so a burst of three reads as a burst of three and not as three
  strangers. A new speaker opens 16px of air; a second line from the same
  speaker opens 4px.
- **A day marker** (`.rm-day`) wherever the log crosses midnight: centred
  counting mono with a hairline running out of it both ways, so a log spanning
  two nights reads as two nights.
- **No gold on any message**, for the Companion's own reason: saying something
  is not something you earned. The only gold is the Send pill.

**The composer is docked** (`.rm-dock`): pinned at the foot of the stage
directly on top of the tab bar, on the page's own ground with a hairline over
it, in the Companion's composer anatomy (`.twin-input, .cm-input`). It is
pinned **exactly the way the tab bar itself is** — fixed, stage width,
centred — and not sticky, for a reason worth recording because it is not
obvious: `.device` clips its own horizontal overflow, which makes it a scroll
container, and a scroll container that never scrolls is a scrollport a sticky
child can never stick to. Sticky is inert inside this stage; fixed is the
pattern the app already proved on the tab bar and the topbar.

Two numbers under it are **measured, not guessed** (`fitRoomDock()`): the tab
bar's height, which is a row of Thai or English labels and is not the same in
both, and the dock's own height, which changes with the first-use hint. The
dock is placed on the measured bar, and a run-out under the log (`.rm-clear`)
is trued to the measured dock, so the newest line is never sitting underneath
the control the fan is about to press.

What it is **not** is a second scroll pane. That is the Companion's decision,
unchanged: a chat pane with its own scrollbar inside a scrolling page is two
scrolls fighting on a 400px stage, so the page scrolls and the log does not,
and after each line the page is brought to the foot of the room rather than a
200px pane being pinned over the conversation. On arrival nothing is scrolled,
for the Companion's reason: the honesty plate is meant to be read first.

**The scripted answer** is the Companion's honesty, restated for a room. A
plate at the top of the log says it before the fan types: the Orbiters here are
invented, every line they say is written in advance and not generated, and the
first thing the fan says gets **one** written answer back, once per room, so
the room can be shown moving. The typing indicator is the Companion's
(the fourth named motion exception, unchanged) in the bubble the answer will
arrive in. It is a demo of a room moving, never a simulation of somebody
listening, and the difference is stated rather than implied.

**The moderation line** is a compliance note in the gold-washed `.note`,
stated once at the foot of the room list — the rule of the room, where the
rooms are — and once more as the **composer's first-use hint**, under the
input, only until the fan has said something in that room. That is the point
of doubt, and it goes when it stops being one. It is deliberately **not** on
every room and not under every message.

**Nothing about saying something is an earn.** No toast confirms a sent
message either: the line landing in the log is the confirmation, and a toast
on top of it would be the app congratulating a fan for talking.

### The community entry (meetups and contests)
The rooms are conversations; the meetups and the contests below them are
listings, so they keep the app's **typographic entry** (`.cm-item`) unchanged
by the chat conversion — mono micro-label, display name, counted mono facts,
body in `--muted`, fading rule. Two rules of their own on top of it.

- **A community event carries the community-run chip, always.** It is a
  neutral chip: not Cool Rim, which belongs to the scan lane and to a room
  the fan is in tonight, and not ember, which would say a fan-run afternoon
  costs money. The section head says who puts them together, and the run
  closes on the run-out link to the official events page, in the same
  `.ed-x-link` grammar the shop uses to hand the fan to the Exchange. The
  official listing is never restated inside the Circle: a cross-link, once.
- **A contest states what it pays in the counting voice.** When it closes is
  a counted fact and sits in the mono, like a ledger date. What the winner
  gets is one Bone line in the pack's own words, said once — the way an
  edition states its provenance — and never also repeated as a chip. The Stardust
  a contest pays for taking part is **gold mono**, because Stardust is earned and
  gold is the earned light; the button that enters is **gold**, for the same
  reason the venue check-in's is, and there is **no ember control anywhere in
  the section**, because no contest costs money. The earned-only rule is read
  **above the first prize** in the gold-washed note, the same placement the
  members-only gate takes above the editions run.
- **The demo affordance is the Companion's meter, left-aligned.** Ratifying a
  winner is a demo control, so it looks like the quiet mono note it is
  (11px, `--dim`, 44px target) and its own words say so, rather than being a
  button that appears to award a badge. It shows only once the fan has
  entered, because a contest nobody entered has no entry to ratify.

### The earned gate (rank-gated content, Sep 2026)
The app had two gates: gold for a Stardust unlock, ember for a membership. A third
kind of door arrived with rank-gated content, and it takes the **gold**,
because a rung is the same currency as an unlock: something the fan earned.
Giving it ember would say a membership could buy it, and a membership cannot.

- **It names the rung, never "locked".** The chip reads *"Opens at Level 4"*
  and the eyebrow *"Opens at Level 4 · Radiant"*. A fan who cannot open
  something has earned the right to know exactly what would.
- **No control at all, not even a disabled one.** The card and the gate carry
  one ghost link to the ladder and nothing else: no ember, no route to the
  paywall. A disabled button on a rung would be a nicer way of lying.
- **It says the thing a fan would otherwise assume.** *"Inner Circle does not
  open it. Membership sits alongside the ladder, never above it."* This is the
  one gate in the app that has to deny a door rather than describe one.
- **Three statements of one fact is the failure mode.** The eyebrow names the
  rung, the standfirst says who it is for, so the body says only how you get
  there. The first draft repeated the standfirst verbatim inside the gate.
- An **open** rank gate keeps a chip (*"Level 4 · earned"*), because the fact
  it states is the point: the reader is the one who earned it.

### The level ladder, and what each rung opens
The passport ladder ran as six mono words on one wrapping line while it only
named the rungs. Once each rung carries a line of its own it **stacks as a
two-column list**: the rung word in the counting mono at a fixed 96px (104px
on the Thai passport), the line beside it in reading type at the 11px label
size, one step quieter than the rung word at every state including the lit
one. The mono column keeps the left edge, so six words still read as a ladder
down the page rather than as six paragraphs. One rule closes the run: *every
rung is earned, and Inner Circle opens none of it*, said once under the whole
ladder rather than six times inside it.

### Two doors on one sheet (the dual unlock)
Where a reading can be opened by Stardust **or** by cash, the unlock sheet stands
both doors up **stacked full-width**, not paired side by side: a row of two
reads as *do it / don't*, and both of these do it. **Gold above ember**,
because the earned path leads on every screen in this app. The dismiss drops
below, full-width and ghost. The compliance line sits **between the ask and
the buttons** — the point of doubt is the moment before choosing a door, not
after — in the faint gold-washed note, and the demo line closes the block.
When the fan is short of Stardust the gold door is genuinely disabled and the
shortfall is stated under it; the ember door stays live, because it is still
standing.

### The membership panel and the plan picker (Inner Circle, Sep 2026)
Two plans, one tier, and a governing frame the design has to carry: **Inner
Circle sits beside the Stardust ladder, never above it.**

- **"Your membership"** is the **order block**, not a card: plan, price in
  ember, renewal date, tenure year, then the next year's gifts as ring-bullet
  perk lines. For a member this page is a statement of what they have, so the
  panel sits directly under the photograph, above the rail.
- **The sentence the panel exists to carry** closes it, in the faint
  gold-washed note: *"Inner Circle sits alongside your level, never above it.
  Membership never changes your level, and rank perks are earned only."* The
  same sentence appears in the join sheet, at the point of payment.
- **The plan picker is a picker, not a purchase.** Choosing a plan spends
  nothing, so it wears the pressed-state anatomy of the segmented control and
  the artist-mode kind picker — gold at .12 fill / .4 border — with the figure
  under the word in the counting mono. **Ember stays reserved for the one
  button in the sheet that actually charges**, which is why the sheet still
  holds exactly one ember control.
- **The ceremony is unchanged and non-negotiable**: membership, price, billing
  period, renewal date, cancel terms, and the demo line. The annual sheet adds
  the sign-up gifts, because they are part of what the price buys and the
  sheet is where the price is agreed.
- **The tenure demo** is the quiet mono run-out (`.cm-demo`) the Circle's
  contest ratification already uses, and it says "demo" in its own words.

### The referral bonus block
A faint gold-washed note on the referral page holding four lines: the promise
in the ladder's own words, the figure, the maths, and the progress. The
**figure is the one counted fact**, so it takes the counting mono at 17px in
gold — it is Stardust, and Stardust that was earned — dropping to the UI face on the
Thai passport, because the line sets Thai words around its numeral rather than
a numeral alone. **The maths is shown rather than asserted**: the bonus is the
full width of one band, which is why it carries a fan across exactly one. The
progress line reconciles itself with the counter above it, which counts every
Orbiter ever brought while this one counts only the window.

### The Orbiter card mark
Seven drawn marks in the `BADGE_ICONS` / `GLYPHS` stroke language (1.4 to 1.6,
round caps, no fill): the **stardust ring**, free to everyone and the default; the
**star crown**, **stage light** and **Companion mark**, which come with Inner
Circle; and the three **edition marks** added in Sep 2026 — the **Riverside
mic**, the **Showcase jacket** and the **Neon Tide setlist** — each one the
drawing on its edition's artwork, at picker scale. The Companion mark is the
same drawing that heads the chat, not a second asset, and an edition mark is
the same drawing as its artwork plate, not a second asset either.

- **No wings and no cherubs.** CLAUDE.md carries the starlit register through
  the stardust, the light ladder and the vocabulary the app already had, and names
  wing icons as the thing not to reach for. The exclusive marks are drawn out
  of this app's own world instead.
- **Bone, never gold.** The mark faces the level ring across the card's top
  row, and only one of the two was earned. It is set on a hairline circle at
  42px on the card and 28px in the picker, exactly like the Companion's mark.
- **It is decoration and the copy says so.** `levelIndex()` never reads it,
  `setAvatar()` touches no balance, lifetime or badge, and the note under the
  picker states it in the fan's own words.
- **Membership that ends takes its marks with it**: the card falls back to the
  free mark rather than carrying a claim the fan can no longer make. There is
  one exception, added with the Circle in Sep 2026: **a mark won in a contest
  stays**, because it was not the membership that opened it. `avatarOpen()`
  has four doors — free, member, won, and **edition** — and each door closes
  the way it opened: a membership takes its marks when it ends, a won mark
  stays because nothing bought it, and an **edition mark leaves with the
  object when the object is resold**, because the object opened it.
- **A gated mark explains itself with the right sentence.** The member marks
  carry the Inner Circle block; the edition marks carry their own run-out line
  to the editions section, because offering a membership for a mark a
  membership does not open would be the picker lying about its own door.

The picker wraps at a fixed quarter width — four tiles, then three, keeping the
first row's column — in the pressed-state anatomy the artist-mode kind picker
already uses. Gated marks are genuinely disabled, each with the one line saying
why.

### The card skin (online merch, Sep 2026)
A skin is a **bought treatment for the card's ground**, and that is the whole
of it: five custom properties (`--sk-1/2/3` for the ground steps, `--sk-edge`
for the hairline, `--sk-sheen` for the satin, plus `--sk-ring` for the drawn
ring over the shoulder) swapped on `.pass.skinned`. No new radius, no new
shadow, no animation, and the same `.pass-satin` still light sweep.

- **A skin never lights the card gold.** The level ring is the only gold on
  that card and it was earned; the gold bloom over the shoulder is retinted to
  the skin's own sheen, so a bought face never borrows the earned light.
- **Tonal, never a fifth light.** Velvet, bone, clay, and carmine taken down to
  velvet depth. The carmine skin is the one place the app's carmine hue appears
  without meaning money, and it can only ever be a ground: no skin value
  reaches a price, a chip, a control or a state, so the Earned Light Rule and
  money's ember both stand.
- **The swatch is the card face at thumbnail scale** — same ground, same
  hairline, same sheen, and no control of its own, so the shop shows the thing
  being sold rather than a label for it.
- **The picker shows only what the fan owns**, with a run-out line to the shop
  instead of four dead buttons; the "no skin" cell is always first.
- **It is decoration and the copy says so**, before the first price and again
  under the picker: a skin never changes your level, and it is open to
  everyone, member or not.

### The watch plate (livestreams, Sep 2026)
The reading plate's own language, doing the same job one surface further on: an
**unlit velvet surface standing exactly where the player will stand**, full
stage width, no border and no radius, one soft top light, the stream's name in
the On-Photo voice and one mono line of when. Under it, in the position a
player's controls would take, the honest line: *the player arrives with the
first real stream.*

- **Running lifts the plate one tonal step** and puts the existing live chip
  and dot on it, with a quiet mono viewer count under the meta line, labelled
  a demo figure in the same breath as the number.
- **No cool rim, ever.** Cool Rim means the scan lane in this app. The live
  chip and its dot are the one sanctioned exception and they are the existing
  component, unchanged; the plate itself takes no coloured border, outline or
  wash in either state.
- **The chip on the plate is not repeated below it.** The row under the plate
  carries what the plate does not: what opens the night, and what turning up
  is worth.
- **"Starts in" is a counted fact**, so it is in the counting mono with the
  ledger and the scan codes, never in a colour, with its day/hour/minute units
  read out of the dictionary so a Thai reader is not handed three Latin
  letters.

### The artwork plate (editions, Sep 2026)
What an edition holder receives beside the object: the **drawn illustration of
that object** at 78px in the badge stroke, on the same velvet ground as the
reading and watch plates, full-bleed inside the shelf entry with a hairline
above and below and no radius.

- **Drawn, never photographed, and never a likeness.** It is an icon at plate
  scale, in the stroke language the badges already use, which is what keeps
  the licensed-image rule (PRD §11) untouched.
- **Bone on velvet, never gold.** An artwork arrived with a purchase; gold in
  this app is only ever what a fan earned.
- **It carries the provenance sentence, and the shelf entry above it then does
  not.** The sentence is repeated verbatim on every surface the fan meets that
  edition on — but once per surface, never twice three lines apart.
- **It says what it opens**, in one line under the provenance, and the mark it
  opens is the same drawing at 28px in the card picker.

### Cards / Containers
- Cards survive in three places only: the **badge case** (badges are objects in
  a case), the **voice-note player** and other interactive controls, and the
  **one inverted panel**. Corner 13px, Velvet Panel, hairline border.
- **Notes:** compliance one-liners sit in a faint gold-washed panel
  (rgba gold .05 bg, .20 border) — never a colored left-accent bar.
- **Counted facts** (the passport's lifetime/badges pair) are not cards: a
  hairline above, a hairline between, 24px mono numerals set on `--lh-display`.
- **Inverted panel:** exactly one in the app. The earned-only rule on the Stardust
  passport sits on a Bone ground with a centered ring glyph, a mono caps title
  and #4D4941 body, so the structural promise reads institutional. Rarity is
  the whole effect; every other note stays dark.

### Rails
- Section header (mono caps, +0.06em, white) with sentence-case muted subcopy
  6px under it, both at the 18px gutter, above a scroll-snapping row.
- Cards are 66% of the stage; the next card breaking the right edge is the only
  affordance — no arrows, no dots, and the rail hides its own scrollbar.
- **Hero size (88%)**: exactly one rail in the app, on the premium page, where
  the surface is about the things themselves. Wide (3:2) rather than tall, so
  it reads as a flagship instead of a larger feed card. The right-edge peek is
  still the only affordance. Rarity is the effect, as with the inverted panel.
- Captions sit **below** the card, never on it: name in bone, then one mono
  micro-line (price, or place); a micro-line that names a price is ember. An
  empty MEDIA key becomes a quiet velvet tile carrying the name in the on-photo
  voice, not a photo placeholder. The tile is **borderless** — a tonal, top-lit
  panel reading as an unlit surface (the hairline came off in the Aug 2026
  rebuild, where a row of bordered boxes was the loudest chrome on the screen).
- **Order in the feed**: the events rail sits after item 3 and the shop rail
  after item 7. Events lead because rooms are photographed and merch is not,
  so a picture reaches the fan in the first screens of the edition.
- **Metadata chips** may ride the card face in two zones, top-left and
  bottom-left, at most one chip each: the date (chip-cool, the same "when are
  you in the room" light the scan lane carries) and the admission tier or
  capacity. A chip turns ember only when it names a price. Where a chip carries
  the date, the caption micro-line carries the place instead.

### Long-form story blocks
Repeating subhead (bold Schibsted, sentence case) then paragraph then
full-bleed media slot, with no card chrome between sections so the reading
runs unbroken. Slots read from the MEDIA map and collapse without a trace when
the key is unfilled: no frame, no caption, no gap.

### The MEDIA map
Every image on the page reads from one map keyed by mediaKey. Five keys ship
filled from `MEDIA_DEFAULTS` with the approved atmospheric placeholders —
`signin-hero`, `premium-hero`, `feed-photoset-1` (Golden Hour, Rooftop,
Bangkok), `feed-photoset-2` (Clay Court Mornings) and `event-02` (Fanframe
Pilot Showcase). Swapping in a licensed photograph is a one-line change per
key. **Reset restores the defaults rather than blanking them**, so a reset demo
looks like a fresh install and not an empty one; anything an artist dropped in
during the session clears. Every other key stays null and collapses.

### Dismiss
A detail reached from a rail or carousel is a card the fan pulled up, so it
closes downward: a 34px translucent-dark circle carrying a monoline chevron in
the GLYPHS stroke, replacing the back link entirely (never both). It floats
over a hero photograph and sits in the flow where there is none. Details
reached by ordinary navigation keep the back link. The origin is held in
memory only, so a reload is correctly a fresh arrival.

### Saving
If a save/keep control is ever built it sits at the **right edge of a detail
page's title row**, and nowhere else: never on a feed card, a grid tile or a
rail card. Cards stay quiet; keeping something is a decision made on the thing
itself. (Rule established Aug 2026; no save feature exists yet.)

### Copy handoff
Where a bullet or perk list sits above a call to action, the last thing read
before the button is one warm sentence that hands the reader to it. Perk lists
about membership or Stardust keep the stardust-ring glyph bullet; plain bullets belong
to long neutral spec lists about an object, and only there.

### Inputs / Fields
- **Style:** Velvet Raised fill, hairline-2 border, 10px radius; mono
  uppercase micro-label above (persistent, never placeholder-as-label).
- **Focus:** gold border (rgba .55) + Velvet High fill; gold caret.

### Navigation
- Bottom tab bar: 5 items, monoline 20px icons + mono 11px labels (the label
  floor holds here too — the brief allowed 10px in the tab bar and the labels
  did not need it),
  gold on active (`aria-current="page"`); center scan tab is a raised
  44px gold-ringed circle on `--shadow-raised` (the soft gold glow came off in
  the Aug 2026 elevation sweep: raised, not lit).

### The Stardust Ring (signature)
One SVG gradient (`#stardustGrad`: **Gold Bloom → Key-Light Gold → Gold Deep**)
drives one shape at three scales: the 46px header meter (with level numeral),
the earn-burst core (count-up + expanding rings + badge drop), and the 186px
passport ring. The gradient stays inside the earned family end to end. It used
to land on Ember, which put the paid colour inside the earned motif and broke
the Earned Light Rule on the app's own signature shape (corrected Aug 2026).
Same shape = same meaning; any new reward surface reuses this ring rather
than inventing a second motif.

**The Celebration Rationing Rule** (Aug 2026). A full-screen takeover is the
loudest thing this app can do, and it was being spent on arrival: the +10
welcome grant opened the same dialog as a live venue check-in, four hundred
milliseconds after sign-in, before the fan had done anything. The takeover is
now **reserved for the venue scan and for milestones that award a badge** —
the moments the fan will remember having been in a room for. Everything else
(the welcome grant, a referral, a mission win) lands **in place**: the meter's
ring pulses, a small gold figure rises out of the meter's right edge and is
gone in 1.5s, the balance counts up under it, and one toast carries the words.
The figure launches at the meter's edge and not beside the numeral, because a
count-up covered by its own "+10" is the one thing the moment must not do.
The state math is identical either way — `earnQuiet()` and `earnMoment()` both
route through `grantStardust()`; only the volume differs. If everything is a
celebration, nothing was earned, which is the Quiet Surface Rule applied to
time instead of to light.

**The burst scales with the earn.** A small grant and a large one are not the
same moment, so they are not the same animation: at 20 Stardust and above the ring
family widens, a fourth ring joins, the core and the count grow, the burst
holds longer, and the venue or badge name is held on screen in mono under the
ring. The badge arrives with no card around it — a disc, a label and a name
dropping into the light. Under `prefers-reduced-motion` the big burst keeps its
larger geometry and simply does not move.

## Do's and Don'ts

### Do:
- **Do** reserve Key-Light Gold for earned things and the primary action, and
  route every paid surface — price, tier, and the button that spends the
  money — through Ember Wash (the Earned Light Rule). Gold's full sanctioned
  list: the Stardust balance and its ring family, badges, levels, Stardust prices,
  reward moments, focus and active states, the primary button, and the ORBIT
  mark on the sign-in masthead — which is the one place gold is identity
  rather than value, and the topbar's mark stays bone so it happens once.
- **Do** let a photograph run to both edges of the stage and carry its own
  title in the On-Photo voice; the standfirst goes in the gutter below it.
- **Do** separate a listing with a rule and generous air (`--air`, 30px)
  rather than by putting each item in a box.
- **Do** reuse the stardust ring for any new reward or progress moment, at one of
  its three established scales.
- **Do** give every mono label a Thai retune override and keep every piece of
  fan-facing text at **11px or larger**, en and th alike, tab bar included.
- **Do** keep compliance copy as one-line reassurance at the point of doubt,
  in the product's voice.
- **Do** draw icons as monoline SVG (stroke 1.4–1.8, round caps) in the
  BADGE_ICONS / GLYPHS stroke language.

### Don't:
- **Don't** use emoji or unicode glyphs as icons anywhere (build-enforced).
- **Don't** use banned faces (Inter, Fraunces, etc. — see CLAUDE.md); the
  three committed families are the system.
- **Don't** add colored left-border accents, decorative gold eyebrow kickers
  over headings, or gold glow on non-reward surfaces. (The detail page's muted
  mono status micro-label is the one sanctioned label above a title: it names
  the type or the state, carries no gold, and earns its line by doing work.)
- **Don't** put a fan-facing listing item in a card. If it has a photograph it
  is full-bleed; if it does not it is a typographic entry with a rule under it.
  This includes navigation lists: the More page is three named runs of
  rule-separated entries, not nine boxes, and the rows that leave or reset
  (Sign out, Reset demo) read a step quieter than the rows that lead somewhere.
- **Don't** say the same thing twice on one surface. A rail tile that carries
  its own name does not repeat it in the caption; a plate or a photograph that
  takes the top of a page takes the title with it; the confirm sheet carries the
  full reassurance and the gate behind it keeps the short version.
- **Don't** leave a production note in the fan's view. An unfilled slot
  collapses without a trace outside artist mode, and that includes its label:
  no "photo to come" tag on a reading or a product.
- **Don't** ship an enabled control that does nothing. If a flow is not built,
  the control is genuinely disabled and one quiet line says why.
- **Don't** let the clay tone out of the sport context, and don't add a fifth
  light of any kind — clay is a content tone, not a meaning.
- **Don't** render scraped images, or generated images of any real person.
  AI-generated atmospheric placeholders with no people, no readable text and
  no logos are permitted (approved 25 Aug 2026) and live in
  `assets/placeholder/`; every other media key stays empty and collapses
  quietly outside artist mode. A filled slot never shows an editing control
  outside artist mode.
- **Don't** introduce a light theme or per-screen palettes; the committed
  world is single, dark, and explicit.
