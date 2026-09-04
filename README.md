# Sardius Pulse — Ecosystem Diagram

Interactive, single-page visualisation of the Sardius Pulse solution architecture.
Desktop-first, light/dark mode, hover states that reveal component detail.

A branded, single-page explainer for the Sardius Pulse solution — header,
problem/solution framing, interactive pipeline diagram, workflow summary,
feature spotlight and CTA. Light theme by default, dark available from the
toggle.

The diagram reads as a single left-to-right pipeline under four stage headings:

```
   CAPTURE            PROCESSING        ARCHIVE                  DELIVERY
Video Source → Encoder → Sardius Channel → Asset Archive → Asset Storage → Pulse Portal
└──── per location ────┘ └──────────── Sardius platform ────────────┘
```

**Left** — one cluster per location, on-site only: Video Source → Encoder.
**Centre** — one platform container holding the three stages that are Sardius
infrastructure. Each location keeps its own lane through its Sardius Channel
(where metadata is applied: Series = location, Categories = event type) and its
Asset Archive; the lanes then converge on a single unified Asset Storage layer.
**Right** — the Pulse Viewing Portal, with the Sardius AI capabilities grouped
under their own branded divider inside the panel.

At rest the diagram is deliberately quiet: the signal-flow lines carry no text,
and the channels show their label only. Detail lives in hover cards — a
`specs` list renders as a label/value table (encoder codec and protocol, channel
ingest and metadata, archive capture and file specs, storage retention and
index). The Pulse Viewing Portal is the exception: everything it does is printed
on the panel, so it has no hover card at all.

A **Use Case** picker in the header switches the whole page between verticals.

## Page structure

`src/App.jsx` composes the page:

| Component | What it holds |
|---|---|
| `PageHeader` | Logo, `Solutions › Pulse` breadcrumb, title, subheading, Use Case picker + theme toggle |
| `ProblemSolution` | Problem/solution framing for the active vertical |
| `PulseDiagram` | The pipeline, with stage headings and animated flow |
| `TextSummary` | "The Pulse Workflow" prose — the page works without hovering anything |
| `FeatureSpotlight` | Four feature cards |
| `CTASection` | Book a Demo / View Documentation |

## Before this goes live

Two placeholders need real values:

- **The logo.** `PageHeader` renders a plain red mark in place of the Sardius
  logo; drop the real asset into `public/` and swap `.brand-mark` for an `img`.
- **The CTA links.** `DEMO_URL` and `DOCS_URL` at the top of `CTASection.jsx`
  are `#` anchors.

The Sardius AI logo is cached locally in `src/icons/SardiusAIIcon.jsx` (source
URL noted in the file header), re-pointed at `currentColor` so it tints. It
exports a standalone `<svg>` for page markup and a `SardiusAIMark` `<g>` for
embedding inside the diagram.

## Run locally## Run locally

```bash
npm install
npm run dev     # http://localhost:5173
```

```bash
npm run build   # -> dist/
npm run preview
```

## Stack

React 18 + Vite, Tailwind CSS v4 (via `@tailwindcss/vite`) for page chrome, and
CSS custom properties for all theming. Every icon and diagram element is
hand-coded inline SVG — no icon libraries.

## Structure

```
src/
├── components/
│   ├── PulseDiagram.jsx   Canvas, gradients, hover orchestration
│   ├── ClusterFrame.jsx   Dashed container + label for one location
│   ├── DiagramNode.jsx    Shapes, icons, tag badge, panel content
│   ├── Arrow.jsx          Bezier connector, arrowhead, mid-path label
│   ├── Tooltip.jsx        Hover detail card (flips above/below the node)
│   └── ModeToggle.jsx     Fixed pill button, top-right
├── icons/                 9 stroke-based SVG glyphs, all `currentColor`
├── data/verticals.js      Church / Education / Enterprise configurations
├── data/pulse.js          buildDiagram(), platform, storage, portal, layout
├── lib/
│   ├── geometry.js        Shape registry, boundaries, curves, arrowheads
│   ├── useTheme.js        Theme state + localStorage persistence
│   └── useVertical.js     Vertical state, persistence and fade timing
└── styles/
    ├── theme.css          Light/dark CSS variables
    └── diagram.css        Diagram, tooltip and toggle styles
```

## Verticals

`src/data/verticals.js` holds one entry per use case — Church (default),
Education, Enterprise. A vertical supplies the location names, their
Categories, and the problem/solution copy:

```js
{
  id: 'education',
  label: 'Education',
  problem: '…',
  solution: '…',
  locations: [
    { id: 'science', name: 'Science Building', categories: 'Lecture, Workshop' },
    …
  ]
}
```

Adding a fourth vertical is just another entry; the picker reads the list.
Selection persists to `localStorage` as `selectedVertical`, and changing it
fades the header statement and the diagram out over 150ms, swaps the data while
invisible, then fades back (`src/lib/useVertical.js`). The diagram is keyed on
the vertical id so no hover state survives a switch.

Everything else is vertical-independent: the pipeline stages, the platform, the
portal, and the per-lane encoder hardware. That last one is positional —
`LANE_HARDWARE` in `pulse.js` makes the *third* lane a PTZ Encoder in every
vertical, so the hardware story stays constant while the names change.

Only Church's locations carry `customMetadataNote` values; the other two omit
the field, so their badge cards show Series and Categories alone. Add notes
there if you want the free-text field demonstrated in every vertical.

## Editing the diagram

`src/data/pulse.js` drives everything, and node coordinates are *derived* rather
than hand-placed.

**Locations.** `buildDiagram(vertical)` turns the active vertical's `locations`
into nodes: each entry generates a Video Source, an Encoder, its cluster frame,
a Sardius Channel and an Asset Archive, plus the connectors between them. Add or
remove a location and the diagram re-flows on its own.

```js
export const locations = [
  { id: 'north', name: 'Campus North', categories: 'Service, Conference' },
  ...
];
```

**Spacing.** `LAYOUT` holds the canvas size, the cluster column positions, row
spacing and the platform/portal anchors. `RAIL` holds the platform's internal
rhythm — icon, title, channel well and capability list — and the channel node
positions are derived from it, so the rail and the well cannot drift apart.
Nothing else contains a magic coordinate.

**Containment.** A node flagged `container: true` (the platform) paints *before*
the connectors, so arrows can run inside it and reach the nodes it holds. It is
also `pointer-events: none` — a box that large would fire a hover on every mouse
move between its children. Nodes flagged `contained: true` (channels, archives,
storage) paint on top and keep their container lit rather than dimmed while
hovered.

**Hover cards.** `description` is always shown. A `specs: [{ label, value }]`
list renders as a table in a wider card; without specs, `details` is shown
instead. Short nodes get the card below (flipping above when space runs out);
panels taller than 140px get it alongside, since neither above nor below fits.

**Placeholders.** The `specs` values in `pulse.js` — codecs, file formats,
bitrate wording — are plausible stand-ins, not verified product specs. Replace
them before this goes in front of a customer.

**Shapes.** `SHAPES` in `src/lib/geometry.js` maps a node `type` to a primitive:
`source` → rect, `encoder` → diamond, `channel` → circle, `platform`/`output` →
panel rect. Boundary maths, label placement and tooltips all read from it, so a
new node type only needs an entry there.

**Panels.** `platform` and `portal` render their title and capability bullets
inside the shape (`titleLines` + `bullets`); everything else gets an external
label, plus optional `captions` (used for Series/Categories) and an optional
`badge`.

A bullet is either a string or `{ text, detail }`, where `detail` is a smaller
second line; `{ divider, mark }` starts a labelled group instead, and `mark:
'sardius-ai'` draws the Sardius AI logo beside the label — that is how the portal carries *Role-based segmentation /
Executive: all sites · Manager: own campus*. `PANEL_METRICS` in
`DiagramNode.jsx` sets the icon size and vertical rhythm per node type, so the
platform can run a larger scale than the portal while sharing one layout path.
Panel content is measured and centred, so a panel never looks top-heavy when its
box is bigger than its content.

**The metadata tag badge.** Each channel carries a red tag badge that is its own
hover/focus target, separate from the node underneath. At rest it is just the
badge plus the Series/Categories captions; on hover it grows and opens a card
with the full metadata, including the optional free-text note:

```js
{
  id: 'north',
  name: 'Campus North',
  categories: 'Service, Conference',
  customMetadataNote: 'Primary worship venue'   // optional — omit and the card
}                                               // shows Series + Categories only
```

The badge card takes precedence over the node's own tooltip, so the two never
stack. Both use the same 150ms fade and the same Sardius Red border on Midnight
Blue (dark) / White (light).

**Connectors.** Each connection takes a `bend`: `0` draws a straight line (the
whole pipeline uses this), `1` bows left of the direction of travel and `-1`
bows right, for steering a curve clear of something it would otherwise cross.
Connections carry no labels — the stages name what is flowing.

**Per-location hardware.** A location may override its encoder: `encoderLabel`
renames the node (Downtown Venue runs a `PTZ Encoder`) and `encoderInput: null`
drops the Input line from its hover card, since a PTZ rig takes no baseband
feed.

**Static nodes.** `interactive: false` removes a node from hover entirely — no
handlers, no card, `pointer-events: none`. The platform container uses it (a box
that large would fire on every mouse move between its children) and so does the
portal, whose capabilities are all visible at rest.

## Theming

Colours are defined once in `src/styles/theme.css`: `:root` holds light mode,
`[data-theme="dark"]` overrides for dark. A small inline script in `index.html`
applies the persisted theme before first paint so there is no flash.

| Token | Light | Dark |
|---|---|---|
| `--accent-red` | `#FE3A1F` | `#FE3A1F` |
| `--bg-primary` | `#FFFFFF` | `#08162B` |
| `--text-primary` | `#08162B` | `#FFFFFF` |
| `--accent-blue` | `#80C1C7` | `#80C1C7` |

Brand fonts (Trade Gothic Bold Condensed, Supreme) are referenced by name in
`--font-heading` / `--font-label` / `--font-body` with system fallbacks. Drop
the licensed webfonts into `public/fonts/` and add `@font-face` rules to
`src/index.css` to pick them up.

## Deploy — Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare Pages → Create project → connect the repo.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Node version: 18 or newer.

## Not yet built

From the brief's post-launch list: solution switcher dropdown, keyboard arrow
navigation between nodes, PNG/SVG export, deep-link query params, animated flow
along the arrows, click-to-expand side panel.
