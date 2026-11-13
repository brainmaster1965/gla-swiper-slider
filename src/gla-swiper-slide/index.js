import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';

import metadata from './block.json';
import Edit from './edit';
import save from './save';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
