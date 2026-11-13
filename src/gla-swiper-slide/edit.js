import { __, sprintf } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

export default function Edit( { clientId } ) {
	const index = useSelect(
		( select ) => select( blockEditorStore ).getBlockIndex( clientId ) + 1,
		[ clientId ]
	);

	const blockProps = useBlockProps( { className: 'gla-swiper-slide-editor' } );
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'gla-swiper-slide-editor__content' },
		{}
	);

	return (
		<div { ...blockProps }>
			<div className="gla-swiper-slide-editor__label">
				{ /* translators: %d: slide number */ }
				{ sprintf( __( 'Slide %d', 'gla-swiper-block' ), index ) }
			</div>
			<div { ...innerBlocksProps } />
		</div>
	);
}
