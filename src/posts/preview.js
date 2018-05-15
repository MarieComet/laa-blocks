const { Spinner } = wp.components
const { Component } = wp.element
const { __ } = wp.i18n
const { RichText } = wp.blocks

import classnames from 'classnames';

export default class Preview extends Component {

	constructor( props ) {
		super( props )

		// Les états permettent de stocker les valeurs internes du composant
		this.state = {
			posts: null,
		}
	}

	getPost() {
		// Appel API via la lib JS
		//this.props.setAttributes( { number_event: this.props.number_event } );

		const postQuery = new wp.api.models.Post();
		// Fetch post via API
		postQuery.fetch( { data: { per_page: this.props.number_event } } ).then( posts => {
			this.setState( { posts: posts } )
		} )
	}

	componentWillMount() {
		this.getPost();
	}

	componentDidUpdate(lastProps, lastStates) {

		if( lastProps.number_event != this.props.number_event ) {
			this.getPost()
		}
	}

	render() {

		console.log(this);
		if ( ! this.state.posts ) {
			return (
				<p class="capitaine-placeholder">
					<Spinner />
					{ __('Chargement des articles') }
				</p>
			)
		}

		if ( this.state.posts.length === 0 ) {
			return (
				<p class="capitaine-placeholder">
					{ __('Aucun article trouvé') }
				</p>
			)
		}

		const onChangeContent = event => {
			this.props.setAttributes( { sectionTitle: event.target.value } )
		}

		const classes = classnames(
			this.props.className,
			this.props.align ? `align${ this.props.align }` : null,
		);

		return (
			<div style={ {
			  backgroundColor: this.props.backgroundColor,
			  textAlign: this.props.alignment,
			} } className={ classes }>
				<ul className={ this.props.className + " posts-list row" }>
					{ this.props.isSelected ? ( // N'afficher le champ seulement si le bloc est actif
						<input
							type="text"
				            value={ this.props.sectionTitle }
				            className='section_title col-12'
				            onChange={ onChangeContent }
				            placeholder={ __('Les derniers articles') }
						/>
					) : (
						<h1 className="section_title col-12 text-center" style={{ color: this.props.titleColor }}>{ this.props.sectionTitle }</h1>
					) }
					{ this.state.posts.map( posts => {
						return (
							<li className="">
								<div className="inner-post h-100">
									{ !! posts.feat_image_url && (
										<img
											src={ posts.feat_image_url.archive_thumb[0] }
											className="wp-block-laa-posts-grid-post__image"
										/>
									) }
									<a href={ posts.link } target="_blank">
										<h1 className="entry-title">
										{ posts.title.rendered }
										</h1>
									</a>
								</div>
							</li>
							)
					}) }
				</ul>
			</div>
		)

	}
}
