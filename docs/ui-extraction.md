# CYBERSTYLE LLC — UI/UX Extraction & Visual Specification

This document extracts the design language, layout rhythm, typography, composition, and component styling from the reference agency screenshot (`North Strategy`) to guide the original design of **CYBERSTYLE LLC** (`https://cyberstyle.net`).

---

## 1. Macro-Level Layout & Color Transition Rhythm

The reference website creates a striking editorial journey through alternating high-contrast canvas backgrounds:

```
[ HERO: Deep Obsidian / Black (#000000) with Iridescent Silk Ribbon Dynamics ]
                                ↓
[ STRIP: Monochrome Trust Bar / Client Logos (#0A0A0A) ]
                                ↓
[ CONTENT CORE: Pure Crisp Editorial White (#FFFFFF) with Architectural Multi-Column Grid ]
                                ↓
[ TESTIMONIALS & PRICING: Crisp Light Surface with Dark Highlight Center Card ]
                                ↓
[ FOOTER: Deep Obsidian / Black (#000000) with Silk Visual Banner & Monumental Email CTA ]
```

### Color Token Mapping
- **Primary Canvas (Dark)**: `#000000` (Pure Black) and `#0A0A0A` (Deep Obsidian).
- **Primary Canvas (Light)**: `#FFFFFF` (Pure Crisp White) and `#F9FAFB` (Subtle Off-white Surface).
- **Surface Elevation Borders**: `rgba(255, 255, 255, 0.10)` (Dark Mode Hairlines) / `rgba(0, 0, 0, 0.08)` (Light Mode Hairlines).
- **Brand Accent**: `#00F0FF` (Electric Blue) — applied intentionally for interactive hover states, active status dots, selection chips, key data metrics, and CTA highlights.
- **Muted Typography**: `#8E95A5` on dark; `#6B7280` on light.

---

## 2. Typography & Hierarchy

- **Display & Section Headlines**: High-tech, wide geometric display font (Bank Gothic / Eurostile stack).
  - Tight line-height (`leading-[1.05]`), bold tracking, capital letter emphasis.
- **Body & Editorial Copy**: Inter (`font-sans`).
  - Paragraphs set to `text-base` to `text-lg` with `leading-relaxed` (1.6 - 1.7) for optimal editorial legibility.
- **Micro-Labels & Meta Badges**: Monospace / Uppercase sans with `tracking-[0.15em]`, `text-xs`, font-mono indicators (e.g. `NYC - 2026`, `AVAILABLE FOR SELECT BUILDS`, `01/05`).

---

## 3. Component Styling & Visual Patterns

### A. Sticky Navigation Bar
- Frosted glass effect (`backdrop-blur-md bg-black/80`).
- Subtle 1px bottom border (`border-white/10`).
- Left brand wordmark, center nav links with subtle hover underlines, right primary CTA button + status indicator.

### B. Hero Visual & 3D Composition
- Fluid Silk ribbon motion running dynamically across the background.
- Left column: Monumental headline ("Websites Engineered to Move Business Forward") + 2-line strategic value proposition + Dual CTAs ("Start a Project", "View Work").
- Right column: Precision glassmorphic device mockup card with dark background, fine borders, and interactive tilt / hover depth.
- Bottom strip: "Trusted by" monochrome client/partner strip with subtle opacity (`opacity-60 hover:opacity-100`).

### C. White Section Editorial Block
- Seamless transition into pure white.
- Large typographic mission statement ("We partner with startups, growing companies, and established organizations...").
- 2-3 column editorial breakdown explaining the methodology.
- Metric counter strip with vertical grid dividers (`100+`, `40+`, `98%`, `15M+`) with laurel badges.

### D. 3-Column Pricing & Engagement Grid
- Left Card (Tier 1: $800+): White card, dark text, clean list of deliverables, standard outline button.
- Center Card (Tier 2: $1,200+ - Highlighted): Dark obsidian card, silk texture background, white text, electric blue accent badge, illuminated CTA button.
- Right Card (Tier 3: $3,000+): White card, comprehensive enterprise deliverables, custom inquiry CTA.

### E. Testimonial & Social Proof Carousel
- Minimalist quotation mark graphic.
- Large statement text (`text-2xl` - `text-3xl`).
- Right-aligned high-contrast portrait photo.
- Editorial index indicator (`01/05`) with fine `< >` navigation arrows.

### F. High-Impact Footer
- Deep black background with Silk ambient wave.
- Giant hyperlinked contact email (`hello@cyberstyle.net`) styled as an interactive statement.
- Multi-column link lists (Services, Capabilities, Legal, Socials).
- Operational metadata: Timezone clocks, office presence (`USA`, `Canada`, `Middle East`), copyright.
