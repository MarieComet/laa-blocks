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
		const postType = this.props.post_type;
		const postQuery = new wp.api.models[postType]();
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

		if( lastProps.post_type != this.props.post_type ) {
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

		const onChangeSubContent = event => {
			this.props.setAttributes( { sectionSubTitle: event.target.value } )
		}

		const getExcerpt = excerpt => {
		  	return {__html: excerpt }
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
					<div className="col-12">
						<input
							type="text"
				            value={ this.props.sectionTitle }
				            className='section_title col-12'
				            onChange={ onChangeContent }
				            placeholder={ __('Les derniers articles') }
						/>

						<input
							type="text"
				            value={ this.props.sectionSubTitle }
				            className='section_subtitle col-12'
				            onChange={ onChangeSubContent }
				            placeholder={ __('Sous titre') }
						/>
					</div>
					) : (
					<div className="col-12">
						<h1 className="section_title col-12 text-center" style={{ color: this.props.titleColor }}>{ this.props.sectionTitle }</h1>
						<p className="section_subtitle col-12 text-center" style={{ color: this.props.titleColor }}>{ this.props.sectionSubTitle }</p>
					</div>
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
										<h2 className="entry-title" dangerouslySetInnerHTML={ getExcerpt( posts.title.rendered ) }>
										</h2>
										<div
											className="post-excerpt"
											dangerouslySetInnerHTML={ getExcerpt( posts.excerpt.rendered ) }
										/>
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
