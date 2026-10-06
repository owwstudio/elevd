# Elevd

Shopify showcase theme based on **Dawn 16.0.0**, upstream commit `bc39a7d2024f1e5c14c42f855bd3552b4913e204`.

Store: `elevd-ai.myshopify.com`.

Design: [Elevd Figma frame](https://www.figma.com/design/FkXglC7ztx7bIPEcHOGSHD/MCP-by-irpun-dev-team?node-id=474-30341).

## Development

```sh
shopify theme dev --environment development
shopify theme check
```

Development targets **Elevd Dev** (`155243708614`), which is currently the live theme. **Elevd Motion Preview** (`155209498822`) and the original **Elevd** (`155207008454`) are unpublished. Use this same **Elevd Dev** theme for all subsequent changes and previews; do not create a new theme for each section or iteration. Upload only the requested files and preserve Theme Editor settings. When adding sections, merge the home template with its current remote settings.

[Theme Editor](https://elevd-ai.myshopify.com/admin/themes/155243708614/editor) · [Shopify preview](https://elevd-ai.myshopify.com/?preview_theme_id=155243708614&elevd_intro=replay)

## First implementation

- Home page: custom Elevd header, hero, partner logos and the scroll-led “A day with elevd.” section.
- Dawn commerce templates remain available on other routes.
- Text, destinations, hero replacement image and partner blocks are editable in the Theme Editor.
- Navigation labels without configured destinations intentionally render as text. Connect them when the remaining sections/pages exist.
- The home page uses its own Elevd footer group; footer copy and social labels are editable in the Theme Editor.
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
- Footer verified on Elevd Dev at 320, 390, 600, 768, 900, 1024, 1440, 1920 and 2560px: both original SVG assets load in all five slots with correct geometry and orientation, the 1440px composition matches Figma, the decorative text is intentionally clipped, and there is no horizontal overflow or page error. One footer landmark renders outside main content, after user stories. Screenshots are in `.preview/footer-{desktop,tablet,mobile,wide}.png`.
- User stories section verified on Elevd Dev at 320, 390, 600, 768, 900, 1024, 1440, 1920 and 2560px: all five portraits, both SVG masks and both dividers load, source crops and key positions match Figma at 1440px, no horizontal overflow or page errors, and no new interaction or animation. Existing remote home settings are preserved. Screenshots are in `.preview/use-{desktop,tablet,mobile,wide}.png`.
- Dark story section verified on Elevd Dev at 320, 390, 600, 768, 1024, 1100, 1440, 1920 and 2560px: all five photos, both icons and seven SVG masks/dividers load, Figma crops match at 1440px, no horizontal overflow or page errors, and no new interaction or animation. Screenshots are in `.preview/story-{desktop,tablet,mobile,wide}.png`.
- Logo-loop section verified on Elevd Dev at 320, 390, 600, 768, 1024, 1100, 1280, 1440, 1920 and 2560px: all five labels and four original 24px cube separators render, no horizontal overflow or page errors, and no animation or links. Screenshots are in `.preview/logo-loop-{desktop-strip,tablet,mobile}.png`.
- About section verified in the unpublished Elevd Dev draft at 320, 390, 600, 768, 1024, 1440, 1920 and 2560px: no horizontal overflow, all source assets and masks load, original Figma photo crops are preserved, and carousel navigation remains static. Desktop, tablet and mobile screenshots are in `.preview/about-{desktop,tablet,mobile}.png`.
- Shopify renders the draft successfully through the CLI preview.
- Browser checks at 1440px desktop and 390px mobile: all visible source assets load, no horizontal overflow, one H1, and no page errors.
- Screenshots are stored locally in the ignored `.preview/` folder.
- Helvetica Now Display is installed with the supplied weights; font loading and responsive layout are verified in the Shopify preview.
- Signature intro verified in the unpublished motion draft at 1440px desktop and 390px mobile: one logo moves from viewport center to its navbar position; completion restores normal scrolling and focus. Native Skip, reduced motion, repeat-session bypass and watchdog recovery are verified. No page errors or horizontal overflow after completion.
- Day section verified at 1440px desktop and 390px mobile: all three room assets load, wheel scrolling advances and reverses chapters, chapter links target the correct scene, and resizing removes the desktop pin. Reduced motion exposes all scenes and disables Lenis. Drawer scroll locking pauses and resumes Lenis.
- The active Elevd theme (`155207008454`) is verified after the selective upload: GSAP 3.15.0 and Lenis run, the logo intro completes, all three images load and the Evening chapter is reachable. Theme Check remains at zero errors and nine inherited warnings; no browser page errors or horizontal overflow are observed.

## Continuing the page

The About section follows the day scenes and matches Figma node `522:566`. It includes the large wordmark/tagline, layered grain brand card, two photo features, navigation arrows and three pagination dots. It is a static carousel composition; slide changes, dragging, autoplay and navigation interactions are deferred. Copy, captions and replacement photos are independently configurable in the Theme Editor.

At 900px and above, the editorial composition scales with the viewport up to a centered 1920px canvas. Tablet uses a compact three-card layout, and mobile stacks the brand card above the two photo features. Source photo crops and grain layers match Figma; delivery WebP files preserve the original pixels, with original PNGs kept in `.source-assets/about/`.

The logo-loop section follows About and matches Figma node `522:605`: five capability labels separated by the original orange cube SVG. Desktop preserves the single row, while tablet and mobile wrap complete label/icon groups. Labels and order are editable in the Theme Editor. The strip is static; looping animation and interactions are deferred.

The dark story section follows the logo-loop and matches Figma node `526:660`. It includes the two home images, two portraits, highlighted statement, smiley/crosshair icons, oversized 2025/elevd typography, and roof photograph. Desktop uses an editorial grid, tablet reflows the content, and mobile stacks the images and narrative. Copy and replacement images are independently configurable in the Theme Editor. Figma source crops are preserved; delivery images use full-resolution quality-94 WebP, with original PNGs in `.source-assets/story/`. The existing portrait from About is reused. This section is static; interaction and animation are deferred.

The user stories section follows the dark story and matches Figma node `528:756`: the “How People Use elevd.” introduction, five numbered name/topic rows, five masked portraits, fine dividers and a static contact label. Desktop preserves the two-column composition up to a centered 1920px canvas. Tablet keeps paired name/topic rows; mobile stacks each pair and fits all five portraits across the available width. Heading, description, contact label, story order, names, topics and replacement portraits are editable in the Theme Editor. The first two portraits and their masks are reused from existing sections; new delivery photos preserve full source resolution, with original PNGs in `.source-assets/use/`. Interactions remain deferred.

The home page footer matches Figma node `533:789`: the large invitation headline, original arrow SVGs, cropped “co-designed by AI.” background typography, legal information and three social labels. It uses the `elevd-footer-group` outside the main content, with the Dawn footer group retained on other templates. Desktop scales to a centered 1920px canvas; tablet stacks the bottom groups and mobile reflows the legal labels into a compact grid. All copy and social label order are editable in the Theme Editor. The decorative wordmark is hidden from assistive technology. The footer is static; contact, legal and social navigation interactions are deferred.

Each major section remains independently configurable in Shopify.

The original Dawn documentation is preserved in `README.dawn.md`, and its license is in `LICENSE.md`.
