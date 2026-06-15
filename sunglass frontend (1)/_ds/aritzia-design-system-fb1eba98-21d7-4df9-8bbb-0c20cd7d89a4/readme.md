# Aritzia Design System

A design system reconstruction of **Aritzia** — the Vancouver-founded ("611 Alexander St. Vancouver BC") vertically-integrated fashion house that designs and sells its own exclusive brands (Wilfred, Babaton, TNA, Denim Forum, Sunday Best, Super World, etc.). Aritzia.com is a premium, editorial e-commerce experience: minimalist black-and-white chrome, enormous whitespace, and full-bleed fashion photography doing nearly all the emotional work.

This system captures the **everyday luxury** voice: confident, clean, a little playful, never loud.

## Sources

This reconstruction was built from **48 full-page screenshots** of aritzia.com (desktop, summer 2026 — "The Al Fresco Collection / Summer Heat") provided in `uploads/`. Surfaces captured: homepage (hero, category tiles, editorial blocks, product carousels), the mega-menu (Sweatfleece), All-Clothing landing + product listing grid (PLP), product detail page (PDP), My Bag (empty), sign-in, search panel, and the global footer.

> No Figma file or codebase was provided. Components here are faithful **visual** recreations measured from the screenshots — pixel-accurate to the eye, not copies of Aritzia's production code. If you have the real Figma/repo, drop it in and refine.

### ⚠️ Substitutions to confirm
- **Typeface.** Aritzia ships a proprietary geometric grotesque ("Aritzia Sans"). It is substituted here with **Hanken Grotesk** (Google Fonts) — the closest open match (warm geometric grotesque, double-story `a`, single-story `g`). Swap in the real font files if you have them — see `tokens/fonts.css`.
- **Wordmark.** The ARITZIA logo (custom high-contrast serif) is preserved as an **image asset** (`assets/aritzia-wordmark*.png`) rather than re-typeset, so it stays accurate.
- **Photography & logo marks** were cropped from the provided screenshots for fidelity. Replace with licensed originals for any production use.

---

## CONTENT FUNDAMENTALS — how Aritzia writes

Aritzia's copy is **short, warm, and quietly confident**. It sounds like a stylish friend who knows exactly what looks good and isn't trying too hard.

- **Voice / person.** Second person, conversational, occasionally imperative. Talks *to* you, about *your* wardrobe, *your* summer. *"More summer staples in your wardrobe. More sun on your legs this season."* *"It's hot out. Better wear these sunny HomeStretch™ sets and your new favourite shorts."*
- **Casing.** **Sentence case** for almost everything — headlines, nav, buttons, product names ("Eleta Poplin Mini Dress"). Note product names are Title Case. UPPERCASE is reserved for tiny structural labels only (footer column heads "ARITZIA" / "GET HELP", the "JOIN ARITZIA'S MAILING LIST" eyebrow).
- **Spelling.** Canadian/British inflections surface: **"colour"**, "favourite", "Shop By Colour". Keep them.
- **Headlines** are evocative two/three-word phrases, never salesy: *"Summer Heat"*, *"Going Out"*, *"This Is Aritzia"*, *"Contour Tube Tops"*. Collection eyebrows sit above: *"The Al Fresco Collection"*.
- **Microcopy** is friendly and plain-spoken: *"You haven't put any items in your bag."* · *"Start Shopping"* · *"Don't worry, you can unsubscribe from our mailing list at any time."* · *"Insider info on sales, new arrivals and more good stuff."*
- **Product storytelling.** PDP descriptions get a playful little headline + one tight paragraph: *"To the farmers market you go" — "This is a shortsleeve mini shirt dress with a removable self-tie belt. It's made from 100% cotton poplin with a crisp, airy feel that's smooth to the touch."*
- **Functional labels** are crisp and literal: "Add to Bag — $88.80", "Deliver to Me", "Pick Up In Store", "Select a Size", "Find Your Size", "Size Chart", "Shop Now", "Details", "Shop Sale".
- **Merchandising tags** are 1–3 words, factual not hypey: *Deeper Markdown · Trending Near You · 3 Heights · New · App Exclusive · Styled*.
- **Trademarks** appear inline on proprietary fabrics/fits: HomeStretch™, CruiseLinen™, Crepette™, Soft Feels™, Super World™. Keep the ™.
- **No emoji. No exclamation-spam.** Warmth comes from word choice, not punctuation.

---

## VISUAL FOUNDATIONS

The aesthetic is **editorial minimalism**: monochrome interface, the photograph is the hero.

### Colour
- **True black (#000) + true white (#fff)** carry the entire UI. Text, buttons, footer, rules — all black on white, white on black. No greys-as-brand, no gradients-as-decoration.
- A tight **cool-grey ladder** does the quiet work: `#ECECEC` studio-tile backdrops, `#F6F6F6` subtle section bands, `#E2E2E2` hairlines, `#6E6E6E` secondary copy, `#C9C9C9` input borders.
- **Colour lives in the photography only** — warm, sunny, lightly filmic imagery (Miami pastels, golden Copenhagen evenings). The interface never competes with it.
- **One brand hue:** the ladybug red (`#CE1B2D`) — a mascot accent on the wordmark and the footer bug, never a UI fill.
- **One functional hue:** sale red (`#DD2515`) for marked-down prices (strikethrough original in black/grey, sale price in red).

### Type
- Single family, set at **regular weight even for huge headlines** — scale creates hierarchy, not boldness. Display lines run 56–68px; section heads 21px medium; nav 15px medium; body 16px; product copy/prices 15px.
- Tracking is **tight on display**, neutral on UI, **wide on uppercase micro-labels**.
- Generous line-height on body (~1.55), tight on display (~1.05).

### Backgrounds & imagery
- **Full-bleed** edge-to-edge hero video/photography. Frequently **split-screen** (two half-width images side by side, e.g. "Shorts" / "Contour Tube Tops", "Going Out").
- Product studio shots sit on a seamless **light-grey (#ECECEC) sweep**; e-comm "ghost" flat-lays on the same grey.
- No patterns, no textures, no illustration backgrounds. Imagery is warm/natural — sunlit, slightly filmic, never cold or heavily graded. Models are full-length, relaxed, looking-away-candid.
- On-image text gets a **soft directional scrim** (subtle top/bottom gradient) for legibility — never a solid capsule.

### Shape, borders, elevation
- **Sharp corners everywhere. Radius = 0** on buttons, inputs, tags, cards, tiles. The *only* curves are perfect circles: colour swatches and the play/pause control.
- **Flat.** Shadows are essentially absent. Separation comes from whitespace + 1px hairlines. Flyout menus/search get the faintest pop shadow at most.
- **Cards have no border, no shadow, no rounding** — a product "card" is simply image-on-grey, then name + price in plain text beneath. Editorial restraint.
- Outlined controls use a **1px solid black** border (filter chips, "Pick Up In Store"); filled controls are solid black.

### Motion & states
- Quiet and quick. **Cross-fades and opacity** over movement; no bounces, no springy easing. Autoplaying hero video with mute/pause controls.
- **Hover:** links drop to ~60% opacity or gain an underline; "Shop Now"-style links are underlined by default. Images may swap to an alternate shot.
- **Press/selected:** controls fill solid black with white text (e.g. "Deliver to Me" selected vs "Pick Up In Store" outlined). No shrink/scale tricks.
- **Focus:** 2px black outline, offset.

### Layout
- Desktop horizontal gutter ~40px; lots of vertical breathing room between sections.
- Sticky top nav (logo left on landing, collapses to a slim sticky bar on scroll; search + bag + bookmark + Sign In on the right).
- **PLP grid:** 4-up on desktop, tiles nearly edge-to-edge (~4px gaps). Each tile: image, optional corner tag, name, price, then a row of round colour swatches with a "+N" overflow.
- **PDP:** large left image column (stacked, scrolling), sticky-ish right rail with title/price, swatches, size select, Deliver/Pick-up toggle, "Add to Bag", Klarna line, collapsible Details/Size&Fit/Shipping.
- Footer is a tall **black** block: mailing-list signup (left), ARITZIA + GET HELP link columns, social row, App Store badge, locale selector, payment marks, and the ladybug bottom-left.

---

## ICONOGRAPHY

Aritzia's icons are **thin, minimal line icons** — hairline weight, no fills, geometric, monochrome (black on white / white on black). They never carry colour and never use emoji.

- **Signature glyphs:** magnifier (Search), an outlined **shopping bag** (cart), a **bookmark/save ribbon** (wishlist — appears on every product tile and the PDP), a chevron (selects/expanders), arrow (`→`, mailing-list submit), and a circular **play/pause** control over video.
- **The set in this system** is **Lucide** (loaded from CDN) — a thin-stroke open-source line set whose weight and geometry closely match Aritzia's. This is a documented **substitution**; swap for the real icon assets if available. Stroke ~1.5px, `currentColor`, 20–24px.
- **No emoji, ever.** Unicode is used only as typography (the `—` em-dash in "Add to Bag — $88.80", the `™` on fabric trademarks, `+12` swatch overflow).
- **Brand mark:** the **ladybug** is Aritzia's mascot — a red accent on the wordmark's "I", and a standalone illustrated bug in the footer. Provided as `assets/ladybug-white.png` / `assets/ladybug-black.png` (transparent). **Do not redraw it** — use the asset.
- **Payment / partner marks** (Visa, Mastercard, Amex, Discover, PayPal, Apple Pay, Klarna) and **social** (TikTok, Instagram, Pinterest, YouTube) appear monochrome in the footer.

---

## INDEX — what's in this system

**Foundations**
- `styles.css` — global entry point (link this one file). `@import`s everything below.
- `tokens/fonts.css` — webfont loading (Hanken Grotesk) + substitution notes.
- `tokens/colors.css` — neutrals ladder + semantic colour aliases.
- `tokens/typography.css` — families, scale, weights, tracking, semantic roles.
- `tokens/spacing.css` — spacing, radius (mostly 0), borders, motion, layout, grid, z-index.
- `tokens/base.css` — element resets + utility type classes.

**Design System tab cards** — `foundations/*.html` (Type, Colours, Spacing, Brand specimen cards).

**Components** — `components/` reusable React primitives:
- `core/` — Button, IconButton, Tag, Eyebrow
- `commerce/` — ColorSwatches, PriceTag, ProductCard
- `forms/` — Input, SizeSelect, ToggleGroup
- `brand/` — Wordmark, Ladybug

**UI kit** — `ui_kits/aritzia_web/` — interactive recreation of aritzia.com (Home, PLP, PDP, Bag) composed from the components above. See its `README.md`.

**Skill** — `SKILL.md` — makes this folder usable as a downloadable Claude Skill.

---

*Reconstruction for design tooling. Aritzia, the wordmark, the ladybug, product names, brand names and photography are property of Aritzia LP.*
