/**
 * External dependencies
 */
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

/**
 * WordPress dependencies
 */
const {
	IconButton,
  	PanelBody,
	PanelColor,
	ToggleControl,
	RangeControl,
	Toolbar,
	Dashicon,
} = wp.components

const { Fragment } = wp.element

const { __ } = wp.i18n

const { registerBlockType } = wp.blocks

const {
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	ImagePlaceholder,
	MediaUpload,
	AlignmentToolbar,
	RichText,
	getColorClass,
	UrlInput,
} = wp.blocks

/**
 * Internal dependencies
 */
import './editor.scss';
import './style.scss';

import edit from './edit';

registerBlockType(
	'laa-blocks/cover-image-button',
	{
		title: __( "Image de couverture avec bouton"),
		description: __("Image de couverture avec bouton"),
		icon: 'cover-image',
		category: 'common',
		keywords: [
			__( 'cover image button' ),
		],
		attributes: {
			title: {
				type: 'array',
				source: 'children',
				selector: 'p',
			},
			url: {
				type: 'string',
			},
			button_url: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'href',
			},
			button_text: {
				type: 'array',
				source: 'children',
				selector: 'a',
			},
			backgroundColor: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			customTextColor: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			contentAlign: {
				type: 'string',
				default: 'center',
			},
			id: {
				type: 'number',
			},
			hasParallax: {
				type: 'boolean',
				default: false,
			},
			dimRatio: {
				type: 'number',
				default: 50,
			},
		},

		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( { content } ) => (
						createBlock( 'core/cover-image', { title: content } )
					),
				},
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( { title } ) => (
						createBlock( 'core/heading', { content: title } )
					),
				},
			],
		},

		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},

		edit( { attributes, setAttributes, isSelected, className } ) {
			const { url, title, button_url, button_text, backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor, align, contentAlign, id, hasParallax, dimRatio } = attributes;
			const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
			const onSelectImage = ( media ) => setAttributes( { url: media.url, id: media.id } );
			const toggleParallax = () => setAttributes( { hasParallax: ! hasParallax } );
			const setDimRatio = ( ratio ) => setAttributes( { dimRatio: ratio } );

			const style = backgroundImageStyles( url );
			const classes = classnames(
				className,
				contentAlign !== 'center' && `has-${ contentAlign }-content`,
				dimRatioToClass( dimRatio ),
				{
					'has-background-dim': dimRatio !== 0,
					'has-parallax': hasParallax,
				}
			);

			const controls = (
				<Fragment>
					<BlockControls>
						<BlockAlignmentToolbar
							value={ align }
							onChange={ updateAlignment }
						/>
						<AlignmentToolbar
							value={ contentAlign }
							onChange={ ( nextAlign ) => {
								setAttributes( { contentAlign: nextAlign } );
							} }
						/>
						<Toolbar>
							<MediaUpload
								onSelect={ onSelectImage }
								type="image"
								value={ id }
								render={ ( { open } ) => (
									<IconButton
										className="components-toolbar__control"
										label={ __( 'Edit image' ) }
										icon="edit"
										onClick={ open }
									/>
								) }
							/>
						</Toolbar>
					</BlockControls>
					{ !! url && (
						<InspectorControls>
							<PanelBody title={ __( 'Cover Image Settings' ) }>
								<ToggleControl
									label={ __( 'Fixed Background' ) }
									checked={ !! hasParallax }
									onChange={ toggleParallax }
								/>
								<RangeControl
									label={ __( 'Background Dimness' ) }
									value={ dimRatio }
									onChange={ setDimRatio }
									min={ 0 }
									max={ 100 }
									step={ 10 }
								/>
							</PanelBody>
						</InspectorControls>
					) }
				</Fragment>
			);

			if ( ! url ) {
				const hasTitle = ! isEmpty( title );
				const hasUrl = ! isEmpty( button_url );
				const icon = hasTitle ? undefined : 'format-image';
				const label = hasTitle ? (
					<RichText
						tagName="h2"
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
						inlineToolbar
					/>
				) : __( 'Cover Image' );

				const button_url = hasUrl ? (
					<form
	                className="blocks-format-toolbar__link-modal-line blocks-format-toolbar__link-modal-line"
	              	>
						<Dashicon icon="admin-links" />
						<UrlInput
		                  className="url"
		                  value={ button_url }
		                  onChange={ url => setAttributes( { button_url: url } ) }
			              />
			              <IconButton
		                  icon="editor-break"
		                  label={ __( 'Appliquer' ) }
		                  type="submit"
			              />
	              	</form>
				) : __( 'Button !' );

				return (
					<Fragment>
						{ controls }
						<ImagePlaceholder
							{ ...{ className, icon, label, button_url, onSelectImage } }
						/>

					</Fragment>
				);
			}

			return (
				<Fragment>
					{ controls }
					<div
						data-url={ url }
						style={ style }
						className={ classes }
					>
						{ title || isSelected ? (
							<RichText
								tagName="p"
								className="wp-block-cover-image-text"
								placeholder={ __( 'Write title…' ) }
								value={ title }
								onChange={ ( value ) => setAttributes( { title: value } ) }
								inlineToolbar
							/>
						) : null }

						{ button_url || isSelected ? (
							<form
			                className="blocks-format-toolbar__link-modal-line blocks-format-toolbar__link-modal-line"
			              	>
								<Dashicon icon="admin-links" />
								<UrlInput
				                  className="url"
				                  value={ button_url }
				                  onChange={ url => setAttributes( { button_url: url } ) }
					              />
					              <IconButton
				                  icon="editor-break"
				                  label={ __( 'Appliquer' ) }
				                  type="submit"
					              />
			              	</form>
						) : null }
					</div>
				</Fragment>
			);
		},

		save( { attributes, className } ) {
			const { url, title, button_url, button_text, backgroundColor, color,
			textColor,
			customBackgroundColor,
			customTextColor, hasParallax, dimRatio, align, contentAlign } = attributes;
			const style = backgroundImageStyles( url );
			const classes = classnames(
				className,
				dimRatioToClass( dimRatio ),
				{
					'has-background-dim': dimRatio !== 0,
					'has-parallax': hasParallax,
					[ `has-${ contentAlign }-content` ]: contentAlign !== 'center',
				},
				align ? `align${ align }` : null,
			);

			const textClass = getColorClass( 'color', textColor );
			const backgroundClass = getColorClass( 'background-color', backgroundColor );

			const buttonClasses = classnames( 'wp-block-button__link', {
				'has-text-color': textColor || customTextColor,
				[ textClass ]: textClass,
				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass,
			} );

			const buttonStyle = {
				backgroundColor: backgroundClass ? undefined : customBackgroundColor,
				color: textClass ? undefined : customTextColor,
			};

			return (
				<div className={ classes } style={ style }>
					{ title && title.length > 0 && (
						<RichText.Content tagName="p" className="wp-block-cover-image-text" value={ title } />
					) }

					<div className={ `align${ align }` } style={ { backgroundColor: color } }>
						<RichText.Content
							tagName="a"
							href={ button_url }
							style={ { color: textColor } }
							value={ button_text }
						/>
					</div>
				</div>
			);
		},
	}
)

function dimRatioToClass( ratio ) {
	return ( ratio === 0 || ratio === 50 ) ?
		null :
		'has-background-dim-' + ( 10 * Math.round( ratio / 10 ) );
}

function backgroundImageStyles( url ) {
	return url ?
		{ backgroundImage: `url(${ url })` } :
		undefined;
}
