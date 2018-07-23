const { Component } = wp.element
const { __ } = wp.i18n

const {
	BlockControls,
	BlockAlignmentToolbar,
	AlignmentToolbar,
} = wp.editor

export default class Toolbar extends Component {

	constructor( props ) {
		super( props )
	}

	render() {

		const { align, contentAlign, setAttributes } = this.props

		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );

		return (
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
			</BlockControls>
		)
	}
}
