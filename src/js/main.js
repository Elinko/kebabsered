
function main() {

(function () {
   'use strict';

  	$('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });


    // Show Menu on Book
    $(window).on('scroll', function() {
        var navHeight = $(window).height() - 600;
        if ($(window).scrollTop() > 20) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({
        target: '.navbar-default',
        offset: 80
    });

	// Hide nav on click
  $(".navbar-nav li a").click(function (event) {
    // check if window is small enough so dropdown is created
    var toggle = $(".navbar-toggle").is(":visible");
    if (toggle) {
      $(".navbar-collapse").collapse('hide');
    }
  });

  	// Portfolio isotope filter
    $(window).load(function() {
        var $container = $('.portfolio-items');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });

    });

    // Nivo Lightbox
    $('.portfolio-item a').nivoLightbox({
            effect: 'slideDown',
            keyboardNav: true,
     });


    setTimeout(function(){
      $('.intro-text img').css({
         transition: 'all .7s ease-in-out',
         transform:  'scale(1.1)'
       });
    }, 500);
    setTimeout(function(){
       $('.intro-text img').css({
          transition: 'all .7s ease-in-out',
          transform:  'scale(1)'
       });
    }, 1200);


    // fade effects
    $ (window) .scroll (function () {
      $('.animation-scroll, .menu-item, .menu-section-title, .myhr').each (function () {
        var elPosition = $ (this) .offset (). top; 	// Position of the element
        var elHeight = $ (this) .height (); 		// Height of the element
        var windowTop = $ (window) .scrollTop (); 	// Top of the window
        var windowHeight = $ (window) .height (); 	// Height of the window
        if (elPosition < windowTop + windowHeight - elHeight) {
          $(this).addClass ("animation fade-in-up");
        }
      });
      $('.thumbnail').each (function () {
        var elPosition = $ (this) .offset (). top; 	// Position of the element
        var elHeight = $ (this) .height (); 		// Height of the element
        var windowTop = $ (window) .scrollTop (); 	// Top of the window
        var windowHeight = $ (window) .height (); 	// Height of the window
        if (elPosition < windowTop + windowHeight - 200) {
          $(this).addClass ("animation fade-in-up");
        }
      });
      $('#call-reservation .container').each (function () {
        var elPosition = $ (this) .offset (). top; 	// Position of the element
        var elHeight = $ (this) .height (); 		// Height of the element
        var windowTop = $ (window) .scrollTop (); 	// Top of the window
        var windowHeight = $ (window) .height (); 	// Height of the window
        if (elPosition < windowTop + windowHeight - elHeight) {
          $(this).addClass ("animation slide-in-right");
        }
      });

      $(' .section-title h2, .section-title hr,  .section-title p').each (function () {
        var elPosition = $ (this) .offset (). top; 	// Position of the element
        var elHeight = $ (this) .height (); 		// Height of the element
        var windowTop = $ (window) .scrollTop (); 	// Top of the window
        var windowHeight = $ (window) .height (); 	// Height of the window
        if (elPosition < windowTop + windowHeight - elHeight) {
          $(this).addClass ("animation slide-in-left");
        }
      });

    });
}());


}
main();
