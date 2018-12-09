<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Kebabsered
 */

get_header();
?>
	<div id="primary" class="content-area">
		<main id="main" class="site-main">
			<div id="about">
			  <div class="container">
			    <div class="row">
			      <div class="col-xs-12 col-md-6 animation-scroll">
			        <div class="about-img"><img src="dist/img/prevadzka.png" class="img-responsive" alt=""></div>
			      </div>
			      <div class="col-xs-12 col-md-6 animation-scroll">
			        <div class="about-text">
			          <h2>O našej reštaurácii</h2>
			          <hr>
			          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam. Sed commodo nibh ante facilisis bibendum dolor feugiat at. Duis sed dapibus leo nec ornare diam commodo nibh.</p>
			          <h3>Awarded Chefs</h3>
			          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam. Sed commodo nibh ante facilisis bibendum dolor feugiat at. Duis sed dapibus leo nec ornare.</p>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
			<!-- Restaurant Menu Section -->
			<div id="restaurant-menu">
			  <div class="section-title text-center center">
			    <div class="overlay">
			      <div class="overlay-content">
			        <h2>Menu</h2>
			        <hr>
			        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed.</p>
			      </div>
			    </div>
			  </div>
			  <div class="container">
			    <div class="row">
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Kebab</h2>
			          <hr  class="myhr">
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $35 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			        </div>
			      </div>
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Bagety</h2>
			          <hr class="myhr">
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $45 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			        </div>
			      </div>
			    </div>
			    <div class="row">
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Zapekačky</h2>
			          <hr class="myhr">
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $45 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $350 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam.. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			        </div>
			      </div>
			      <div class="col-xs-12 col-sm-6">
			        <div class="menu-section">
			          <h2 class="menu-section-title">Prílohy</h2>
			          <hr class="myhr">
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $35 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			        </div>
			        <div class="menu-section">
			          <h2 class="menu-section-title">Nealko</h2>
			          <hr class="myhr">
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $35 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			          <div class="menu-item">
			            <div class="menu-item-name"> Delicious Dish </div>
			            <div class="menu-item-price"> $30 </div>
			            <div class="menu-item-description"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, duis sed dapibus leo nec ornare diam. </div>
			          </div>
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
			<!-- Portfolio Section -->
			<?php
			/**
			* Setup query to show the ‘services’ post type with ‘8’ posts.
			* Output is title with excerpt.
			*/
			   $args = array(
			       'post_type' => 'galeria',
			       ‘order’ => ‘ASC’,
			   );

			   $loop = new WP_Query( $args );

			   while ( $loop->have_posts() ) : $loop->the_post();
				 	$images = get_field('galeria');
					$image= $images[0];
						echo'<img src="'.$image['sizes']['thumbnail'].'" alt="'.$image['alt'].'" />';
					var_dump($image);
					echo $image["sizes"]["thumbnail"];
			   endwhile;

			   wp_reset_postdata();
			?>
			<div id="portfolio">
			  <div class="section-title text-center center">
			    <div class="overlay">
			      <div class="overlay-content">
			        <h2>Galéria</h2>
			        <hr>
			        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed.</p>
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
			              <li><a href="" data-filter=".breakfast">Predajňa</a></li>
			              <li><a href="" data-filter=".lunch">Jedlá</a></li>
			              <li><a href="" data-filter=".dinner">Nápoje</a></li>
			            </ol>
			          </li>
			        </ul>
			        <div class="clearfix"></div>
			      </div>
			    </div>
			    <div class="">
			      <div class="portfolio-items row">
			        <div class="col-sm-6 col-md-4 col-lg-4 breakfast">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/01-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/01-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 dinner">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/02-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/02-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 breakfast">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/03-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/03-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 breakfast">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/04-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/04-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 dinner">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/05-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/05-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 lunch">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/06-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/06-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 lunch">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/07-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/07-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 breakfast">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/08-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/08-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 dinner">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/09-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/09-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 lunch">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/10-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/10-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 lunch">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/11-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/11-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
			        <div class="col-sm-6 col-md-4 col-lg-4 breakfast">
			          <div class="portfolio-item">
			            <div class="hover-bg"> <a href="img/portfolio/12-large.jpg" title="Dish Name" data-lightbox-gallery="gallery1">
			              <div class="hover-text">
			                <h4>Dish Name</h4>
			              </div>
			              <img src="img/portfolio/12-small.jpg" class="img-responsive" alt="Project Title"> </a> </div>
			          </div>
			        </div>
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
			          <h2>Meet Our Chefs</h2>
			          <hr>
			          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed dapibus leonec.</p>
			        </div>

			      </div>
			      <div id="row">
			        <div class="col-md-4 team">
			          <div class="thumbnail">
			            <div class="team-img"><img src="img/team/01.jpg" alt="..."></div>
			            <div class="caption">
			              <h3>Mike Doe</h3>
			              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam.</p>
			            </div>
			          </div>
			        </div>
			        <div class="col-md-4 team">
			          <div class="thumbnail">
			            <div class="team-img"><img src="img/team/02.jpg" alt="..."></div>
			            <div class="caption">
			              <h3>Chris Doe</h3>
			              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam.</p>
			            </div>
			          </div>
			        </div>
			        <div class="col-md-4 team">
			          <div class="thumbnail">
			            <div class="team-img"><img src="img/team/03.jpg" alt="..."></div>
			            <div class="caption">
			              <h3>Ethan Doe</h3>
			              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare diam.</p>
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
			    <h2><strong>Donášková služba</strong></h2>
			    <hr>
			    <h2>0915 365 159 / 0917 427 905</h2>
			  </div>
			</div>
			<!-- Contact Section -->
			<div id="contact" class="text-center">
			  <div class="container">
			    <p>
			      Na donášku do domu/firmy je minimálna hodnota tovaru 6,3 €. Platba je možná všetkými stravnými lístkami.
			    </p>
			    <hr>
			    <p>
			      Dovoz v Seredi je bez poplatku, v okrajových častiach (Dolná Streda, Stredný čepeň, Kapustniská, Šintava) je poplatok 1 €. Dovoz do Gáňu, Veľkej Mače, Váhoviec, a do Vinohradov je za poplatok 2 €.
			    </p>
			    <hr>
			    <p>
			      čas dovozu je cca 30 minät. V prípade väčších objednávok dlhšie, prosíme o pochopenie.
			    </p>

			  </div>
			</div>
		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
