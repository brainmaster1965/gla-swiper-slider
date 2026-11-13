import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { serialize } from '@wordpress/blocks';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';

import {
	createSwiper,
	getContainerStyle,
	isSingleSlideEffect,
} from '../shared/swiper-init';

const TEMPLATE = [
	[ 'gla/swiper-slide' ],
	[ 'gla/swiper-slide' ],
	[ 'gla/swiper-slide' ],
];

/**
 * Non-editable live preview: renders the current slides in a real Swiper
 * instance so the effect can be checked inside the editor.
 */
function Preview( { attributes, clientId } ) {
	const blocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);
	const slidesHtml = useMemo( () => serialize( blocks ), [ blocks ] );
	const ref = useRef();

	const html =
		`<div class="swiper-wrapper">${ slidesHtml }</div>` +
		( attributes.paginationType !== 'none'
			? '<div class="swiper-pagination"></div>'
			: '' ) +
		( attributes.showArrows
			? '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>'
			: '' );

	// A new key re-mounts the node, so Swiper always starts on a clean element.
	const key = JSON.stringify( attributes ) + slidesHtml;

	useEffect( () => {
		if ( ! ref.current ) {
			return undefined;
		}
		const swiper = createSwiper( ref.current, attributes, {
			preview: true,
		} );
		return () => swiper.destroy( true, true );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ key ] );

	return (
		<div
			key={ key }
			ref={ ref }
			className="swiper gla-swiper__container"
			style={ getContainerStyle( attributes ) }
			dangerouslySetInnerHTML={ { __html: html } }
		/>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		effect,
		speed,
		loop,
		direction,
		autoHeight,
		label,
		slidesMobile,
		slidesTablet,
		slidesDesktop,
		gapMobile,
		gapTablet,
		gapDesktop,
		minHeight,
		aspectRatio,
		autoplay,
		autoplayDelay,
		pauseOnHover,
		showArrows,
		paginationType,
		arrowColor,
		bulletColor,
	} = attributes;

	const [ isPreview, setIsPreview ] = useState( false );
	const single = isSingleSlideEffect( effect );
	const set = ( key ) => ( value ) => setAttributes( { [ key ]: value } );

	const colorVars = {};
	if ( arrowColor ) {
		colorVars[ '--gla-swiper-arrow-color' ] = arrowColor;
	}
	if ( bulletColor ) {
		colorVars[ '--gla-swiper-bullet-color' ] = bulletColor;
	}

	const blockProps = useBlockProps( {
		className: isPreview ? 'is-preview' : undefined,
		style: colorVars,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'gla-swiper-editor__slides' },
		{
			allowedBlocks: [ 'gla/swiper-slide' ],
			template: TEMPLATE,
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	const effectOptions = [
		{ label: __( 'Slide', 'gla-swiper-block' ), value: 'slide' },
		{ label: __( 'Fade', 'gla-swiper-block' ), value: 'fade' },
		{ label: __( 'Cube', 'gla-swiper-block' ), value: 'cube' },
		{ label: __( 'Coverflow', 'gla-swiper-block' ), value: 'coverflow' },
		{ label: __( 'Flip', 'gla-swiper-block' ), value: 'flip' },
		{ label: __( 'Cards', 'gla-swiper-block' ), value: 'cards' },
		{ label: __( 'Creative', 'gla-swiper-block' ), value: 'creative' },
	];

	let effectHelp = '';
	if ( single ) {
		effectHelp = __( 'Shows one slide at a time.', 'gla-swiper-block' );
	} else if ( effect === 'coverflow' ) {
		effectHelp = __(
			'Works best with three or more slides per view.',
			'gla-swiper-block'
		);
	}

	const common = {
		__nextHasNoMarginBottom: true,
		__next40pxDefaultSize: true,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Slider', 'gla-swiper-block' ) }>
					<SelectControl
						{ ...common }
						label={ __( 'Effect', 'gla-swiper-block' ) }
						value={ effect }
						options={ effectOptions }
						help={ effectHelp }
						onChange={ set( 'effect' ) }
					/>
					<RangeControl
						{ ...common }
						label={ __( 'Speed (ms)', 'gla-swiper-block' ) }
						value={ speed }
						min={ 100 }
						max={ 3000 }
						step={ 50 }
						onChange={ ( v ) => set( 'speed' )( v ?? 600 ) }
					/>
					<ToggleControl
						{ ...common }
						label={ __( 'Loop', 'gla-swiper-block' ) }
						checked={ loop }
						onChange={ set( 'loop' ) }
					/>
					{ effect === 'slide' && (
						<SelectControl
							{ ...common }
							label={ __( 'Direction', 'gla-swiper-block' ) }
							value={ direction }
							options={ [
								{
									label: __( 'Horizontal', 'gla-swiper-block' ),
									value: 'horizontal',
								},
								{
									label: __( 'Vertical', 'gla-swiper-block' ),
									value: 'vertical',
								},
							] }
							onChange={ set( 'direction' ) }
						/>
					) }
					{ ( effect === 'slide' || effect === 'fade' ) &&
						direction !== 'vertical' && (
							<ToggleControl
								{ ...common }
								label={ __(
									'Adjust height to active slide',
									'gla-swiper-block'
								) }
								checked={ autoHeight }
								onChange={ set( 'autoHeight' ) }
							/>
						) }
					<TextControl
						{ ...common }
						label={ __( 'Accessible label', 'gla-swiper-block' ) }
						help={ __(
							'Describes the slider for screen reader users.',
							'gla-swiper-block'
						) }
						value={ label }
						onChange={ set( 'label' ) }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Layout', 'gla-swiper-block' ) }
					initialOpen={ false }
				>
					{ ! single && (
						<>
							<RangeControl
								{ ...common }
								label={ __(
									'Slides per view (mobile)',
									'gla-swiper-block'
								) }
								value={ slidesMobile }
								min={ 1 }
								max={ 8 }
								step={ 0.5 }
								onChange={ ( v ) =>
									set( 'slidesMobile' )( v ?? 1 )
								}
							/>
							<RangeControl
								{ ...common }
								label={ __(
									'Slides per view (tablet, from 640 px)',
									'gla-swiper-block'
								) }
								value={ slidesTablet }
								min={ 1 }
								max={ 8 }
								step={ 0.5 }
								onChange={ ( v ) =>
									set( 'slidesTablet' )( v ?? 1 )
								}
							/>
							<RangeControl
								{ ...common }
								label={ __(
									'Slides per view (desktop, from 1024 px)',
									'gla-swiper-block'
								) }
								value={ slidesDesktop }
								min={ 1 }
								max={ 8 }
								step={ 0.5 }
								onChange={ ( v ) =>
									set( 'slidesDesktop' )( v ?? 1 )
								}
							/>
							<RangeControl
								{ ...common }
								label={ __( 'Gap (mobile)', 'gla-swiper-block' ) }
								value={ gapMobile }
								min={ 0 }
								max={ 100 }
								onChange={ ( v ) =>
									set( 'gapMobile' )( v ?? 0 )
								}
							/>
							<RangeControl
								{ ...common }
								label={ __( 'Gap (tablet)', 'gla-swiper-block' ) }
								value={ gapTablet }
								min={ 0 }
								max={ 100 }
								onChange={ ( v ) =>
									set( 'gapTablet' )( v ?? 0 )
								}
							/>
							<RangeControl
								{ ...common }
								label={ __( 'Gap (desktop)', 'gla-swiper-block' ) }
								value={ gapDesktop }
								min={ 0 }
								max={ 100 }
								onChange={ ( v ) =>
									set( 'gapDesktop' )( v ?? 0 )
								}
							/>
						</>
					) }
					<UnitControl
						{ ...common }
						label={ __( 'Minimum height', 'gla-swiper-block' ) }
						value={ minHeight }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'em', label: 'em' },
							{ value: 'rem', label: 'rem' },
							{ value: 'vh', label: 'vh' },
						] }
						onChange={ ( v ) => set( 'minHeight' )( v || '' ) }
					/>
					<SelectControl
						{ ...common }
						label={ __( 'Aspect ratio', 'gla-swiper-block' ) }
						value={ aspectRatio }
						options={ [
							{ label: __( 'Auto', 'gla-swiper-block' ), value: '' },
							{ label: '16:9', value: '16 / 9' },
							{ label: '3:2', value: '3 / 2' },
							{ label: '4:3', value: '4 / 3' },
							{ label: '1:1', value: '1 / 1' },
							{ label: '3:4', value: '3 / 4' },
							{ label: '21:9', value: '21 / 9' },
						] }
						onChange={ set( 'aspectRatio' ) }
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Autoplay', 'gla-swiper-block' ) }
					initialOpen={ false }
				>
					<ToggleControl
						{ ...common }
						label={ __( 'Autoplay', 'gla-swiper-block' ) }
						checked={ autoplay }
						onChange={ set( 'autoplay' ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								{ ...common }
								label={ __( 'Delay (ms)', 'gla-swiper-block' ) }
								value={ autoplayDelay }
								min={ 1000 }
								max={ 10000 }
								step={ 500 }
								onChange={ ( v ) =>
									set( 'autoplayDelay' )( v ?? 4000 )
								}
							/>
							<ToggleControl
								{ ...common }
								label={ __( 'Pause on hover', 'gla-swiper-block' ) }
								checked={ pauseOnHover }
								onChange={ set( 'pauseOnHover' ) }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Navigation', 'gla-swiper-block' ) }
					initialOpen={ false }
				>
					<ToggleControl
						{ ...common }
						label={ __( 'Show arrows', 'gla-swiper-block' ) }
						checked={ showArrows }
						onChange={ set( 'showArrows' ) }
					/>
					<SelectControl
						{ ...common }
						label={ __( 'Pagination', 'gla-swiper-block' ) }
						value={ paginationType }
						options={ [
							{ label: __( 'None', 'gla-swiper-block' ), value: 'none' },
							{
								label: __( 'Bullets', 'gla-swiper-block' ),
								value: 'bullets',
							},
							{
								label: __( 'Fraction', 'gla-swiper-block' ),
								value: 'fraction',
							},
							{
								label: __( 'Progress bar', 'gla-swiper-block' ),
								value: 'progressbar',
							},
						] }
						onChange={ set( 'paginationType' ) }
					/>
				</PanelBody>

				<PanelColorSettings
					title={ __( 'Colors', 'gla-swiper-block' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: arrowColor,
							onChange: ( v ) => set( 'arrowColor' )( v || '' ),
							label: __( 'Arrow color', 'gla-swiper-block' ),
						},
						{
							value: bulletColor,
							onChange: ( v ) => set( 'bulletColor' )( v || '' ),
							label: __( 'Pagination color', 'gla-swiper-block' ),
						},
					] }
				/>
			</InspectorControls>

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ isPreview ? 'edit' : 'visibility' }
						label={
							isPreview
								? __( 'Back to editing', 'gla-swiper-block' )
								: __( 'Preview effect', 'gla-swiper-block' )
						}
						isPressed={ isPreview }
						onClick={ () => setIsPreview( ! isPreview ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div { ...blockProps }>
				{ isPreview ? (
					<Preview attributes={ attributes } clientId={ clientId } />
				) : (
					<div { ...innerBlocksProps } />
				) }
			</div>
		</>
	);
}
