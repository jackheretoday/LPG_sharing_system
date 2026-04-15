# Design System Specification: Liquid-Glass Utility

## 1. Overview & Creative North Star
**The Creative North Star: "The Obsidian Monolith"**

This design system is built to move away from the cluttered, "engagement-hungry" interfaces of social media and toward a high-fidelity, utility-first workspace. The aesthetic is anchored in "Liquid Glass"—a concept where the UI feels like a series of heavy, polished glass panes floating in a deep, void-like space. 

By leveraging **intentional asymmetry**, extreme **white space**, and **tonal layering**, we create an editorial atmosphere that feels more like a premium architectural portfolio than a standard SaaS dashboard. The goal is to provide a "calm authority"—where the interface recedes to let utility and data take center stage.

---

## 2. Colors & Surface Philosophy
The palette is a sophisticated range of near-blacks and off-whites designed to reduce eye strain while maintaining a high-end, tactile feel.

### Surface Hierarchy & The "No-Line" Rule
Traditional UIs use borders to separate ideas; this system uses **Luminance Shifts**. 
*   **The No-Line Rule:** Explicit 1px solid borders are prohibited for sectioning. Use background color shifts (e.g., placing a `surface-container-low` card against a `surface-container-lowest` background) to define boundaries.
*   **Layering Logic:** Treat the screen as a physical desk.
    *   **Base Layer:** `surface` (#131313) or `surface-container-lowest` (#0E0E0E).
    *   **Mid Layer (Content Blocks):** `surface-container` (#1F1F1F).
    *   **Top Layer (Active/Floating):** `surface-bright` (#393939) with Glassmorphism.

### The "Glass & Gradient" Rule
To achieve the "Liquid" feel, floating elements (modals, dropdowns, sticky navs) must use:
*   **Backdrop Blur:** 12px to 20px.
*   **Transparency:** `surface-container` at 70-80% opacity.
*   **Signature Texture:** Main CTAs should utilize a subtle linear gradient from `primary` (#FFFFFF) to `secondary-fixed-dim` (#C9C6C0) at a 145° angle to create a "brushed metal" sheen.

---

## 3. Typography
The typography strategy pairs the structural precision of **Manrope** for headlines with the utilitarian clarity of **Inter** for data and body copy.

*   **Display & Headlines (Manrope):** Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em). These should act as "anchors" for the page, often placed with asymmetrical margins to create an editorial look.
*   **Body & Labels (Inter):** All utility-driven text must remain highly legible. Use `body-md` for standard text and `label-md` for metadata. 
*   **Hierarchy through Tone:** Use `on-surface` (#E2E2E2) for primary headers and `on-surface-variant` (#C5C7C1) for secondary descriptions to create a natural visual path without changing font sizes.

---

## 4. Elevation & Depth
Depth in this system is a result of **Tonal Layering** and **Ambient Light**, not structural shadows.

*   **The Layering Principle:** Depth is achieved by "stacking" container tiers. A `surface-container-high` element naturally "sits above" a `surface-container` base.
*   **Ambient Shadows:** For floating glass elements, use an ultra-diffused shadow: `shadow: 0 20px 40px rgba(0,0,0,0.4)`. The shadow must never look "dirty" or grey; it should feel like a soft occlusion of light.
*   **The Ghost Border:** If a boundary is required for accessibility, use a "Ghost Border": `outline-variant` (#454843) at **15% opacity**. This provides a hint of an edge that catches the "light" without breaking the liquid aesthetic.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#FFFFFF) with `on-primary` (#2F312E) text. No border. Radius: `md` (0.375rem).
*   **Secondary (Glass):** `surface-container-highest` at 60% opacity with a `backdrop-filter: blur(10px)`.
*   **Tertiary:** Ghost style. No background, only `on-surface` text with an underline on hover.

### Input Fields
*   **Style:** Minimalist. Use `surface-container-low` backgrounds. 
*   **States:** On focus, the background shifts to `surface-container-high` and a 1px "Ghost Border" at 40% opacity appears. Avoid heavy focus rings; use a subtle luminance glow instead.

### Cards & Containers
*   **Forbid Dividers:** Never use `<hr>` or border-bottoms to separate list items. Use vertical padding (spacing scale) or a 2% background tint shift between rows.
*   **Utility Glass:** Cards should use `surface-container-low` as a base. For high-priority utility tools, use a "Liquid" effect: a subtle 1px top-stroke (gradient from white to transparent) to simulate light hitting the top edge of glass.

### Chips & Badges
*   **Action Chips:** Low-contrast `secondary-container` backgrounds with `on-secondary-container` text. These should feel like part of the surface, not an interruption.

---

## 6. Do's and Don'ts

### Do
*   **DO** use generous whitespace. If you think there is enough space, double it.
*   **DO** align text-heavy utility sections to a strict grid, but allow "Display" elements to break that grid for visual interest.
*   **DO** use "on-surface-variant" for all non-essential information to keep the UI "quiet."

### Don't
*   **DON'T** use 100% opaque, high-contrast borders. It breaks the "Liquid" immersion.
*   **DON'T** use pure black (#000000) for cards or surfaces; use the `surface` tokens to maintain depth. Pure black is reserved for the background "void."
*   **DON'T** use "Social Media" patterns like "Like" hearts or bright "Notification" red. Use `tertiary-fixed` or subtle state changes for utility-driven alerts.
*   **DON'T** use standard drop shadows. If it doesn't look like ambient light, it doesn't belong.

---

## 7. Implementation Tokens (Sample)

| Role | Token | Value |
| :--- | :--- | :--- |
| Background | `surface` | #131313 |
| Card Base | `surface-container-low` | #1B1B1B |
| Floating Glass | `surface-bright` (80% opacity) | #393939cc |
| Primary Text | `on-surface` | #E2E2E2 |
| Subtext | `on-surface-variant` | #C5C7C1 |
| Ghost Border | `outline-variant` (20% op) | rgba(69, 72, 67, 0.2) |