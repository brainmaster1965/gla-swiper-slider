import { InnerBlocks } from '@wordpress/block-editor';

/**
 * The block is rendered server-side (render.php). Only the slides are saved.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
