# Uptime — Design System

## Color Palette
- **Primary**: Deep Indigo `#4338ca` — focused, intelligent, trustworthy
- **Primary Light**: `#6366f1` — softer indigo for hover states and accents
- **Accent**: Cyan `#06b6d4` — energetic, fresh, vibrant
- **Accent Light**: `#22d3ee` — lighter cyan for highlights
- **Success**: `#10b981` — green for active/completed states
- **Warning**: `#f59e0b` — amber for upcoming/soon states
- **Danger**: `#ef4444` — red for overdue/urgent
- **Background**: `#f8fafc` — near-white slate base
- **Surface**: `#ffffff` — card backgrounds
- **Surface Alt**: `#f1f5f9` — subtle section backgrounds
- **Text Primary**: `#0f172a` — near-black
- **Text Secondary**: `#64748b` — muted slate
- **Border**: `#e2e8f0` — light dividers

## Typography
- **Font Family**: Inter (Google Fonts) — clean, modern, highly legible
- **Display / Hero**: 700 weight, 2xl–4xl sizes
- **Headings**: 600–700 weight
- **Body**: 400–500 weight, 16px base
- **Labels / Captions**: 500 weight, 12–14px

## Elevation & Shadows
- **Card shadow**: `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)` — soft indigo-tinted
- **Modal shadow**: `0 20px 60px rgba(0,0,0,0.15)`
- **Floating elements**: subtle blur backdrop

## Components

### Cards
- Rounded corners: `border-radius: 16px`
- Padding: `24px`
- White background with soft shadow
- Hover: slight elevation lift + border highlight

### Buttons
- Primary: Indigo fill, white text, `border-radius: 10px`, bold label
- Secondary: Outlined indigo border, indigo text
- Accent: Cyan fill for CTA actions (e.g. "Start Timer")
- Sizes: sm (32px), md (40px), lg (48px)

### Input Fields
- Rounded: `border-radius: 10px`
- Border: `1px solid #e2e8f0`, focus ring: indigo
- Label above input, clean placeholder text

### Navigation
- Bottom navigation bar (mobile-first): 4 tabs — Dashboard, Timetable, Timers, Settings
- Top app bar on desktop with logo and nav links
- Active tab: indigo fill indicator

### Motivational Pop-Up / Modal
- Centered overlay with blurred backdrop
- Large quote text, decorative quotation marks in cyan
- "Let's Go" dismiss button in indigo gradient

### Class Cards (Timetable)
- Subject name in bold, time and room as secondary text
- Left color bar accent per subject (cycle through palette)
- Bell icon indicating reminder status

### Study Timer
- Large circular countdown ring (SVG) in indigo/cyan gradient
- Time remaining in xl bold font at center
- Controls below: Start / Pause / Reset

## Layout
- Mobile-first: max-width container, 16px side padding
- Desktop: centered max-width 1200px, sidebar or top nav
- Grid: CSS Grid + Flexbox
- Spacing scale: 4px base unit (4, 8, 12, 16, 20, 24, 32, 48px)

## Motion & Interaction
- Subtle transitions: `transition: all 0.2s ease`
- Modal entrance: fade + scale up from 95%
- Page transitions: fade
- Timer ring: smooth SVG stroke-dashoffset animation
- Card hover: `transform: translateY(-2px)`

## Visual Style
- Vibrant but clean — not childish, not corporate
- Generous whitespace
- Gradient accents (indigo-to-cyan) on hero elements and CTAs
- Student-friendly iconography (Lucide icons or similar)
- Mobile-optimized touch targets (min 44px)
