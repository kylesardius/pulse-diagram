# Sardius Pulse Ecosystem Diagram

## Project Overview

Interactive, single-page web application visualizing the Sardius Pulse solution architecture. Desktop-first. Light/dark mode toggle. Hover states reveal component details. Static diagrams initially; future versions for Standard Streaming, AI Tools, Encoding, etc.

**Deployment Target:** Cloudflare Pages (runs locally first with `npm run dev`)

---

## Tech Stack & Environment

- **Framework:** React 18+ (JSX, hooks)
- **Build/Runtime:** Vite
- **SVG:** React inline SVG for icons and diagram elements
- **Styling:** Tailwind CSS + CSS variables for theming
- **Hosting:** Cloudflare Pages (deploy from Git)
- **Node.js:** v18+

---

## Branding & Visual Direction

### Color Palette

```
Primary accent:       Sardius Red        #FE3A1F
Dark mode bg:         Midnight Blue      #08162B
Light mode bg:        White              #FFFFFF / Light Grey #E0E1E5
Text (dark mode):     White              #FFFFFF
Text (light mode):    Midnight Blue      #08162B
Secondary accent:     Light Blue         #80C1C7
Borders (dark):       rgba(255,255,255,0.2)
Borders (light):      rgba(8,22,43,0.1)
```

### Typography

- **Headings:** Trade Gothic Bold Condensed (or sans-serif fallback)
- **Subheadings/labels:** Supreme Bold
- **Body/tooltips:** Supreme Light (or system sans-serif fallback)
- **Text treatment:** Uppercase headings, sentence case labels per brand guide

### Diagram Background

- Dark mode: Dark gradient `#08162B` → slightly lighter at edges
- Light mode: Light Grey `#E0E1E5` or clean white `#FFFFFF`

---

## Diagram Structure — Pulse Solution

### Components (Nodes)

| Component | Type | Shape | Icon | Hover Description |
|-----------|------|-------|------|-------------------|
| Video Source | Input | Rounded Rectangle | Camera | Live cameras, file inputs, external feeds. Supports SDI, HDMI, IP streams, file-based VOD. |
| Encoder Solution | Processing | Diamond | Gear | Sardius encoding, quality layers, bitrate ladder. AWS Elemental, Haivision Makito, custom RTMP/SRT. |
| Sardius Channel (SRT/RTMP) | Hub | Circle | Broadcast Tower | Primary ingest point. Dual protocol support for SRT and RTMP ingestion. Central routing hub. |
| Capture with Metadata | Processing | Diamond | Metadata Tag | SCTE-35 insertion, frame tagging, context capture. Embeds broadcast markers and timing data. |
| Pulse Viewing Portal | Output | Rounded Rectangle | Portal/Window | Web-based viewer with SSO/Auth enforcement. Real-time playback and monitoring dashboard. |
| Library & AI Review | Output | Rounded Rectangle | Folder + AI | Asset storage and AI analysis tools access. VOD library, metadata indexing, AI-powered review. |

### Layout Strategy (Hub-and-Spoke)

**Radial, non-linear layout:**
- **Center:** Sardius Channel (circular hub at 400, 300)
- **Left side (inputs):** Video Source (150, 150), Encoder Solution (150, 450)
- **Right side (outputs):** Pulse Viewing Portal (650, 150), Library & AI Review (650, 450)
- **Bottom/integrated:** Capture with Metadata (400, 450) — feeds data throughout
- **Connections:** Arrows showing flow direction (inputs → hub → processing/outputs)

**Canvas:** 800px × 600px (scalable via SVG viewBox)

---

## Interactive Features

### 1. Light/Dark Mode Toggle

- **Location:** Fixed, top-right corner (20px spacing)
- **Control:** Pill-shaped button with sun/moon icon
- **Styling:** Sardius Red background, white icon, 8px padding
- **Behavior:**
  - Toggles all CSS color variables
  - Persists to `localStorage` as `theme: 'light' | 'dark'`
  - Smooth 200ms fade transition
  - Hover: slightly darker red, subtle scale

### 2. Hover States (Per Node)

**On node hover:**
- Node scales up 1.1x with increased shadow
- Border color changes to Sardius Red
- Tooltip appears below node with:
  - Component name (bold, Supreme Bold)
  - 2–3 line description (Supreme Light)
  - Technical specs (protocols, standards, etc.)
- Background darkens slightly (overlay opacity 0.1)

**Tooltip styling:**
- Background: Midnight Blue (dark mode) / White (light mode)
- Text: White (dark mode) / Midnight Blue (light mode)
- Border: Sardius Red, 1px
- Padding: 12px 16px
- Font size: 13px (Supreme Light)
- Rounded corners: 8px
- Fade-in: 150ms

### 3. Arrow Connections

- **Stroke:** 2px Sardius Red (or Light Blue secondary)
- **Arrow head:** 8px triangle, filled
- **Path:** Curved (Bezier) connecting node centers
- **Hover:** Stroke width → 3px, full opacity
- **Direction:** Flow from inputs → hub → outputs

---

## Diagram Components & SVG Icons

### Shape Definitions

**Rounded Rectangle (Input/Output nodes):**
- Dimensions: 140px width × 80px height
- Border radius: 12px
- Stroke: 2px (varies by theme)
- Fill: Midnight Blue (dark) / Light Grey (light) with subtle gradient
- Icon: 32×32px, centered

**Diamond (Processing nodes):**
- Rotated square, side length 100px
- Stroke: 2px
- Fill: Same gradient as rectangles
- Icon: 32×32px, centered

**Circle (Hub):**
- Radius: 60px
- Stroke: 3px Sardius Red
- Fill: Gradient (Midnight Blue → Light Blue, dark mode only)
- Icon: 40×40px (Sardius mark or broadcast tower)

### Icons to Create (SVG, 32×32px or 40×40px)

All stroke-based (not filled), 1.5px stroke weight, rounded line caps/joins:

1. **CameraIcon** — Simple camera outline (lens, body)
2. **GearIcon** — Interlocking gears (2–3 gears)
3. **BroadcastTowerIcon** — Upright antenna with broadcast waves
4. **MetadataIcon** — Document with label/tag symbol
5. **PortalIcon** — Split window or portal frame
6. **FolderAIIcon** — Folder with circuit board or neural network accent
7. **SunIcon** — Simple sun outline (for light mode toggle)
8. **MoonIcon** — Simple moon outline (for dark mode toggle)

All icons use `currentColor` for easy theming.

---

## Data Model

```javascript
// src/data/pulse.js

export const pulseComponents = [
  {
    id: 'video-source',
    label: 'Video Source',
    type: 'input',
    x: 150,
    y: 150,
    description: 'Live cameras, file inputs, external feeds.',
    details: 'Supports SDI, HDMI, IP streams, file-based VOD sources.',
    icon: 'camera'
  },
  {
    id: 'encoder',
    label: 'Encoder Solution',
    type: 'processing',
    x: 150,
    y: 450,
    description: 'Sardius encoding, quality layers, bitrate ladder.',
    details: 'AWS Elemental, Haivision Makito, custom RTMP/SRT.',
    icon: 'gear'
  },
  {
    id: 'sardius-channel',
    label: 'Sardius Channel',
    type: 'hub',
    x: 400,
    y: 300,
    description: 'Primary ingest point. SRT or RTMP stream ingestion.',
    details: 'Dual protocol support. Central routing hub for all inputs.',
    icon: 'tower'
  },
  {
    id: 'capture',
    label: 'Capture with Metadata',
    type: 'processing',
    x: 400,
    y: 450,
    description: 'SCTE-35 insertion, frame tagging, context capture.',
    details: 'Embeds broadcast markers and timing data throughout workflow.',
    icon: 'metadata'
  },
  {
    id: 'pulse-portal',
    label: 'Pulse Viewing Portal',
    type: 'output',
    x: 650,
    y: 150,
    description: 'Web-based viewer with SSO/Auth enforcement.',
    details: 'Real-time playback and monitoring dashboard.',
    icon: 'portal'
  },
  {
    id: 'library-ai',
    label: 'Library & AI Review',
    type: 'output',
    x: 650,
    y: 450,
    description: 'Asset storage and AI analysis tools access.',
    details: 'VOD library, metadata indexing, AI-powered review.',
    icon: 'folder-ai'
  }
];

export const connections = [
  { from: 'video-source', to: 'sardius-channel', label: 'Video Feed' },
  { from: 'encoder', to: 'sardius-channel', label: 'Encoded Stream' },
  { from: 'sardius-channel', to: 'capture', label: 'Ingested Stream' },
  { from: 'capture', to: 'pulse-portal', label: 'Live View' },
  { from: 'capture', to: 'library-ai', label: 'Archive & Analysis' }
];
```

---

## Component Architecture

### File Structure

```
pulse-diagram/
├── src/
│   ├── components/
│   │   ├── DiagramNode.jsx          # Individual node rendering (rect, diamond, circle)
│   │   ├── Arrow.jsx                # SVG arrow with Bezier curves & arrowheads
│   │   ├── Tooltip.jsx              # Hover tooltip with description
│   │   ├── ModeToggle.jsx           # Light/dark toggle button
│   │   └── PulseDiagram.jsx         # Main diagram container & orchestration
│   ├── icons/
│   │   ├── CameraIcon.jsx
│   │   ├── GearIcon.jsx
│   │   ├── BroadcastTowerIcon.jsx
│   │   ├── MetadataIcon.jsx
│   │   ├── PortalIcon.jsx
│   │   ├── FolderAIIcon.jsx
│   │   ├── SunIcon.jsx
│   │   └── MoonIcon.jsx
│   ├── data/
│   │   └── pulse.js                 # Component & connection data
│   ├── styles/
│   │   ├── theme.css                # CSS variables for light/dark
│   │   └── diagram.css              # Diagram-specific styles
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md (this file)
```

---

## Component Descriptions

### PulseDiagram.jsx (Main Container)

- **Responsibilities:**
  - Render SVG canvas (800×600, viewBox scaling)
  - Manage theme state (light/dark) + localStorage persistence
  - Render all DiagramNode components with hover listeners
  - Render all Arrow components
  - Render ModeToggle button (fixed, top-right)
  - Pass theme context to children

### DiagramNode.jsx

- **Props:** `id, label, type, x, y, icon, description, details, theme, onHover, isHovered`
- **Responsibilities:**
  - Render appropriate shape (rounded rect, diamond, circle) based on `type`
  - Center icon inside shape
  - Apply scale/shadow transforms on hover
  - Emit hover state to parent
  - Render SVG `<g>` with shape + text label

### Arrow.jsx

- **Props:** `from, to, label, fromNode, toNode, theme`
- **Responsibilities:**
  - Calculate Bezier curve path between two nodes
  - Render SVG `<path>` with stroke styling
  - Render arrowhead at end of path
  - Scale stroke on hover
  - Optionally render label mid-path

### Tooltip.jsx

- **Props:** `x, y, title, description, details, theme`
- **Responsibilities:**
  - Position absolutely near hover target
  - Render title (bold), description, details (light)
  - Apply theme colors
  - Fade in/out smoothly
  - Handle edge positioning (don't go off-screen)

### ModeToggle.jsx

- **Props:** `theme, onToggle`
- **Responsibilities:**
  - Render pill button with sun/moon icon
  - Call `onToggle()` on click
  - Apply theme styling
  - Hover effects (darker red, slight scale)

---

## CSS Variables & Theming

### theme.css

```css
:root {
  /* Light mode (default) */
  --bg-primary: #FFFFFF;
  --bg-secondary: #E0E1E5;
  --text-primary: #08162B;
  --text-secondary: #08162B;
  --accent-red: #FE3A1F;
  --accent-blue: #80C1C7;
  --border-color: rgba(8, 22, 43, 0.1);
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --bg-primary: #08162B;
  --bg-secondary: #0a1a35;
  --text-primary: #FFFFFF;
  --text-secondary: #E0E1E5;
  --accent-red: #FE3A1F;
  --accent-blue: #80C1C7;
  --border-color: rgba(255, 255, 255, 0.2);
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
```

---

## Responsive & Performance

- **Desktop-first** (800×600 minimum)
- **SVG scaling:** Use `viewBox` for responsiveness, CSS `max-width: 100%`
- **No animation on scroll** — GPU-friendly, no jank
- **Hover on desktop only** (pointer-events: none on mobile)
- **Theme toggle:** No full-page repaint, CSS vars update instantly

---

## Getting Started

```bash
npm create vite@latest pulse-diagram -- --template react
cd pulse-diagram
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## Deployment to Cloudflare Pages

1. Push to GitHub repo
2. Link repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Build output: `dist/`
5. Deploy automatically on push

---

## Future Enhancements (Post-Launch)

- Dropdown to switch between solutions (Pulse, Standard Streaming, AI Tools, Encoding)
- Keyboard navigation (arrow keys to focus nodes)
- Export diagram as PNG/SVG
- URL query params to highlight specific node
- Animated arrows (flow animation)
- Click to expand node details in a side panel

---

## Notes

- All icons use `currentColor` for easy theming
- Sardius brand colors are strict per brand guidelines
- No external icon libraries — all SVG hand-coded
- Accessibility: semantic HTML, ARIA labels on interactive elements
- No layout shift on theme toggle (colors fade, layout stays fixed)

---

**Ready to build. Paste this README into Claude Code terminal.**
