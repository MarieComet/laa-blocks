import './style.scss'
import './editor.scss'

import Preview from './preview'
import Settings from './settings'
import Toolbar from './toolbar'

const { __ } = wp.i18n
const { registerBlockType, RichText } = wp.blocks
const { Fragment } = wp.element

const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

registerBlockType(
	'laa-blocks/posts',
	{
		title: __( "Articles récents"),
		description: __("Afficher la listes des derniers contenus"),
		icon: 'calendar-alt',
		category: 'common',
		keywords: [
			__( 'recents posts alt' ),
		],

		attributes: {
			number_event: {
				type: 'integer',
				default: 3,
			},
			post_type: {
				type: 'string',
				default: 'Post',
			},
			sectionTitle: {
				type: 'string',
				selector: '.section_title',
			},
			sectionSubTitle: {
				type: 'string',
				selector: '.section_subtitle',
			},
			backgroundColor: {
				type: 'string',
			},
			titleColor: {
				type: 'string',
			},
			align: {
				type: 'string',
			},
			contentAlign: {
				type: 'string',
				default: 'center',
			},
		},

		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},

		edit: props => {
		
			const { attributes, className, setAttributes, setState, isSelected } = props
			const { number_event, post_type, backgroundColor, titleColor, sectionTitle, sectionSubTitle, align, contentAlign } = attributes

			return (
				<Fragment>
					<Toolbar { ...{ align, contentAlign, setAttributes } } />
					<Preview { ...{ className, number_event, post_type, sectionTitle, sectionSubTitle, backgroundColor, titleColor, align, setAttributes, setState, isSelected } } />
					<Settings { ...{ number_event, post_type, setAttributes, setState } } />
				</Fragment>
			)
		},

		save: props => {
			console.log(props);
			return null;
    	},
	}
)
