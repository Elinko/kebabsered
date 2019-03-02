<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package theme
 */
 $kontakt_popis = get_field('kontakt_popis',7);
 $kontakt_text = get_field('kontakt_text', 7);

?>

	</div><!-- #content -->

	<footer id="footer">
	  <div class="section-title text-center center">
	    <div class="overlay">
	      <div class="overlay-content">
	        <h2>Kontakt</h2>
	        <hr>
	        <p><?php echo $kontakt_popis; ?></p>
	      </div>

	    </div>
	  </div>
	  <div class="container text-center">
	    <div class="col-md-6">
	      <div class="adress">
	        <?php echo $kontakt_text; ?>
	      </div>
	    </div>
	    <div class="col-md-6">
	      <div class="map">
	        <h3>Nájdete nás na mape</h3>
	        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.8252670190536!2d17.739406882640505!3d48.286977364817815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b67bfe59c1a53%3A0x98615e6952b5d534!2sSlovensk%C3%A9ho+n%C3%A1rodn%C3%A9ho+povstania%2C+926+01+Sere%C4%8F%2C+Slovensk%C3%A1+republika!5e0!3m2!1ssk!2sus!4v1406070234226" width="100%" height="350px" frameborder="0" style="border:0"></iframe>
	      </div>
	    </div>
	  </div>
	</footer>
</div><!-- #page -->

<script type="text/javascript" src="<?php bloginfo('stylesheet_directory');?>/dist/js/main.js?1.13"></script>

</body>
</html>
