/**
 * Shared Swiper setup, used by the front-end script (view.js) and the
 * editor preview (edit.js).
 *
 * Swiper is imported as an ES module and bundled with the block. Nothing is
 * exposed on `window`, so it cannot collide with other plugins shipping Swiper.
 */
import Swiper from 'swiper';
import {
	A11y,
	Autoplay,
	EffectCards,
	EffectCoverflow,
	EffectCreative,
	EffectCube,
	EffectFade,
	EffectFlip,
	Keyboard,
	Navigation,
	Pagination,
} from 'swiper/modules';

/** Effects that only work with exactly one slide per view. */
const SINGLE_SLIDE_EFFECTS = [ 'fade', 'cube', 'flip', 'cards', 'creative' ];

/** Min-width breakpoints (px) for tablet and desktop. Mobile is the base. */
const BREAKPOINT_TABLET = 640;
const BREAKPOINT_DESKTOP = 1024;

export const isSingleSlideEffect = ( effect ) =>
	SINGLE_SLIDE_EFFECTS.includes( effect );

/**
 * Inline style for the .swiper container (editor preview).
 * Mirrors gla_swiper_block_container_style() in PHP.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} React style object.
 */
export function getContainerStyle( attributes ) {
	const style = {};
	if ( attributes.minHeight ) {
		style.minHeight = attributes.minHeight;
	}
	if ( attributes.aspectRatio ) {
		style.aspectRatio = attributes.aspectRatio;
	}
	const vertical =
		attributes.effect === 'slide' && attributes.direction === 'vertical';
	if ( vertical && ! attributes.minHeight && ! attributes.aspectRatio ) {
		style.minHeight = '400px';
	}
	return style;
}

/**
 * Translates the block settings into Swiper options.
 *
 * @param {Object}  settings Block settings (attributes / data-settings).
 * @param {Object}  flags
 * @param {boolean} flags.reducedMotion User prefers reduced motion.
 * @param {boolean} flags.preview       Editor preview (no autoplay etc.).
 * @return {Object} Swiper options (without navigation / pagination elements).
 */
export function buildOptions(
	settings,
	{ reducedMotion = false, preview = false } = {}
) {
	const effect = settings.effect || 'slide';
	const single = isSingleSlideEffect( effect );
	const vertical = effect === 'slide' && settings.direction === 'vertical';
	const perView = ( n ) => ( single ? 1 : n );
	const gap = ( n ) => ( single ? 0 : n );

	const options = {
		modules: [
			Navigation,
			Pagination,
			Autoplay,
			A11y,
			Keyboard,
			EffectFade,
			EffectCube,
			EffectCoverflow,
			EffectFlip,
			EffectCards,
			EffectCreative,
		],
		// With reduced motion, effects fall back to an instant plain slide.
		effect: reducedMotion ? 'slide' : effect,
		speed: reducedMotion ? 0 : settings.speed,
		loop: !! settings.loop,
		direction: vertical ? 'vertical' : 'horizontal',
		autoHeight:
			!! settings.autoHeight &&
			! vertical &&
			( effect === 'slide' || effect === 'fade' ),
		centeredSlides: effect === 'coverflow',
		slidesPerView: perView( settings.slidesMobile ),
		spaceBetween: gap( settings.gapMobile ),
		breakpoints: {
			[ BREAKPOINT_TABLET ]: {
				slidesPerView: perView( settings.slidesTablet ),
				spaceBetween: gap( settings.gapTablet ),
			},
			[ BREAKPOINT_DESKTOP ]: {
				slidesPerView: perView( settings.slidesDesktop ),
				spaceBetween: gap( settings.gapDesktop ),
			},
		},
		watchOverflow: true,

		fadeEffect: { crossFade: true },
		cubeEffect: {
			shadow: true,
			slideShadows: true,
			shadowOffset: 20,
			shadowScale: 0.94,
		},
		coverflowEffect: {
			rotate: 40,
			stretch: 0,
			depth: 120,
			modifier: 1,
			slideShadows: true,
		},
		flipEffect: { slideShadows: true },
		cardsEffect: { slideShadows: true },
		creativeEffect: {
			prev: { shadow: true, translate: [ '-120%', 0, -500 ] },
			next: { shadow: true, translate: [ '120%', 0, -500 ] },
		},
	};

	if ( settings.autoplay && ! reducedMotion && ! preview ) {
		options.autoplay = {
			delay: settings.autoplayDelay,
			disableOnInteraction: false,
			pauseOnMouseEnter: !! settings.pauseOnHover,
		};
	}

	if ( ! preview ) {
		options.keyboard = { enabled: true, onlyInViewport: true };
		options.a11y = { enabled: true, ...( settings.a11y || {} ) };
	} else {
		options.a11y = false;
	}

	return options;
}

/**
 * Creates a Swiper instance on a .swiper container element.
 *
 * @param {HTMLElement} container Container element.
 * @param {Object}      settings  Block settings.
 * @param {Object}      opts
 * @param {boolean}     opts.preview Editor preview mode.
 * @return {Swiper} Swiper instance.
 */
export function createSwiper( container, settings, { preview = false } = {} ) {
	const reducedMotion =
		! preview &&
		!! window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

	const options = buildOptions( settings, { reducedMotion, preview } );

	const prevEl = container.querySelector( ':scope > .swiper-button-prev' );
	const nextEl = container.querySelector( ':scope > .swiper-button-next' );
	if ( settings.showArrows && prevEl && nextEl ) {
		options.navigation = { prevEl, nextEl };
	}

	const paginationEl = container.querySelector( ':scope > .swiper-pagination' );
	if ( settings.paginationType !== 'none' && paginationEl ) {
		options.pagination = {
			el: paginationEl,
			type: settings.paginationType,
			clickable: true,
		};
	}

	return new Swiper( container, options );
}
