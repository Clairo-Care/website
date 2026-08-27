# Clairo Care Design System

Clairo Care (styled **ClairoCare** in the product) is a self-directed-services
agency for people with developmental disabilities, operating in Maryland (DDA)
and Pennsylvania (ODP). Its tagline is *"Empowering Care, Elevated Lives."*

The software is one Base44/React app — **CareBridge** — with four distinct
surfaces:

| Surface | Who uses it | What it does |
| --- | --- | --- |
| **Caregiver onboarding portal** | new caregivers | step-by-step checklist: application, background check, First Aid/CPR, CMT, auto insurance, Relias training, account setup, shift training |
| **Caregiver day portal** | onboarded caregivers | report weekly hours, log goals and medications, report incidents, watch certification expiries |
| **Family portal** | the family manager who submitted intake | invite and track the caregiving team, upload budget/PCP, CCS meeting step |
| **Admin dashboard** | Clairo coordinators | participants, client pipeline, matchmaker, caregivers, task review, goals, medications, incidents, shift logs |

Third-party systems the copy refers to by name: **Certn** (background checks),
**Relias** (training), **Everee** (payroll), **LTSS Maryland** / **FMCS** /
**Evvie** (EVV and timekeeping), **Giv** (scheduling), **Jotform** (embedded
forms), **Notarize.com**, and the **Mandt System** (behavioural training).

## Sources this system was built from

- GitHub — **https://github.com/clairocare/carebridge1** (branch `main`): the
  live app. Tokens, component values and every UI kit screen come from this code.
  A second repo, **https://github.com/clairocare/carebridge**, was listed on the
  connection but not read. Explore `carebridge1` directly for anything this
  system abbreviates — `src/index.css`, `tailwind.config.js`,
  `src/components/ui/`, `src/components/onboarding/`,
  `src/components/caregiver-portal/`, `src/components/family/`,
  `src/components/admin/` and `src/lib/onboardingSteps.js` are the highest-value files.
- **Clairo Care.pdf** — the 25-page Brand Guidelines v1.0 (logo lockups,
  clearspace, primary + grayscale colour, Manrope specimen, application icons).
- **Asset 5/6/7.png** — the logo lockups and the sunburst mark, copied into
  `assets/`.

## Content fundamentals

The voice is defined in the guideline as *"Compassionately Modern, Empoweringly
Simple, and Respectfully Human"* — warm human connection with a tech-savvy edge,
plain language, empathy and clarity first.

In the product that resolves to:

- **Second person, present tense.** "You're doing great — keep it up!",
  "You still need to complete your own onboarding checklist", "Let's get you
  started with your Clairo Care application." The company appears as **we**:
  "We'll walk you through each required step."
- **Sentence case everywhere**, including buttons: "Add Caregiver",
  "Next Step", "Let's Get Started", "View Certifications & Expirations".
  Uppercase is reserved for tiny tracked eyebrows ("PARTICIPANTS (12)",
  "WHAT TO CHECK").
- **Say what happens next, in the same breath as the state.** "Submitted —
  pending admin review. You can continue to the next step and come back here any
  time." Never a bare "Error" or "Pending".
- **Reassurance about time and effort.** "it takes about 5–10 minutes",
  "usually within 1 business day", "Relias takes a few hours — go ahead and set
  up your accounts in the next step while you work on it."
- **Named humans, not roles.** "Your coordinator Logan Stone is here to help
  every step of the way." Support always resolves to `hello@clairo.care`.
- **Celebration is allowed, once per milestone.** "Step complete! 🎉",
  "You're officially in!", "Welcome to the Clairo Care family, Jane!"
- **Regulatory nouns are never softened** — DDA, ODP, CPS/Adam Walsh, EVV,
  Difficulty of Care (DOC), I-9, W-4, CMT, Mandt. Plain-language explanation
  follows the term rather than replacing it.
- **Emoji are part of the voice, used deliberately:** 👋 greeting, 🎉 milestone,
  💙 the support note, 👥 team, ⏸ on hold, ✓ confirmation, and one emoji per
  onboarding step (👋 🪪 🩺 💊 🚗 🎓 📱 📚 🛡️ 🏠 🎉) and task category
  (📄 document, 🎓 training, ✍️ agreement). Never more than one per line, never
  decorative.
- **Em dashes and "—" asides are common**; exclamation marks appear only at
  milestones. Copy is short: one sentence of instruction, one of reassurance.

## Visual foundations

**Palette.** Four brand colours: off-white `#FAFBFF`, Clairo Blue `#5CB6F2`,
navy `#00103D`, light blue `#9AD6F7`, plus an eight-step named grayscale
(Cloud → Black). The running app uses a slightly warmer navy —
`hsl(222 47% 11%)` — for headers and hero panels, and a blue-tinted page white,
`hsl(214 60% 98%)`. Both are exported: `--clairo-navy-brand` for brand/print,
`--clairo-navy` for product UI. Blue is the only action colour; navy is the only
dark surface. Status colour is a Tailwind-derived tinted-surface + dark-text pair
per state (green approved, yellow submitted, blue in-progress, purple pending
review, red action-needed, amber warning, orange blocked).

**Type.** Manrope only, weights 200–800; 400 body, 500/600 UI, 700/800 headings.
The scale is small and dense: 14px is the workhorse, 12px for meta, 24px hero
titles, 30px for the two full-page moments. Tracking is default except
`-0.025em` on card and dialog titles and `+0.025em` on uppercase eyebrows.

**Layout.** Fixed max-widths, always centred, with 16px gutters: 448px for
single-purpose screens, 896px for the caregiver and family portals, 1152px for
admin. `main` stacks sections 32px apart; cards within a section 12px. The navy
header is `position: sticky` at `z-index: 50` and the only fixed element.
Everything else scrolls. Layouts are single-column on mobile and stay
single-column on desktop — admin uses a 3-up stat grid and nothing wider.

**Backgrounds.** No photography, no illustration, no repeating pattern, no
texture, no grain. Depth comes from exactly two moves: the navy panel, and
soft off-canvas circles (`bg-white/5`, `bg-clairo-blue/10`, 128–160px,
pulled outside the panel with negative offsets). One gradient exists —
`linear-gradient(to bottom right, navy, blue 80%)` — used only for the day
portal header and the "You're officially in!" panel. Never a gradient on a
button, a card, or a page background.

**Cards and borders.** White surface, 1px `--border` hairline
(`hsl(214 30% 88%)`), 12px radius for list cards and 16px for section panels,
plus a 1px shadow. Approved task cards swap to a green border and a 30% green
tint. Emphasis CTAs (the "invite your team" block) use a **2px** 60%-blue border
and a 10→20% blue diagonal wash. No left-border accent stripes anywhere.

**Shadows.** `shadow-sm` and `shadow` on cards, `shadow-md` on the active step
chip and floating buttons, `shadow-lg` on the sticky header and dialogs. No
inner shadows, no glows. Dialog scrim is 80% black — flat, not blurred.
The product uses **no backdrop blur at all**.

**States.** Hover darkens a filled button to 90% opacity-mix of itself; outline
and ghost buttons fill with the navy accent; cards move their border to 40%
blue and gain `shadow-sm`; list rows wash to `muted/40`. Press states are not
styled — nothing shrinks or scales. Focus is a 1px `--ring` (blue) outline;
switches and checkboxes get a 2px offset ring. Disabled = 50% opacity and
`pointer-events: none`. Locked steps are muted grey at 50% text opacity with
`cursor: not-allowed`.

**Motion.** Framer-motion mount only: opacity 0→1 with y 20→0 for panels,
y 8→0 for list rows, ~30ms stagger down a list. Progress fills over 500ms
ease-out; colour transitions 150ms. Chevrons rotate 180° when a section opens.
The single spinner is a 32px 4px-stroke ring. Nothing bounces, nothing springs,
nothing loops except that spinner.

**Imagery and transparency.** The only images are the logo lockups. Transparency
is used as colour-mix, not as glass: `/5` and `/10` washes for tinted surfaces,
`/20` for on-navy badges, `/60` and `/80` for text on navy.

## Iconography

- **Lucide** is the icon set (`components.json` → `"iconLibrary": "lucide"`,
  `lucide-react@0.475.0`). Stroke 2, sizes 12 / 14 / 16 / 20 / 24, coloured with
  `currentColor` or `--clairo-blue`. Icons in circles sit on a 10%-blue disc
  (`32px` or `36px`, `border-radius: full`). This design system links Lucide
  from the CDN (`unpkg.com/lucide@0.475.0`) and wraps it in `Icon` — the
  repo contains no icon files of its own to copy, so this is a like-for-like
  link, not a substitution.
- Icons seen in the product: heart, shield, graduation-cap, pen-line, upload,
  file-text, x, check, check-circle-2, chevron-right/down/up, log-out, users,
  home, eye, arrow-left/right, plus, trash-2, refresh-cw, search, user,
  alert-circle, alert-triangle, sparkles, pill, calendar-days, history, info,
  shield-check, external-link, clock, mail, pencil, smartphone, help-circle.
- **Emoji do icon duty for onboarding steps and task categories** (see Content
  fundamentals). They are content, not decoration, and appear inside step chips,
  task cards and headings.
- No icon font, no SVG sprite, no PNG icons. The brand guideline also shows
  Instagram and X/Twitter application icons; no files for them were provided, so
  none are included here.

## Fonts

Manrope is loaded from Google Fonts (the same import the app uses), so this
system ships no font binaries and declares no `@font-face` of its own. If you
need self-hosted Manrope woff2 files, add them to `assets/fonts/` and extend
`tokens/fonts.css`.

## Index

- `styles.css` — the entry point; `@import`s everything below.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radii.css`,
  `shadows.css`, `motion.css`, `fonts.css`.
- `assets/` — `logo-lockup-navy.png`, `logo-lockup-white.png`,
  `logo-mark-light-blue.png`.
- `guidelines/` — 19 specimen cards for colour, type, spacing, shape and brand.
- `components/` — see below.
- `ui_kits/` — `caregiver-portal/`, `family-portal/`, `admin-dashboard/`
  (each with its own README and `index.html`).
- `SKILL.md` — Agent Skills entry point.
- `github.md` — source repo association and sync record.

## Components

Grouped by concern; every component has a sibling `.d.ts` and `.prompt.md`.

**core/** — `Button`, `Badge`, `Card` (`CardHeader`, `CardTitle`,
`CardDescription`, `CardContent`, `CardFooter`), `Avatar`, `Separator`,
`Skeleton`, `Table` (`TableHeader`, `TableBody`, `TableRow`, `TableHead`,
`TableCell`), `Icon`.

**forms/** — `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `RadioGroup`
(`RadioGroupItem`), `Switch`, `UploadDropzone`.

**feedback/** — `StatusBadge`, `Alert`, `Callout`, `Progress`, `Dialog`,
`LoadingScreen`.

**navigation/** — `PortalHeader`, `Tabs`, `StepChips`, `StepProgressBar`.

**brand/** — `Logo`, `HeroPanel`, `StatCard`, `TaskCard`, `ProgressRow`,
`EmptyState`.

### Intentional additions

The app's `src/components/ui/` is a stock shadcn "new-york" install; the
brand-bearing components live in the feature folders. These entries are
compositions of that source rather than 1:1 files, added because every screen
repeats them:

- `Icon` — wrapper over the CDN Lucide build (the app imports `lucide-react` directly).
- `StatusBadge` — the `getStatusColor`/`getStatusLabel` map from
  `src/lib/onboardingSteps.js`, as a component.
- `Alert` / `Callout` — the tinted notice blocks written inline throughout the app.
- `HeroPanel`, `StatCard`, `ProgressRow`, `EmptyState`, `PortalHeader`,
  `StepChips` — the repeated navy panel, stat tile, progress row, empty state,
  sticky header and step selector.
- `UploadDropzone` — the dashed upload label from `TaskCard.jsx`.

### Not recreated

Stock shadcn primitives that exist in the repo but appear rarely or not at all in
the screens read: accordion, alert-dialog, aspect-ratio, breadcrumb, calendar,
carousel, chart, collapsible, command, context-menu, drawer, dropdown-menu, form,
hover-card, input-otp, menubar, navigation-menu, pagination, popover, resizable,
scroll-area, sheet, sidebar, slider, sonner/toast, toggle, toggle-group, tooltip.
Use the shadcn new-york defaults with these tokens if you need one.
