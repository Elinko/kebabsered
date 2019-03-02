<?php
/**
 * Template Name: Domov
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package theme
 */

get_header();

if( have_posts() ) {
	while( have_posts() ) {
	the_post();
	}
}

$menu_desc = get_field('menu_desc');
$galeria_popis = get_field('galeria_popis');
$kolegovia_nadpis = get_field('kolegovia_nadpis');
$kolegovia_popis = get_field('kolegovia_popis');
$kolega1 = get_field('kolega1_obrazok');
$kolega1_meno = get_field('kolega1_meno');
$kolega1_popis = get_field('kolega1_popis');
$kolega2 = get_field('kolega2_obrazok');
$kolega2_meno = get_field('kolega2_meno');
$kolega2_popis = get_field('kolega2_popis');
$kolega3 = get_field('kolega3_obrazok');
$kolega3_meno = get_field('kolega3_meno');
$kolega3_popis = get_field('kolega3_popis');
$donaska_nadpis = get_field('donaska_nadpis');
$donaska_popis = get_field('donaska_popis');
$donaska_text = get_field('donaska_text');

?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			<div id="about">
			  <div class="container">
			    <div class="row">
			      <div class="col-xs-12 col-md-6 animation-scroll">
			        <div class="about-img">
								<?php echo get_the_post_thumbnail() ; ?>
							</div>
			      </div>
			      <div class="col-xs-12 col-md-6 animation-scroll">
			        <div class="about-text">
								<?php
								 echo the_content();
								?>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>


			<div id="restaurant-menu">
			  <div class="section-title text-center center">
			    <div class="overlay">
			      <div class="overlay-content">
			        <h2>Menu</h2>
			        <hr>
			        <p><?php echo $menu_desc; ?></p>
			      </div>
			    </div>
			  </div>
			  <div class="container">
			    <div class="row">
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Kebab</h2>
			          <hr  class="myhr">
								<?php
									$kebab = new WP_query(array('post_type' => 'kebab', 'orderby' => 'post_id', 'order' => 'ASC'));
									while($kebab->have_posts()){
											$kebab->the_post();
											echo'<div class="menu-item">';
												echo'<div class="menu-item-name">';
											 		the_field('nazov');
												echo'</div>';
												echo'<div class="menu-item-price">';
													the_field('cena');
												echo'</div>';
												echo'<div class="menu-item-description">';
													the_field('popis');
												echo'</div>';
											echo'</div>';
									}
								 ?>

			        </div>
			      </div>
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Bagety</h2>
			          <hr class="myhr">
								<?php
									$bagety = new WP_query(array('post_type' => 'bagety', 'orderby' => 'post_id', 'order' => 'ASC'));
									while($bagety->have_posts()){
											$bagety->the_post();
											echo'<div class="menu-item">';
												echo'<div class="menu-item-name">';
													the_field('nazov');
												echo'</div>';
												echo'<div class="menu-item-price">';
													the_field('cena');
												echo'</div>';
												echo'<div class="menu-item-description">';
													the_field('popis');
												echo'</div>';
											echo'</div>';
									}
								 ?>

			        </div>
			      </div>
			    </div>
			    <div class="row">
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Zapekačky</h2>
			          <hr class="myhr">
								<?php
									$zapekacky = new WP_query(array('post_type' => 'zapekacky', 'orderby' => 'post_id', 'order' => 'ASC'));
									while($zapekacky->have_posts()){
											$zapekacky->the_post();
											echo'<div class="menu-item">';
												echo'<div class="menu-item-name">';
													the_field('nazov');
												echo'</div>';
												echo'<div class="menu-item-price">';
													the_field('cena');
												echo'</div>';
												echo'<div class="menu-item-description">';
													the_field('popis');
												echo'</div>';
											echo'</div>';
									}
								 ?>
			        </div>
			      </div>
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Prílohy</h2>
			          <hr class="myhr">
								<?php
									$prilohy = new WP_query(array('post_type' => 'prilohy', 'orderby' => 'post_id', 'order' => 'ASC'));
									while($prilohy->have_posts()){
											$prilohy->the_post();
											echo'<div class="menu-item">';
												echo'<div class="menu-item-name">';
													the_field('nazov');
												echo'</div>';
												echo'<div class="menu-item-price">';
													the_field('cena');
												echo'</div>';
												echo'<div class="menu-item-description">';
													the_field('popis');
												echo'</div>';
											echo'</div>';
									}
								 ?>
			        </div>
			        <div class="menu-section">
			          <h2 class="menu-section-title">Nealko</h2>
			          <hr class="myhr">
								<?php
									$nealko = new WP_query(array('post_type' => 'nealko', 'orderby' => 'post_id', 'order' => 'ASC'));
									while($nealko->have_posts()){
											$nealko->the_post();
											echo'<div class="menu-item">';
												echo'<div class="menu-item-name">';
													the_field('nazov');
												echo'</div>';
												echo'<div class="menu-item-price">';
													the_field('cena');
												echo'</div>';
												echo'<div class="menu-item-description">';
													the_field('popis');
												echo'</div>';
											echo'</div>';
									}
								 ?>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
			<!-- Portfolio Section -->
			<?php
			   $args = array(
			       'post_type' => 'galeria',
			       ‘order’ => ‘ASC’,
			   );
			   $loop = new WP_Query( $args );
			?>

			<div id="portfolio">
			  <div class="section-title text-center center">
			    <div class="overlay">
			      <div class="overlay-content">
			        <h2>Galéria</h2>
			        <hr>
			        <p><?php echo $galeria_popis; ?></p>
			      </div>

			    </div>
			  </div>
			  <div class="container">
			    <div class="row">
			      <div class="categories">
			        <ul class="cat">
			          <li>
			            <ol class="type">
										<li><a href="" data-filter="*" class="active">Všetko</a></li>
										<?php
											 $first = 0;
											 while ( $loop->have_posts() ) : $loop->the_post();
 										 		 echo'<li><a href="" data-filter=".tab'.$first.'">'.get_the_title().'</a></li>';
												 $first++;
											 endwhile;
										?>
			            </ol>
			          </li>
			        </ul>
			        <div class="clearfix"></div>
			      </div>
			    </div>
			    <div class="">
			      <div class="portfolio-items row">
							<?php
								 $tabs = 0;
								 while ( $loop->have_posts() ) : $loop->the_post();

							 		$images = get_field('galeria');
								 	for ($i=0; $i < sizeOf($images); $i++) {
										 // var_dump($images[$i]);
										 echo'<div class="col-12 col-sm-6 col-md-4 col-lg-4 tab'.$tabs.'">
													 <div class="portfolio-item">
														 <div class="hover-bg">
														 	<a href="'.$images[$i]['sizes']['large'].'" data-lightbox-gallery="gallery1">';
													echo'<div class="hover-text">';
														echo'<h4>'.$images[$i]['title'].'</h4>
															</div>';
													echo'<img src="'.$images[$i]['sizes']['medium'].'" alt="'.$images[$i]['title'].'" />';
													echo'</a>
														 </div>
													 </div>
												 </div>';
								 	}
									$tabs = $tabs +1;
								 endwhile;

								 wp_reset_postdata();
							?>

			        <!-- <div class="col-sm-6 col-md-4 col-lg-4 breakfast">
			          <div class="portfolio-item">
			            <div class="hover-bg">
										<a href="img/portfolio/01-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
				              <div class="hover-text">
				                <h4>Dish Name</h4>
				              </div>
				              <img src="img/portfolio/01-small.jpg" class="img-responsive" alt="Project Title">
										</a>
									</div>
			          </div>
			        </div> -->

			      </div>
			    </div>
			  </div>
			</div>
			<!-- Team Section -->
			<div id="team" class="text-center">
			  <div class="overlay">
			    <div class="container">
			      <div class="col-md-10 col-md-offset-1 section-title">
			        <div class="overlay-content">
			          <h2><?php echo $kolegovia_nadpis; ?></h2>
			          <hr>
			          <p><?php echo  $kolegovia_popis; ?></p>
			        </div>

			      </div>
			      <div id="row">
			        <div class="col-md-4 team">
			          <div class="thumbnail">
			            <div class="team-img"><img src="<?php echo $kolega1['url']; ?>" alt="<?php echo $kolega1_meno; ?>"></div>
			            <div class="caption">
			              <h3><?php echo $kolega1_meno; ?></h3>
			              <p><?php echo $kolega1_popis; ?></p>
			            </div>
			          </div>
			        </div>
			        <div class="col-md-4 team">
			          <div class="thumbnail">
			            <div class="team-img"><img src="<?php echo $kolega2['url']; ?>" alt="<?php echo $kolega2_meno; ?>"></div>
			            <div class="caption">
										<h3><?php echo $kolega2_meno; ?></h3>
			              <p><?php echo $kolega2_popis; ?></p>
			            </div>
			          </div>
			        </div>
			        <div class="col-md-4 team">
			          <div class="thumbnail">
									<div class="team-img"><img src="<?php echo $kolega3['url']; ?>" alt="<?php echo $kolega3_meno; ?>"></div>
			            <div class="caption">
										<h3><?php echo $kolega3_meno; ?></h3>
			              <p><?php echo $kolega3_popis; ?></p>
			            </div>
			          </div>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
			<!-- Call Reservation Section -->
			<div id="call-reservation" class="text-center">
			  <div class="container">
			    <h2><strong><?php echo $donaska_nadpis; ?></strong></h2>
			    <hr>
			    <h2><?php echo $donaska_popis ; ?></h2>
			  </div>
			</div>
			<!-- Contact Section -->
			<div id="contact" class="text-center">
			  <div class="container">
					<?php echo $donaska_text; ?>
			  </div>
			</div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
