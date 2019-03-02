<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package theme
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="UTF-8">
<meta name="description" content="Kebab Sereď, v Mexico je najlepší kebab, bagety a zapekačky v Seredi.">
<meta name="keywords" content="Kebab Sereď, Mexico Sereď, Sereď bagety, Sereď zapekačky, donáška sereď, donáška kebabu">
<meta name="author" content="Patrik Eliáš">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta property="og:url" content="http://www.kebabsered.sk" />
<meta property="og:type" content="Web page" />
<meta property="og:title" content="Kebab Sereď - Mexico, kebab bagety zapekačky" />
<meta property="og:description" content="Kebab Sereď, v Mexico je najlepší kebab, bagety a zapekačky v Seredi." />
<meta property="og:image" content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />

<link rel="shortcut icon" href="<?php bloginfo('stylesheet_directory');?>/dist/img/favicon.png" type="image/x-icon">

<link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_directory');?>/dist/fontawesome//css/all.css">
<link rel="stylesheet" type="text/css"  href="<?php bloginfo('stylesheet_directory');?>/dist/css/style.css?v1.11">
<link rel="stylesheet" type="text/css"  href="<?php bloginfo('stylesheet_directory');?>/dist/css/motion.min.css">

<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Dancing+Script:400,700" rel="stylesheet">
	<?php wp_head(); ?>
</head>

<body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top">

<nav id="menu" class="navbar navbar-default navbar-fixed-top">
  <div class="container">

    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
      <a class="scrolllogo" href="<?php echo get_home_url(); ?>"><img src="<?php bloginfo('stylesheet_directory');?>/dist/img/logo2.png" class="logo" alt=""></a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav navbar-center fade-in-down">
        <li><a href="#about" class="page-scroll ">O nás</a></li>
        <li><a href="#restaurant-menu" class="page-scroll">Menu</a></li>
        <li><a href="#portfolio" class="page-scroll">Galéria</a></li>
        <li><a href="#team" class="page-scroll">Kolegovia</a></li>
        <li><a href="#call-reservation" class="page-scroll">Donáška</a></li>
        <li><a href="#footer" class="page-scroll">Kontakt</a></li>
      </ul>
    </div>
  </div>
</nav>
<header id="header">
  <div class="intro">
    <div class="overlay">
      <div class="container">
        <div class="row">
          <div class="intro-text">
            <img src="<?php bloginfo('stylesheet_directory');?>/dist/img/logo.png" class="delay-03s animation scale-in" alt="">
            <h1>Kebab Sereď - Mexico</h1>
            <p class="delay-1s animation fade-in-up">Kebab / Bagety / Zapekačky</p>
        </div>
      </div>
    </div>
  </div>
</header>

	<div id="content" class="site-content">
