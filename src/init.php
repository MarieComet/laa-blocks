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

function laa_dynamyc_render_posts( $attributes ) {

	$args = array(
		'post_type' => ( isset( $attributes['post_type'] ) ? : 'post' ),
    'posts_per_page' => ( isset( $attributes['number_event'] ) ? : 3 ),
  );

	$posts = new WP_Query( $args );
  
  if( $posts->have_posts() ) {

    if ( isset ( $attributes['backgroundColor'] ) ) {
    	$backgroundColor = $attributes['backgroundColor'];
    } else {
    	$backgroundColor = '';
    }

    if ( isset ( $attributes['align'] ) ) {
    	$align = $attributes['align'];
    } else {
    	$align = '';
    }

    if ( isset ( $attributes['titleColor'] ) ) {
    	$titleColor = $attributes['titleColor'];
    } else {
    	$titleColor = '';
    }

    $markup = '<div style="background-color:'. $backgroundColor .';" class="align'. $align .'"><ul class="wp-block-laa-posts-grid-events posts-list row">';
    if ( isset( $attributes['sectionTitle'] ) ) {
    	$markup .= '<h1 class="content col-12 text-center" style="color:'. $titleColor .';">' . esc_html( $attributes['sectionTitle'] ). '</h1>';
    }
    if ( isset( $attributes['sectionSubTitle'] ) ) {
    	$markup .= '<p class="section_subtitle col-12 text-center" style="color:'. $titleColor .';">' . esc_html( $attributes['sectionSubTitle'] ). '</h1>';
    }
    
  		while ( $posts->have_posts() ) { $posts->the_post();
  			$markup .= sprintf(
  				'<li class=""><div class="inner-post">%1$s<div class="inner-text"><h2 class="entry-title"><a href="%3$s" title="%2$s">%2$s</a></h2><a href="%3$s" class="button btn-primary read-more" title="%2$s">Lire la suite</a></div></div></li>',
  				get_the_post_thumbnail( get_the_ID(), 'archive_thumb', array( 'class' => 'wp-block-laa-posts-grid-post__image' ) ),
  				esc_html( get_the_title() ),
  				esc_url( get_the_permalink() )
  			);
  	  }
      wp_reset_postdata();
    $markup .= '</ul></div>';

	} else {
    $markup = '<p>No posts</p>';
  }

  return $markup;
}


// Déclarer les blocs qui ont un rendu côté PHP
function laa_register_blocks() {

	// Vérifier que Gutenberg est actif
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	// Pour l'exemple 14
  	register_block_type( 'laa-blocks/posts', array(
		'render_callback' => 'laa_dynamyc_render_posts',
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