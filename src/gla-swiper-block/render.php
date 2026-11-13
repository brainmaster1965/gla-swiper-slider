<?php
/**
 * Front-end markup for the GLA Swiper Block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner blocks (slides).
 * @var WP_Block $block      Block instance.
 *
 * @package gla-swiper-block
 */

defined( 'ABSPATH' ) || exit;

if ( '' === trim( $content ) ) {
	return;
}

$gla_settings  = gla_swiper_block_get_settings( $attributes );
$gla_container = gla_swiper_block_container_style( $attributes, $gla_settings );
$gla_label     = ! empty( $attributes['label'] ) ? $attributes['label'] : __( 'Carousel', 'gla-swiper-block' );

$gla_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'gla-swiper is-effect-' . $gla_settings['effect'],
		'style' => gla_swiper_block_color_vars( $attributes ),
	)
);
?>
<div <?php echo $gla_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div
		class="swiper gla-swiper__container"
		role="region"
		aria-roledescription="carousel"
		aria-label="<?php echo esc_attr( $gla_label ); ?>"
		data-settings="<?php echo esc_attr( wp_json_encode( $gla_settings ) ); ?>"
		<?php echo '' !== $gla_container ? 'style="' . esc_attr( $gla_container ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	>
		<div class="swiper-wrapper"><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
		<?php if ( 'none' !== $gla_settings['paginationType'] ) : ?>
			<div class="swiper-pagination"></div>
		<?php endif; ?>
		<?php if ( $gla_settings['showArrows'] ) : ?>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		<?php endif; ?>
	</div>
</div>
