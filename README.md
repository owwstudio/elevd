# Elevd

Shopify showcase theme based on **Dawn 16.0.0**, upstream commit `bc39a7d2024f1e5c14c42f855bd3552b4913e204`.

Store: `elevd-ai.myshopify.com`.

Design: [Elevd Figma frame](https://www.figma.com/design/FkXglC7ztx7bIPEcHOGSHD/MCP-by-irpun-dev-team?node-id=474-30341).

## Development

```sh
shopify theme dev --environment development
shopify theme check
```

Development targets the unpublished **Elevd Motion Preview** theme (`155209498822`). The active Elevd theme is `155207008454`. Verify changes on the draft, then deploy only the requested files to the active theme; preserve Theme Editor settings.

[Theme Editor](https://elevd-ai.myshopify.com/admin/themes/155209498822/editor) · [Shopify preview](https://elevd-ai.myshopify.com/?preview_theme_id=155209498822&elevd_intro=replay)

## First implementation

- Home page: custom Elevd header, hero, partner logos and the scroll-led “A day with elevd.” section.
- Dawn commerce templates remain available on other routes.
- Text, destinations, hero replacement image and partner blocks are editable in the Theme Editor.
- Navigation labels without configured destinations intentionally render as text. Connect them when the remaining sections/pages exist.
- The home page footer will be added with the corresponding Figma section.
- The home page has a signature introduction: the actual navbar logo starts at the center of a dark screen, then travels into its final position as the hero appears.

## Signature introduction

The intro runs once per browser-tab session. Reduced motion, Theme Editor, history restoration and anchor destinations bypass it. A Skip intro button, Escape, viewport changes and an eight-second watchdog restore the page immediately. The logo is the actual navbar link throughout the sequence, so there is no duplicate-logo handoff.

Append `elevd_intro=replay` to the preview URL to replay the intro. No-JavaScript visitors see the ordinary page. Intro code is loaded only on the home page.

## Room-scene assets

Morning, Focus and Evening interiors have been generated using ChatGPT Images and saved as `assets/elevd-room-{mode}.webp`. The three scenes share one base composition. The `elevd-day` section follows partner logos on the home page. Text, scene order and replacement images are editable in the Theme Editor. Initial dummy copy and prompts are in `design/room-scenes/`; original PNGs are preserved in the ignored `.source-assets/rooms/` directory.

## Scroll interaction

The home page loads locally hosted GSAP 3.15.0, ScrollTrigger 3.15.0 and Lenis 1.3.26. Package download integrity is verified against npm metadata; upstream license headers are preserved. See `vendor/README.md` for sources.

Lenis uses GSAP’s ticker as its only animation loop and synchronizes ScrollTrigger on scroll, following the [official Lenis integration](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger). It starts after the logo intro and pauses for Dawn’s scroll-locking drawers. Touch scrolling stays native.

On desktop viewports at least 900px wide and 650px tall, ScrollTrigger pins the day stage for three chapters, crossfading the room image and description as scroll advances or reverses. Scene links navigate to the corresponding chapter. On smaller screens the three scenes remain vertically stacked, with scroll-linked image reveals. Reduced motion and the Theme Editor show all scenes without pinning, reveals or smooth scrolling. When scripts are unavailable, the ordinary stacked scenes and anchor links still work.

Section load/unload events clean up and recreate their own GSAP contexts, preventing duplicate pins in the Theme Editor. Libraries and custom scrolling code are loaded only on the home page.

The theme uses **Helvetica Now Display** from the supplied font files. Seven upright weights are registered: Thin (265, matching the source font metadata), Light (300), Regular (400), Medium (500), Bold (700), ExtraBold (800) and Black (900). Regular and Bold are preloaded; other weights load when used. Dawn's global body and heading font families and the Elevd sections use this family.

## Assets

Assets are sourced from the linked Figma frame. The two hero layers are encoded as 2400px WebP delivery assets with the original aspect ratio and transparency. Downloaded original PNGs are preserved in the ignored `.source-assets/` folder. SVG logo and icon files retain their original markup and dimensions.

Supplied TTF font files are converted to WOFF2 without subsetting. Character maps, glyph order and advance metrics are verified against the originals. Source fonts are preserved in the ignored `.source-assets/fonts/` folder.

## Validation

- Shopify Theme Check: zero errors; nine warnings inherited unchanged from Dawn.
- Shopify renders the draft successfully through the CLI preview.
- Browser checks at 1440px desktop and 390px mobile: all visible source assets load, no horizontal overflow, one H1, and no page errors.
- Screenshots are stored locally in the ignored `.preview/` folder.
- Helvetica Now Display is installed with the supplied weights; font loading and responsive layout are verified in the Shopify preview.
- Signature intro verified in the unpublished motion draft at 1440px desktop and 390px mobile: one logo moves from viewport center to its navbar position; completion restores normal scrolling and focus. Native Skip, reduced motion, repeat-session bypass and watchdog recovery are verified. No page errors or horizontal overflow after completion.
- Day section verified at 1440px desktop and 390px mobile: all three room assets load, wheel scrolling advances and reverses chapters, chapter links target the correct scene, and resizing removes the desktop pin. Reduced motion exposes all scenes and disables Lenis. Drawer scroll locking pauses and resumes Lenis.
- The active Elevd theme (`155207008454`) is verified after the selective upload: GSAP 3.15.0 and Lenis run, the logo intro completes, all three images load and the Evening chapter is reachable. Theme Check remains at zero errors and nine inherited warnings; no browser page errors or horizontal overflow are observed.

## Continuing the page

Implement the About section next, followed by feature navigation, the dark storytelling section, user stories and the footer. Keep each major section independently configurable in Shopify.

The original Dawn documentation is preserved in `README.dawn.md`, and its license is in `LICENSE.md`.
