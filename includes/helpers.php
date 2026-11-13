<?php
/**
 * Server-side helpers for the GLA Swiper Block.
 *
 * @package gla-swiper-block
 */

defined( 'ABSPATH' ) || exit;

/**
 * Allowed aspect ratios (must match the editor options).
 *
 * @return string[]
 */
function gla_swiper_block_aspect_ratios() {
	return array( '16 / 9', '3 / 2', '4 / 3', '1 / 1', '3 / 4', '21 / 9' );
}

/**
 * Clamps a numeric value.
 *
 * @param mixed $value   Raw value.
 * @param float $min     Minimum.
 * @param float $max     Maximum.
 * @param float $default Fallback.
 * @return float
 */
function gla_swiper_block_clamp( $value, $min, $max, $default ) {
	$value = is_numeric( $value ) ? (float) $value : (float) $default;
	return max( $min, min( $max, $value ) );
}

/**
 * Builds the sanitized settings passed to the front-end script (data-settings).
 *
 * @param array $attributes Block attributes (defaults already applied by WordPress).
 * @return array
 */
function gla_swiper_block_get_settings( array $attributes ) {
	$effects    = array( 'slide', 'fade', 'cube', 'coverflow', 'flip', 'cards', 'creative' );
	$paginators = array( 'none', 'bullets', 'fraction', 'progressbar' );

	$effect = isset( $attributes['effect'] ) && in_array( $attributes['effect'], $effects, true ) ? $attributes['effect'] : 'slide';

	$direction = ( isset( $attributes['direction'] ) && 'vertical' === $attributes['direction'] && 'slide' === $effect )
		? 'vertical'
		: 'horizontal';

	$pagination = isset( $attributes['paginationType'] ) && in_array( $attributes['paginationType'], $paginators, true )
		? $attributes['paginationType']
		: 'bullets';

	$get = static function ( $key, $default ) use ( $attributes ) {
		return isset( $attributes[ $key ] ) ? $attributes[ $key ] : $default;
	};

	return array(
		'effect'         => $effect,
		'speed'          => (int) gla_swiper_block_clamp( $get( 'speed', 600 ), 100, 5000, 600 ),
		'loop'           => ! empty( $attributes['loop'] ),
		'direction'      => $direction,
		'autoHeight'     => ! empty( $attributes['autoHeight'] ),
		'slidesMobile'   => gla_swiper_block_clamp( $get( 'slidesMobile', 1 ), 1, 8, 1 ),
		'slidesTablet'   => gla_swiper_block_clamp( $get( 'slidesTablet', 1 ), 1, 8, 1 ),
		'slidesDesktop'  => gla_swiper_block_clamp( $get( 'slidesDesktop', 1 ), 1, 8, 1 ),
		'gapMobile'      => (int) gla_swiper_block_clamp( $get( 'gapMobile', 16 ), 0, 200, 16 ),
		'gapTablet'      => (int) gla_swiper_block_clamp( $get( 'gapTablet', 16 ), 0, 200, 16 ),
		'gapDesktop'     => (int) gla_swiper_block_clamp( $get( 'gapDesktop', 24 ), 0, 200, 24 ),
		'autoplay'       => ! empty( $attributes['autoplay'] ),
		'autoplayDelay'  => (int) gla_swiper_block_clamp( $get( 'autoplayDelay', 4000 ), 500, 20000, 4000 ),
		'pauseOnHover'   => ! empty( $attributes['pauseOnHover'] ),
		'showArrows'     => ! empty( $attributes['showArrows'] ),
		'paginationType' => $pagination,
		'a11y'           => array(
			'prevSlideMessage'        => __( 'Previous slide', 'gla-swiper-block' ),
			'nextSlideMessage'        => __( 'Next slide', 'gla-swiper-block' ),
			'firstSlideMessage'       => __( 'This is the first slide', 'gla-swiper-block' ),
			'lastSlideMessage'        => __( 'This is the last slide', 'gla-swiper-block' ),
			'paginationBulletMessage' => __( 'Go to slide {{index}}', 'gla-swiper-block' ),
		),
	);
}

/**
 * Inline style for the .swiper container (min-height / aspect ratio).
 *
 * @param array $attributes Block attributes.
 * @param array $settings   Sanitized settings.
 * @return string
 */
function gla_swiper_block_container_style( array $attributes, array $settings ) {
	$styles     = array();
	$min_height = isset( $attributes['minHeight'] ) ? trim( (string) $attributes['minHeight'] ) : '';
	$ratio      = isset( $attributes['aspectRatio'] ) ? (string) $attributes['aspectRatio'] : '';

	if ( '' !== $min_height && preg_match( '/^\d+(\.\d+)?(px|em|rem|vh|vw|svh|dvh|%)$/', $min_height ) ) {
		$styles[] = 'min-height:' . $min_height;
	} else {
		$min_height = '';
	}

	if ( '' !== $ratio && in_array( $ratio, gla_swiper_block_aspect_ratios(), true ) ) {
		$styles[] = 'aspect-ratio:' . $ratio;
	} else {
		$ratio = '';
	}

	// A vertical slider needs a defined height.
	if ( 'vertical' === $settings['direction'] && '' === $min_height && '' === $ratio ) {
		$styles[] = 'min-height:400px';
	}

	return implode( ';', $styles );
}

/**
 * Sanitizes a CSS color (hex or rgb/hsl function).
 *
 * @param mixed $color Raw color.
 * @return string Empty string if invalid.
 */
function gla_swiper_block_sanitize_color( $color ) {
	$color = is_string( $color ) ? trim( $color ) : '';
	if ( preg_match( '/^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9\s.,%\/-]+\))$/i', $color ) ) {
		return $color;
	}
	return '';
}

/**
 * CSS custom properties for the arrow / pagination colors.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function gla_swiper_block_color_vars( array $attributes ) {
	$vars   = array();
	$arrow  = isset( $attributes['arrowColor'] ) ? gla_swiper_block_sanitize_color( $attributes['arrowColor'] ) : '';
	$bullet = isset( $attributes['bulletColor'] ) ? gla_swiper_block_sanitize_color( $attributes['bulletColor'] ) : '';

	if ( '' !== $arrow ) {
		$vars[] = '--gla-swiper-arrow-color:' . $arrow;
	}
	if ( '' !== $bullet ) {
		$vars[] = '--gla-swiper-bullet-color:' . $bullet;
	}
	return implode( ';', $vars );
}
