# GLA Swiper Block

A pure slider block (`gla/swiper-block` with child block `gla/swiper-slide`) for the
WordPress block editor, powered by [Swiper](https://swiperjs.com) 12.2.0.

Requires WordPress 6.5+ and PHP 7.4+.

## Build

```bash
npm install
npm run build      # production build into /build
npm start          # watch mode
npm run plugin-zip # installable zip (uses the "files" list in package.json)
```

Copy the folder to `wp-content/plugins/gla-swiper-block` (with `build/`) and activate it.

## How it works

- Parent block `gla/swiper-block` is rendered server-side (`render.php`); the slides are InnerBlocks
  (`gla/swiper-slide`) and can contain any block.
- Swiper is imported from npm and bundled into the block's own view script. Nothing is exposed
  on `window`, so other plugins shipping Swiper cannot collide with it (the library is then
  transferred twice if both are on one page - deliberate trade-off for stability).
- Script and CSS load only on pages that contain the block (`viewScript` / `style` in `block.json`).
- Swiper's CSS is nested under `.wp-block-gla-swiper-block` at build time (`meta.load-css` in
  `src/gla-swiper-block/style.scss`), so it cannot affect other `.swiper` markup.
- Each slider is initialized independently; any number per page.
- `prefers-reduced-motion`: no autoplay, effects fall back to an instant slide.

## Styling

Arrow and pagination colors, minimum height and aspect ratio are set in the block settings.
Everything else can be adjusted with CSS variables on the block wrapper (e.g. in
"Additional CSS" or your theme):

```css
.wp-block-gla-swiper-block {
	--swiper-navigation-size: 28px;               /* arrow size (default 44px) */
	--swiper-navigation-sides-offset: 10px;       /* arrow distance from the edge */
	--swiper-pagination-bullet-size: 12px;        /* bullet size */
	--swiper-pagination-bullet-horizontal-gap: 6px;
	--swiper-pagination-bullet-inactive-opacity: 0.45;
}
```

Note: the bullet variable names follow Swiper 11/12 conventions and have not been verified
against the bundled version. If one has no effect, inspect a `.swiper-pagination-bullet` in the
browser dev tools to see which variable it uses.

Images placed directly in a slide fill it (cropped with `object-fit: cover` when the slider has
a min-height or aspect ratio). Set an aspect ratio or min-height for wide/full-width sliders.

## Troubleshooting the build

`style.scss` loads Swiper's CSS from `node_modules/swiper/...`. If Sass cannot find a file:

```bash
ls node_modules/swiper/*.css node_modules/swiper/modules/*.css
```

and adjust the paths in `src/gla-swiper-block/style.scss`.

## Translations

German (de_DE) is included (`languages/`). PHP strings work immediately. For the editor (JS)
strings run once after building, with WP-CLI installed: `npm run i18n`.
