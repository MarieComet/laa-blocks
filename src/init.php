<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */
function laa_posts_grid_cgb_block_assets() {
	// Styles.
	wp_enqueue_style(
		'laa_posts_grid-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) )
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function laa_posts_grid_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'laa_posts_grid_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function laa_posts_grid_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
		'laa_posts_grid-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ) // Dependencies, defined above.
		// filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ) // Version: filemtime — Gets file modification time.
	);

	// Styles.
	wp_enqueue_style(
		'laa_posts_grid-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' ) // Version: filemtime — Gets file modification time.
	);
} // End function laa_posts_grid_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'laa_posts_grid_cgb_editor_assets' );

/*
 Pour les blos dynamiques (à partir de l'exemple 14)
*/

function laa_dynamyc_render( $attributes ) {
	error_log(print_r($attributes, true));
	$args = array(
      'posts_per_page' => ( $attributes['number_event'] ?: 3),
    );

	$posts = get_posts( $args );

    if ( count( $posts ) == 0 ) {
      return '<p>No posts</p>';
    }

    $markup = '<div style="background-color:'.esc_attr( $attributes['backgroundColor'] ).';" class="align'.esc_attr( $attributes['align'] ).'"><ul class="wp-block-laa-posts-grid-events posts-list row">';
    if ( $attributes['sectionTitle'] ) {
    	$markup .= '<h1 class="content col-12 text-center" style="color:'.esc_attr( $attributes['titleColor'] ).';">' . esc_html( $attributes['sectionTitle'] ). '</h1>';
    }

	foreach( $posts as $post ) {

		$markup .= sprintf(
			'<li class=""><div class="inner-post">%2$s<a href="%1$s"><h1 class="entry-title">%3$s</h1></a></div></li>',
			esc_url( get_permalink( $post->ID ) ),
			get_the_post_thumbnail( $post->ID, 'archive_thumb', array( 'class' => 'wp-block-laa-posts-grid-post__image' ) ),
			esc_html( get_the_title( $post->ID ) )
		);
    }
    $markup .= '</ul>';

    return $markup;
}


// Déclarer les blocs qui ont un rendu côté PHP
function laa_register_blocks() {

	// Vérifier que Gutenberg est actif
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Pour l'exemple 14
  	register_block_type( 'laa-blocks/events', array(
		'render_callback' => 'laa_dynamyc_render',
	));
  	register_block_type( 'laa-blocks/posts', array(
		'render_callback' => 'laa_dynamyc_render',
	));
}
add_action( 'init', 'laa_register_blocks' );

// add post featured image url to rest return
function register_feat_image_url_field() {
 
  register_rest_field( array( 'events', 'post' ),
    'feat_image_url',
    array(
      'get_callback' => 'feat_image_field'
    )
  );
}
function feat_image_field( $object, $field_name, $request ) {
 
  $id = $object['id'];
  $url = wp_get_attachment_url( get_post_thumbnail_id($id) );
  $sizes = get_intermediate_image_sizes();
 
  $images = array();
  foreach ( $sizes as $size ) {
      $images[ $size ] = wp_get_attachment_image_src( get_post_thumbnail_id($id), $size );
  }
 
  return $images;
}
add_action( 'rest_api_init',  'register_feat_image_url_field' );