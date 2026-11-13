<?php
/**
 * Plugin Name:       GLA Swiper Block
 * Description:       A pure slider block for the block editor, powered by Swiper.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            GLA
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gla-swiper-block
 * Domain Path:       /languages
 *
 * @package gla-swiper-block
 */

defined( 'ABSPATH' ) || exit;

define( 'GLA_SWIPER_BLOCK_VERSION', '1.0.0' );
define( 'GLA_SWIPER_BLOCK_DIR', plugin_dir_path( __FILE__ ) );

require_once GLA_SWIPER_BLOCK_DIR . 'includes/helpers.php';

/**
 * Registers the parent (slider) and child (slide) blocks from the build folder.
 */
function gla_swiper_block_init() {
	load_plugin_textdomain( 'gla-swiper-block', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

	$blocks = array(
		'gla/swiper-block' => 'gla-swiper-block',
		'gla/swiper-slide' => 'gla-swiper-slide',
	);

	foreach ( $blocks as $name => $folder ) {
		$dir = GLA_SWIPER_BLOCK_DIR . 'build/' . $folder;

		if ( ! file_exists( $dir . '/block.json' ) ) {
			add_action( 'admin_notices', 'gla_swiper_block_missing_build_notice' );
			return;
		}

		register_block_type( $dir );

		wp_set_script_translations(
			generate_block_asset_handle( $name, 'editorScript' ),
			'gla-swiper-block',
			GLA_SWIPER_BLOCK_DIR . 'languages'
		);
	}
}
add_action( 'init', 'gla_swiper_block_init' );

/**
 * Admin notice shown when `npm run build` has not been executed yet.
 */
function gla_swiper_block_missing_build_notice() {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	printf(
		'<div class="notice notice-error"><p>%s</p></div>',
		esc_html__( 'GLA Swiper Block: the build folder is missing. Run "npm install && npm run build" in the plugin directory.', 'gla-swiper-block' )
	);
}
