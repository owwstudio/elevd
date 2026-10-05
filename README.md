# Elevd

Shopify showcase theme based on **Dawn 16.0.0**, upstream commit `bc39a7d2024f1e5c14c42f855bd3552b4913e204`.

Store: `elevd-ai.myshopify.com`.

Design: [Elevd Figma frame](https://www.figma.com/design/FkXglC7ztx7bIPEcHOGSHD/MCP-by-irpun-dev-team?node-id=474-30341).

## Development

```sh
shopify theme dev --environment development
shopify theme check
```

Development targets the unpublished **Elevd** theme (`155207008454`). Do not publish over the live store theme.

[Theme Editor](https://elevd-ai.myshopify.com/admin/themes/155207008454/editor) · [Shopify preview](https://elevd-ai.myshopify.com/?preview_theme_id=155207008454)

## First implementation

- Home page: custom Elevd header, hero and partner logos.
- Dawn commerce templates remain available on other routes.
- Text, destinations, hero replacement image and partner blocks are editable in the Theme Editor.
- Navigation labels without configured destinations intentionally render as text. Connect them when the remaining sections/pages exist.
- The home page footer will be added with the corresponding Figma section.
- Custom animation is deferred; Dawn scroll reveal is disabled in the Elevd preset.

Figma uses **Helvetica Now Display**. The theme currently falls back to Helvetica Neue, Helvetica and Arial. Supply a properly licensed webfont before final typography matching.

## Assets

Assets are sourced from the linked Figma frame. The two hero layers are encoded as 2400px WebP delivery assets with the original aspect ratio and transparency. Downloaded original PNGs are preserved in the ignored `.source-assets/` folder. SVG logo and icon files retain their original markup and dimensions.

## Continuing the page

Implement the About section next, followed by feature navigation, the dark storytelling section, user stories and the footer. Keep each major section independently configurable in Shopify.

The original Dawn documentation is preserved in `README.dawn.md`, and its license is in `LICENSE.md`.
