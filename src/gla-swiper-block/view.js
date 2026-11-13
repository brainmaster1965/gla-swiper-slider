/**
 * Front-end script. Initializes every slider on the page independently.
 * Loaded by WordPress only on pages that contain the block.
 */
import { createSwiper } from '../shared/swiper-init';

function initSlider( container ) {
	if ( container.dataset.glaSwiperInit === '1' ) {
		return;
	}

	let settings;
	try {
		settings = JSON.parse( container.dataset.settings || '{}' );
	} catch ( e ) {
		return;
	}

	container.dataset.glaSwiperInit = '1';
	createSwiper( container, settings );
}

function initAll() {
	document
		.querySelectorAll( '.wp-block-gla-swiper-block > .swiper' )
		.forEach( initSlider );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initAll );
} else {
	initAll();
}
