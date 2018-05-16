const { Component } = wp.element
const { __ } = wp.i18n

const {
	BlockControls,
	InspectorControls,
	ColorPalette,
} = wp.blocks

const {
  	PanelBody,
	PanelColor,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
	SelectControl,
} = wp.components

export default class Settings extends Component {

	constructor( props ) {
		super( props )

		this.state = {
			posts: null,
		}
	}

	render() {

		const { number_event, post_type, setAttributes, setState, backgroundColor, titleColor } = this.props
		return (
			<InspectorControls>
				<PanelBody title={ __( 'Type de contenu' ) }>
					<SelectControl
						onChange={ post_type => setAttributes( { post_type } ) }
						label={ __( 'Type de contenu' ) }
						options={ [
							{ value: 'Post', label: 'Articles' },
							{ value: 'Events', label: 'Evenements' },
						] }
						value={ post_type }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Nombre d\'articles' ) }>
					<RangeControl
						value={ number_event }
						onChange={ number_event => setAttributes( { number_event } ) }
						min={ 1 }
						max={ 10 }
						beforeIcon="arrow-down"
						afterIcon="arrow-up"
					/>
				</PanelBody>
				<PanelColor
					title={ __( 'Couleur du fond' ) }
					colorValue={ backgroundColor }
				>
					<ColorPalette
						value={ backgroundColor }
						onChange= { backgroundColor => setAttributes( { backgroundColor } ) }
					/>
				</PanelColor>
				<PanelColor
					title={ __( 'Couleur du titre' ) }
					colorValue={ titleColor }
				>
					<ColorPalette
						value={ titleColor }
						onChange= { titleColor => setAttributes( { titleColor } ) }
					/>
				</PanelColor>
			</InspectorControls>
		)
	}
}
