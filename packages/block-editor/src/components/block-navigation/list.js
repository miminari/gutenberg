/**
 * External dependencies
 */
import { isNil, map, omitBy } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import {
	getBlockType,
} from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import ButtonBlockAppender from '../button-block-appender';

function BlockNavigationItem( { block, isSelected, onClick } ) {
	const { clientId, name } = block;
	const blockIcon = getBlockType( name ).icon;
	const blockLabel = useSelect(
		( select ) => select( 'core/block-editor' ).getBlockLabel( clientId ),
		[ clientId ]
	);

	return (
		<li key={ clientId }>
			<div className="block-editor-block-navigation__item">
				<Button
					className={ classnames( 'block-editor-block-navigation__item-button', {
						'is-selected': isSelected,
					} ) }
					onClick={ onClick }
				>
					<BlockIcon icon={ blockIcon } showColors />
					{ blockLabel }
					{ isSelected && <span className="screen-reader-text">{ __( '(selected block)' ) }</span> }
				</Button>
			</div>

		</li>
	);
}

export default function BlockNavigationList( {
	blocks,
	selectedBlockClientId,
	selectBlock,
	showAppender,

	// Internal use only.
	showNestedBlocks,
	parentBlockClientId,
} ) {
	const shouldShowAppender = showAppender && !! parentBlockClientId;

	return (
		/*
		 * Disable reason: The `list` ARIA role is redundant but
		 * Safari+VoiceOver won't announce the list otherwise.
		 */
		/* eslint-disable jsx-a11y/no-redundant-roles */
		<ul className="block-editor-block-navigation__list" role="list">
			{ map( omitBy( blocks, isNil ), ( block ) => {
				return (
					<BlockNavigationItem
						key={ block.clientId }
						block={ block }
						onClick={ () => selectBlock( block.clientId ) }
						isSelected={ block.clientId === selectedBlockClientId }
					>
						{ showNestedBlocks && !! block.innerBlocks && !! block.innerBlocks.length && (
							<BlockNavigationList
								blocks={ block.innerBlocks }
								selectedBlockClientId={ selectedBlockClientId }
								selectBlock={ selectBlock }
								parentBlockClientId={ block.clientId }
								showAppender={ showAppender }
								showNestedBlocks
							/>
						) }
					</BlockNavigationItem>
				);
			} ) }
			{ shouldShowAppender && (
				<li>
					<div className="block-editor-block-navigation__item">
						<ButtonBlockAppender
							rootClientId={ parentBlockClientId }
							__experimentalSelectBlockOnInsert={ false }
						/>
					</div>
				</li>
			) }
		</ul>
		/* eslint-enable jsx-a11y/no-redundant-roles */
	);
}
