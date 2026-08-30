# Brand

DreamShop is the customer-facing brand for the Dream Odessa online store. The repository contains owner-supplied logo and product assets; preserve them unless the owner explicitly approves replacements.

# Product / Website Purpose

Sell DreamShop products through a Ukrainian-language storefront with catalog, product, cart, checkout, account, and supporting admin workflows. Current metadata describes natural fruit chips and treats in Odesa.

# Audience

Ukrainian-speaking customers shopping for DreamShop products, including mobile shoppers. More specific audience segments and accessibility needs: **TBD**.

# Brand Personality

Warm, deliberate and a little ceremonial: DreamShop is an Odesa fruit pantry
and cocktail atelier, not a generic wellness marketplace. It should feel
hand-finished without becoming rustic, busy or nostalgic.

# Art Direction

**Odesa fruit atelier.** Build the storefront from a warm paper-like canvas,
deep petrol ink and cool aqua washes. The owner-supplied ornamental mark is
the visual anchor. Use its fine rules, fruit-and-leaf linework and wave motif
as quiet dividers and framing cues rather than repeating the whole logo as
decoration. The current rendered interface remains regression evidence, not a
visual approval.

# Visual Principles

- Prefer editorial composition, clear product hierarchy and generous negative
  space over repeated UI cards.
- Let the catalogue and real product media do the selling. Never hide missing
  media behind invented imagery or claims.
- Use one confident primary action per context; secondary actions should be
  quiet but unmistakably interactive.
- Keep the aqua identity, but balance it with warm cream and dark ink so text
  remains readable and the visual system has depth.
- Use rules, crop windows and restrained fruit-toned accents instead of glass
  effects, blobs, excessive pills or generic gradients.

# Typography

Use an editorial serif display face for headings and a high-legibility sans
for UI, body copy, prices and forms. Display type should support Ukrainian and
be used for product and page hierarchy, never as a substitute for clarity.
Body text should remain calm, compact and comfortably readable.

# Color System

The redesigned palette keeps the brand's teal/aqua recognizability while
introducing a warm cream canvas and a sparing sun-dried-fruit accent. Petrol
ink is the default text and action color. Aqua is a surface and framing color,
not a low-contrast text background. Every text/action pairing must meet its
required contrast ratio.

# Spacing System

Use a 4px base rhythm with visible tiers: 8/12/16 for controls, 24/32 for
local groups, and 48/72/96 for page sections. Do not use same-sized gaps for
unrelated hierarchy levels.

# Grid / Layout

The desktop storefront uses a 12-column content grid with a readable maximum
width near 75rem and broad exterior gutters. Hero and category composition may
break the grid deliberately; product, cart and checkout information should not.
At tablet and below, reduce to a single content flow before text or controls
become cramped.

# Photography / Imagery

Use owner-supplied backgrounds only as cropped, atmospheric editorial imagery;
never wash the page in an unreadable overlay. R2 product photography is the
source of truth for products. Reserve its aspect ratio before it loads. When a
product has no photo, show a calm labelled studio placeholder that clearly
communicates the state without pretending to be product photography.

# Icons

Lucide React remains the single interface icon family. Use its rounded outline
style at a consistent stroke weight; do not add decorative icon collections.
Every icon-only control needs an accessible name and a 44px minimum hit area.

# Buttons

Primary actions use solid petrol with square-soft corners, not capsules.
Secondary actions use a fine ink border or text link treatment. Buttons may
shift color or lift by one pixel on hover; motion must stop for reduced-motion
users.

# Forms

Form controls are plain, spacious and high-contrast. Labels stay visible above
fields, validation appears alongside the affected field, and checkout order
matches keyboard order at every breakpoint.

# Navigation

Preserve the current information architecture. On desktop, the brand mark is
the home link and text navigation uses an active underline rather than a row of
pills. Cart, wishlist and account actions remain immediately reachable. On
mobile, use the existing accessible drawer with a clear brand header, full-row
links and no competing secondary navigation.

# Cards / Containers

Do not default to cards when hierarchy, grouping, dividers or composition say
more. Product lists should read like a curated shelf: media window, restrained
meta, name, price and one purchase action. Use a raised surface only for forms,
order totals, drawers and other objects that need clear functional separation.

# Product Presentation

Product names, prices, availability, media, quantity, cart and wishlist states
are functional requirements. Images receive most of the visual space. Product
metadata is concise and structured; availability and organic status are
informative labels, not decorative badges. The product page pairs a stable
media area with a concise purchase column and readable description.

# Motion

Current implementation includes shared `160ms` and `200ms` motion tokens.
Approved motion is tactile and subtle: short color/opacity transitions,
single-pixel lifts and the existing drawer movement. No parallax, ambient
floating, auto-rotating content or attention-seeking animation. Motion must
respect reduced-motion preferences.

# Responsive Behavior

The current automated baseline covers 1440px, 768px, and 390px. Significant future visual work must also inspect approximately 1280px and 360px.

# Mobile Rules

No horizontal overflow; preserve content priority, readable type, usable touch
targets, visible primary actions and keyboard-safe forms. Mobile hero content
is composed as a deliberate single column, not a squeezed desktop scene. Keep
the logo meaningful but subordinate it to the shopping action, turn product
lists into two practical columns where media permits, and stack checkout before
its summary only when the action remains visible.

# Accessibility

Maintain semantic landmarks, visible focus, keyboard operation, text and non-text contrast, meaningful image alternatives, labeled controls, zoom support, and reduced-motion behavior. Existing Playwright checks reject serious or critical WCAG A/AA axe violations; rendered review remains required.

# Things To Avoid

- Generic SaaS composition unrelated to the store.
- Repeated card grids as a default layout strategy.
- Card-inside-card structures, excessive pills, badges, and decorative icons.
- Unjustified glassmorphism, AI-style purple/blue gradients, blobs, or glows.
- Meaningless oversized headlines and decorative motion.
- Copying another brand, logo, proprietary text, assets, or distinctive artwork.

# Signature Brand Elements

The owner-supplied DreamShop logo, the aqua/petrol contrast, thin ornamental
rules, restrained fruit-toned accents and the recurring product-media window
are signature elements. They should appear intentionally and sparingly.

# Approved References

No external inspiration references have been approved yet. `docs/design-reference/` contains current implementation fixtures and wireframes for regression evidence; it does not authorize or define a redesign.

# Design Decisions Log

- 2026-08-30: Created persistent design memory without selecting a new visual direction. Existing implementation facts are recorded only as the current baseline; unresolved brand and art-direction decisions remain **TBD**.
- 2026-08-30: After inspecting the customer routes, responsive fixture,
  owner-supplied assets and live isolated production build, selected the
  **Odesa fruit atelier** direction above for the storefront redesign. Product
  imagery remains factual R2 content; no substitute photography is approved.
