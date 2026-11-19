=== Gla Swiper Block ===
Contributors: gla
Tags: slider, swiper, carousel, block, gutenberg
Requires at least: 6.5
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A pure slider block for the WordPress block editor, powered by Swiper 12.2.0.

== Description ==
Gla Swiper Block provides a clean, conflict-free slider block (`gla/swiper-block`) with inner slide blocks (`gla/swiper-slide`) for the WordPress block editor, powered by Swiper 12.2.0.

**Key Features:**

*   **Flexible Slides:** The parent block `gla/swiper-block` is rendered server-side, while the slides (`gla/swiper-slide`) use InnerBlocks and can contain any WordPress block.
*   **Conflict-Free Bundling:** Swiper is bundled directly into the block's own view script without exposing anything on `window`. Other plugins using different Swiper versions will not collide with this block.
*   **Scoped Styles:** Swiper's CSS is nested under `.wp-block-gla-swiper-block` at build time, preventing style leaks to other `.swiper` elements on the page.
*   **Performance Optimized:** Scripts and styles are loaded conditionally only on pages that actually contain the block.
*   **Multiple Sliders:** Each slider instance is initialized independently, allowing any number of sliders on a single page.
*   **Accessibility:** Respects `prefers-reduced-motion` by disabling autoplay and falling back to instant slide transitions.
*   **Customizable:** Configure arrow and pagination colors, minimum height, and aspect ratio directly in the block settings, or fine-tune further using CSS custom properties.
*   **Translations:** Includes German (`de_DE`) localization out of the box.

== Installation ==

1. Upload the `gla-swiper-block` folder (including the `build/` directory) to the `/wp-content/plugins/` directory, or install the plugin zip directly through the WordPress plugins screen.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add the "Gla Swiper Block" in the block editor and insert your desired blocks into the individual slides.

== Frequently Asked Questions ==

= How can I customize the size of the navigation arrows or pagination bullets? =
Arrow and pagination colors, minimum height, and aspect ratio can be configured directly in the block inspector settings. For further adjustments, you can override Swiper's CSS variables on the block wrapper (e.g., in the Site Editor or "Additional CSS"):

`
.wp-block-gla-swiper-block {
	--swiper-navigation-size: 28px;
	--swiper-navigation-sides-offset: 10px;
	--swiper-pagination-bullet-size: 12px;
	--swiper-pagination-bullet-horizontal-gap: 6px;
	--swiper-pagination-bullet-inactive-opacity: 0.45;
}

`
= How do images behave inside a slide? =
Images placed directly inside a slide automatically fill the container and are cropped with `object-fit: cover` whenever the slider has a minimum height or aspect ratio configured.

= Will this plugin conflict with other sliders on my site? =
No. Both the JavaScript bundle and the CSS rules are strictly isolated to this block so they do not interfere with other themes or plugins using Swiper.

== Screenshots ==
1. Swiper Slider preview in the block editor and frontend (`swiperslider-preview.png`).

== Changelog ==

= 1.0.0 =
* Initial release powered by Swiper 12.2.0.
* Added `gla/swiper-block` and `gla/swiper-slide` blocks.
* Added support for `prefers-reduced-motion` and German (`de_DE`) translations.