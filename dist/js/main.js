"use strict";

// SmoothScroll for websites v1.2.1
// Licensed under the terms of the MIT license.

// People involved
//  - Balazs Galambosi (maintainer)  
//  - Michael Herf     (Pulse Algorithm)

(function () {

    // Scroll Variables (tweakable)
    var defaultOptions = {

        // Scrolling Core
        frameRate: 150, // [Hz]
        animationTime: 400, // [px]
        stepSize: 120, // [px]

        // Pulse (less tweakable)
        // ratio of "tail" to "acceleration"
        pulseAlgorithm: true,
        pulseScale: 8,
        pulseNormalize: 1,

        // Acceleration
        accelerationDelta: 20, // 20
        accelerationMax: 1, // 1

        // Keyboard Settings
        keyboardSupport: true, // option
        arrowScroll: 50, // [px]

        // Other
        touchpadSupport: true,
        fixedBackground: true,
        excluded: ""
    };

    var options = defaultOptions;

    // Other Variables
    var isExcluded = false;
    var isFrame = false;
    var direction = { x: 0, y: 0 };
    var initDone = false;
    var root = document.documentElement;
    var activeElement;
    var observer;
    var deltaBuffer = [120, 120, 120];

    var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32,
        pageup: 33, pagedown: 34, end: 35, home: 36 };

    /***********************************************
     * SETTINGS
     ***********************************************/

    var options = defaultOptions;

    /***********************************************
     * INITIALIZE
     ***********************************************/

    /**
     * Tests if smooth scrolling is allowed. Shuts down everything if not.
     */
    function initTest() {

        var disableKeyboard = false;

        // disable keyboard support if anything above requested it
        if (disableKeyboard) {
            removeEvent("keydown", keydown);
        }

        if (options.keyboardSupport && !disableKeyboard) {
            addEvent("keydown", keydown);
        }
    }

    /**
     * Sets up scrolls array, determines if frames are involved.
     */
    function init() {

        if (!document.body) return;

        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;

        // check compat mode for root element
        root = document.compatMode.indexOf('CSS') >= 0 ? html : body;
        activeElement = body;

        initTest();
        initDone = true;

        // Checks if this script is running in a frame
        if (top != self) {
            isFrame = true;
        }

        /**
         * This fixes a bug where the areas left and right to 
         * the content does not trigger the onmousewheel event
         * on some pages. e.g.: html, body { height: 100% }
         */
        else if (scrollHeight > windowHeight && (body.offsetHeight <= windowHeight || html.offsetHeight <= windowHeight)) {

                html.style.height = 'auto';
                setTimeout(refresh, 10);

                // clearfix
                if (root.offsetHeight <= windowHeight) {
                    var underlay = document.createElement("div");
                    underlay.style.clear = "both";
                    body.appendChild(underlay);
                }
            }

        // disable fixed background
        if (!options.fixedBackground && !isExcluded) {
            body.style.backgroundAttachment = "scroll";
            html.style.backgroundAttachment = "scroll";
        }
    }

    /************************************************
     * SCROLLING 
     ************************************************/

    var que = [];
    var pending = false;
    var lastScroll = +new Date();

    /**
     * Pushes scroll actions to the scrolling queue.
     */
    function scrollArray(elem, left, top, delay) {

        delay || (delay = 1000);
        directionCheck(left, top);

        if (options.accelerationMax != 1) {
            var now = +new Date();
            var elapsed = now - lastScroll;
            if (elapsed < options.accelerationDelta) {
                var factor = (1 + 30 / elapsed) / 2;
                if (factor > 1) {
                    factor = Math.min(factor, options.accelerationMax);
                    left *= factor;
                    top *= factor;
                }
            }
            lastScroll = +new Date();
        }

        // push a scroll command
        que.push({
            x: left,
            y: top,
            lastX: left < 0 ? 0.99 : -0.99,
            lastY: top < 0 ? 0.99 : -0.99,
            start: +new Date()
        });

        // don't act if there's a pending queue
        if (pending) {
            return;
        }

        var scrollWindow = elem === document.body;

        var step = function step(time) {

            var now = +new Date();
            var scrollX = 0;
            var scrollY = 0;

            for (var i = 0; i < que.length; i++) {

                var item = que[i];
                var elapsed = now - item.start;
                var finished = elapsed >= options.animationTime;

                // scroll position: [0, 1]
                var position = finished ? 1 : elapsed / options.animationTime;

                // easing [optional]
                if (options.pulseAlgorithm) {
                    position = pulse(position);
                }

                // only need the difference
                var x = item.x * position - item.lastX >> 0;
                var y = item.y * position - item.lastY >> 0;

                // add this to the total scrolling
                scrollX += x;
                scrollY += y;

                // update last values
                item.lastX += x;
                item.lastY += y;

                // delete and step back if it's over
                if (finished) {
                    que.splice(i, 1);i--;
                }
            }

            // scroll left and top
            if (scrollWindow) {
                window.scrollBy(scrollX, scrollY);
            } else {
                if (scrollX) elem.scrollLeft += scrollX;
                if (scrollY) elem.scrollTop += scrollY;
            }

            // clean up if there's nothing left to do
            if (!left && !top) {
                que = [];
            }

            if (que.length) {
                requestFrame(step, elem, delay / options.frameRate + 1);
            } else {
                pending = false;
            }
        };

        // start a new queue of actions
        requestFrame(step, elem, 0);
        pending = true;
    }

    /***********************************************
     * EVENTS
     ***********************************************/

    /**
     * Mouse wheel handler.
     * @param {Object} event
     */
    function wheel(event) {

        if (!initDone) {
            init();
        }

        var target = event.target;
        var overflowing = overflowingAncestor(target);

        // use default if there's no overflowing
        // element or default action is prevented    
        if (!overflowing || event.defaultPrevented || isNodeName(activeElement, "embed") || isNodeName(target, "embed") && /\.pdf/i.test(target.src)) {
            return true;
        }

        var deltaX = event.wheelDeltaX || 0;
        var deltaY = event.wheelDeltaY || 0;

        // use wheelDelta if deltaX/Y is not available
        if (!deltaX && !deltaY) {
            deltaY = event.wheelDelta || 0;
        }

        // check if it's a touchpad scroll that should be ignored
        if (!options.touchpadSupport && isTouchpad(deltaY)) {
            return true;
        }

        // scale by step size
        // delta is 120 most of the time
        // synaptics seems to send 1 sometimes
        if (Math.abs(deltaX) > 1.2) {
            deltaX *= options.stepSize / 120;
        }
        if (Math.abs(deltaY) > 1.2) {
            deltaY *= options.stepSize / 120;
        }

        scrollArray(overflowing, -deltaX, -deltaY);
        event.preventDefault();
    }

    /**
     * Keydown event handler.
     * @param {Object} event
     */
    function keydown(event) {

        var target = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey && event.keyCode !== key.spacebar;

        // do nothing if user is editing text
        // or using a modifier key (except shift)
        // or in a dropdown
        if (/input|textarea|select|embed/i.test(target.nodeName) || target.isContentEditable || event.defaultPrevented || modifier) {
            return true;
        }
        // spacebar should trigger button press
        if (isNodeName(target, "button") && event.keyCode === key.spacebar) {
            return true;
        }

        var shift,
            x = 0,
            y = 0;
        var elem = overflowingAncestor(activeElement);
        var clientHeight = elem.clientHeight;

        if (elem == document.body) {
            clientHeight = window.innerHeight;
        }

        switch (event.keyCode) {
            case key.up:
                y = -options.arrowScroll;
                break;
            case key.down:
                y = options.arrowScroll;
                break;
            case key.spacebar:
                // (+ shift)
                shift = event.shiftKey ? 1 : -1;
                y = -shift * clientHeight * 0.9;
                break;
            case key.pageup:
                y = -clientHeight * 0.9;
                break;
            case key.pagedown:
                y = clientHeight * 0.9;
                break;
            case key.home:
                y = -elem.scrollTop;
                break;
            case key.end:
                var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
                y = damt > 0 ? damt + 10 : 0;
                break;
            case key.left:
                x = -options.arrowScroll;
                break;
            case key.right:
                x = options.arrowScroll;
                break;
            default:
                return true; // a key we don't care about
        }

        scrollArray(elem, x, y);
        event.preventDefault();
    }

    /**
     * Mousedown event only for updating activeElement
     */
    function mousedown(event) {
        activeElement = event.target;
    }

    /***********************************************
     * OVERFLOW
     ***********************************************/

    var cache = {}; // cleared out every once in while
    setInterval(function () {
        cache = {};
    }, 10 * 1000);

    var uniqueID = function () {
        var i = 0;
        return function (el) {
            return el.uniqueID || (el.uniqueID = i++);
        };
    }();

    function setCache(elems, overflowing) {
        for (var i = elems.length; i--;) {
            cache[uniqueID(elems[i])] = overflowing;
        }return overflowing;
    }

    function overflowingAncestor(el) {
        var elems = [];
        var rootScrollHeight = root.scrollHeight;
        do {
            var cached = cache[uniqueID(el)];
            if (cached) {
                return setCache(elems, cached);
            }
            elems.push(el);
            if (rootScrollHeight === el.scrollHeight) {
                if (!isFrame || root.clientHeight + 10 < rootScrollHeight) {
                    return setCache(elems, document.body); // scrolling root in WebKit
                }
            } else if (el.clientHeight + 10 < el.scrollHeight) {
                overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
                if (overflow === "scroll" || overflow === "auto") {
                    return setCache(elems, el);
                }
            }
        } while (el = el.parentNode);
    }

    /***********************************************
     * HELPERS
     ***********************************************/

    function addEvent(type, fn, bubble) {
        window.addEventListener(type, fn, bubble || false);
    }

    function removeEvent(type, fn, bubble) {
        window.removeEventListener(type, fn, bubble || false);
    }

    function isNodeName(el, tag) {
        return (el.nodeName || "").toLowerCase() === tag.toLowerCase();
    }

    function directionCheck(x, y) {
        x = x > 0 ? 1 : -1;
        y = y > 0 ? 1 : -1;
        if (direction.x !== x || direction.y !== y) {
            direction.x = x;
            direction.y = y;
            que = [];
            lastScroll = 0;
        }
    }

    var deltaBufferTimer;

    function isTouchpad(deltaY) {
        if (!deltaY) return;
        deltaY = Math.abs(deltaY);
        deltaBuffer.push(deltaY);
        deltaBuffer.shift();
        clearTimeout(deltaBufferTimer);

        var allEquals = deltaBuffer[0] == deltaBuffer[1] && deltaBuffer[1] == deltaBuffer[2];
        var allDivisable = isDivisible(deltaBuffer[0], 120) && isDivisible(deltaBuffer[1], 120) && isDivisible(deltaBuffer[2], 120);
        return !(allEquals || allDivisable);
    }

    function isDivisible(n, divisor) {
        return Math.floor(n / divisor) == n / divisor;
    }

    var requestFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback, element, delay) {
            window.setTimeout(callback, delay || 1000 / 60);
        };
    }();

    /***********************************************
     * PULSE
     ***********************************************/

    /**
     * Viscous fluid with a pulse for part and decay for the rest.
     * - Applies a fixed force over an interval (a damped acceleration), and
     * - Lets the exponential bleed away the velocity over a longer interval
     * - Michael Herf, http://stereopsis.com/stopping/
     */
    function pulse_(x) {
        var val, start, expx;
        // test
        x = x * options.pulseScale;
        if (x < 1) {
            // acceleartion
            val = x - (1 - Math.exp(-x));
        } else {
            // tail
            // the previous animation ended here:
            start = Math.exp(-1);
            // simple viscous drag
            x -= 1;
            expx = 1 - Math.exp(-x);
            val = start + expx * (1 - start);
        }
        return val * options.pulseNormalize;
    }

    function pulse(x) {
        if (x >= 1) return 1;
        if (x <= 0) return 0;

        if (options.pulseNormalize == 1) {
            options.pulseNormalize /= pulse_(1);
        }
        return pulse_(x);
    }

    var isChrome = /chrome/i.test(window.navigator.userAgent);
    var isMouseWheelSupported = 'onmousewheel' in document;

    if (isMouseWheelSupported && isChrome) {
        addEvent("mousedown", mousedown);
        addEvent("mousewheel", wheel);
        addEvent("load", init);
    };
})();
/*
 * Nivo Lightbox v1.2.0
 * http://dev7studios.com/nivo-lightbox
 *
 * Copyright 2013, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function ($, window, document, undefined) {

    var pluginName = 'nivoLightbox',
        defaults = {
        effect: 'fade',
        theme: 'default',
        keyboardNav: true,
        clickOverlayToClose: true,
        onInit: function onInit() {},
        beforeShowLightbox: function beforeShowLightbox() {},
        afterShowLightbox: function afterShowLightbox(lightbox) {},
        beforeHideLightbox: function beforeHideLightbox() {},
        afterHideLightbox: function afterHideLightbox() {},
        onPrev: function onPrev(element) {},
        onNext: function onNext(element) {},
        errorMessage: 'The requested content cannot be loaded. Please try again later.'
    };

    function NivoLightbox(element, options) {
        this.el = element;
        this.$el = $(this.el);

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    NivoLightbox.prototype = {

        init: function init() {
            var $this = this;

            // Need this so we don't use CSS transitions in mobile
            if (!$('html').hasClass('nivo-lightbox-notouch')) $('html').addClass('nivo-lightbox-notouch');
            if ('ontouchstart' in document) $('html').removeClass('nivo-lightbox-notouch');

            // Setup the click
            this.$el.on('click', function (e) {
                $this.showLightbox(e);
            });

            // keyboardNav
            if (this.options.keyboardNav) {
                $('body').off('keyup').on('keyup', function (e) {
                    var code = e.keyCode ? e.keyCode : e.which;
                    // Escape
                    if (code == 27) $this.destructLightbox();
                    // Left
                    if (code == 37) $('.nivo-lightbox-prev').trigger('click');
                    // Right
                    if (code == 39) $('.nivo-lightbox-next').trigger('click');
                });
            }

            this.options.onInit.call(this);
        },

        showLightbox: function showLightbox(e) {
            var $this = this,
                currentLink = this.$el;

            // Check content
            var check = this.checkContent(currentLink);
            if (!check) return;

            e.preventDefault();
            this.options.beforeShowLightbox.call(this);
            var lightbox = this.constructLightbox();
            if (!lightbox) return;
            var content = lightbox.find('.nivo-lightbox-content');
            if (!content) return;

            $('body').addClass('nivo-lightbox-body-effect-' + this.options.effect);

            this.processContent(content, currentLink);

            // Nav
            if (this.$el.attr('data-lightbox-gallery')) {
                var galleryItems = $('[data-lightbox-gallery="' + this.$el.attr('data-lightbox-gallery') + '"]');

                $('.nivo-lightbox-nav').show();

                // Prev
                $('.nivo-lightbox-prev').off('click').on('click', function (e) {
                    e.preventDefault();
                    var index = galleryItems.index(currentLink);
                    currentLink = galleryItems.eq(index - 1);
                    if (!$(currentLink).length) currentLink = galleryItems.last();
                    $this.processContent(content, currentLink);
                    $this.options.onPrev.call(this, [currentLink]);
                });

                // Next
                $('.nivo-lightbox-next').off('click').on('click', function (e) {
                    e.preventDefault();
                    var index = galleryItems.index(currentLink);
                    currentLink = galleryItems.eq(index + 1);
                    if (!$(currentLink).length) currentLink = galleryItems.first();
                    $this.processContent(content, currentLink);
                    $this.options.onNext.call(this, [currentLink]);
                });
            }

            setTimeout(function () {
                lightbox.addClass('nivo-lightbox-open');
                $this.options.afterShowLightbox.call(this, [lightbox]);
            }, 1); // For CSS transitions
        },

        checkContent: function checkContent(link) {
            var $this = this,
                href = link.attr('href'),
                video = href.match(/(youtube|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/);

            if (href.match(/\.(jpeg|jpg|gif|png)$/i) !== null) {
                return true;
            }
            // Video (Youtube/Vimeo)
            else if (video) {
                    return true;
                }
                // AJAX
                else if (link.attr('data-lightbox-type') == 'ajax') {
                        return true;
                    }
                    // Inline HTML
                    else if (href.substring(0, 1) == '#' && link.attr('data-lightbox-type') == 'inline') {
                            return true;
                        }
                        // iFrame (default)
                        else if (link.attr('data-lightbox-type') == 'iframe') {
                                return true;
                            }

            return false;
        },

        processContent: function processContent(content, link) {
            var $this = this,
                href = link.attr('href'),
                video = href.match(/(youtube|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/);

            content.html('').addClass('nivo-lightbox-loading');

            // Is HiDPI?
            if (this.isHidpi() && link.attr('data-lightbox-hidpi')) {
                href = link.attr('data-lightbox-hidpi');
            }

            // Image
            if (href.match(/\.(jpeg|jpg|gif|png)$/i) !== null) {
                var img = $('<img>', { src: href });
                img.one('load', function () {
                    var wrap = $('<div class="nivo-lightbox-image" />');
                    wrap.append(img);
                    content.html(wrap).removeClass('nivo-lightbox-loading');

                    // Vertically center images
                    wrap.css({
                        'line-height': $('.nivo-lightbox-content').height() + 'px',
                        'height': $('.nivo-lightbox-content').height() + 'px' // For Firefox
                    });
                    $(window).resize(function () {
                        wrap.css({
                            'line-height': $('.nivo-lightbox-content').height() + 'px',
                            'height': $('.nivo-lightbox-content').height() + 'px' // For Firefox
                        });
                    });
                }).each(function () {
                    if (this.complete) $(this).load();
                });

                img.error(function () {
                    var wrap = $('<div class="nivo-lightbox-error"><p>' + $this.options.errorMessage + '</p></div>');
                    content.html(wrap).removeClass('nivo-lightbox-loading');
                });
            }
            // Video (Youtube/Vimeo)
            else if (video) {
                    var src = '',
                        classTerm = 'nivo-lightbox-video';

                    if (video[1] == 'youtube') {
                        src = 'http://www.youtube.com/embed/' + video[4];
                        classTerm = 'nivo-lightbox-youtube';
                    }
                    if (video[1] == 'youtu') {
                        src = 'http://www.youtube.com/embed/' + video[3];
                        classTerm = 'nivo-lightbox-youtube';
                    }
                    if (video[1] == 'vimeo') {
                        src = 'http://player.vimeo.com/video/' + video[3];
                        classTerm = 'nivo-lightbox-vimeo';
                    }

                    if (src) {
                        var iframeVideo = $('<iframe>', {
                            src: src,
                            'class': classTerm,
                            frameborder: 0,
                            vspace: 0,
                            hspace: 0,
                            scrolling: 'auto'
                        });
                        content.html(iframeVideo);
                        iframeVideo.load(function () {
                            content.removeClass('nivo-lightbox-loading');
                        });
                    }
                }
                // AJAX
                else if (link.attr('data-lightbox-type') == 'ajax') {
                        $.ajax({
                            url: href,
                            cache: false,
                            success: function success(data) {
                                var wrap = $('<div class="nivo-lightbox-ajax" />');
                                wrap.append(data);
                                content.html(wrap).removeClass('nivo-lightbox-loading');

                                // Vertically center html
                                if (wrap.outerHeight() < content.height()) {
                                    wrap.css({
                                        'position': 'relative',
                                        'top': '50%',
                                        'margin-top': -(wrap.outerHeight() / 2) + 'px'
                                    });
                                }
                                $(window).resize(function () {
                                    if (wrap.outerHeight() < content.height()) {
                                        wrap.css({
                                            'position': 'relative',
                                            'top': '50%',
                                            'margin-top': -(wrap.outerHeight() / 2) + 'px'
                                        });
                                    }
                                });
                            },
                            error: function error() {
                                var wrap = $('<div class="nivo-lightbox-error"><p>' + $this.options.errorMessage + '</p></div>');
                                content.html(wrap).removeClass('nivo-lightbox-loading');
                            }
                        });
                    }
                    // Inline HTML
                    else if (href.substring(0, 1) == '#' && link.attr('data-lightbox-type') == 'inline') {
                            if ($(href).length) {
                                var wrap = $('<div class="nivo-lightbox-inline" />');
                                wrap.append($(href).clone().show());
                                content.html(wrap).removeClass('nivo-lightbox-loading');

                                // Vertically center html
                                if (wrap.outerHeight() < content.height()) {
                                    wrap.css({
                                        'position': 'relative',
                                        'top': '50%',
                                        'margin-top': -(wrap.outerHeight() / 2) + 'px'
                                    });
                                }
                                $(window).resize(function () {
                                    if (wrap.outerHeight() < content.height()) {
                                        wrap.css({
                                            'position': 'relative',
                                            'top': '50%',
                                            'margin-top': -(wrap.outerHeight() / 2) + 'px'
                                        });
                                    }
                                });
                            } else {
                                var wrapError = $('<div class="nivo-lightbox-error"><p>' + $this.options.errorMessage + '</p></div>');
                                content.html(wrapError).removeClass('nivo-lightbox-loading');
                            }
                        }
                        // iFrame (default)
                        else if (link.attr('data-lightbox-type') == 'iframe') {
                                var iframe = $('<iframe>', {
                                    src: href,
                                    'class': 'nivo-lightbox-item',
                                    frameborder: 0,
                                    vspace: 0,
                                    hspace: 0,
                                    scrolling: 'auto'
                                });
                                content.html(iframe);
                                iframe.load(function () {
                                    content.removeClass('nivo-lightbox-loading');
                                });
                            } else {
                                return false;
                            }

            // Set the title
            if (link.attr('title')) {
                var titleWrap = $('<span>', { 'class': 'nivo-lightbox-title' });
                titleWrap.text(link.attr('title'));
                $('.nivo-lightbox-title-wrap').html(titleWrap);
            } else {
                $('.nivo-lightbox-title-wrap').html('');
            }
        },

        constructLightbox: function constructLightbox() {
            if ($('.nivo-lightbox-overlay').length) return $('.nivo-lightbox-overlay');

            var overlay = $('<div>', { 'class': 'nivo-lightbox-overlay nivo-lightbox-theme-' + this.options.theme + ' nivo-lightbox-effect-' + this.options.effect });
            var wrap = $('<div>', { 'class': 'nivo-lightbox-wrap' });
            var content = $('<div>', { 'class': 'nivo-lightbox-content' });
            var nav = $('<a href="#" class="nivo-lightbox-nav nivo-lightbox-prev">Previous</a><a href="#" class="nivo-lightbox-nav nivo-lightbox-next">Next</a>');
            var close = $('<a href="#" class="nivo-lightbox-close" title="Close">Close</a>');
            var title = $('<div>', { 'class': 'nivo-lightbox-title-wrap' });

            var isMSIE = /*@cc_on!@*/0;
            if (isMSIE) overlay.addClass('nivo-lightbox-ie');

            wrap.append(content);
            wrap.append(title);
            overlay.append(wrap);
            overlay.append(nav);
            overlay.append(close);
            $('body').append(overlay);

            var $this = this;
            if ($this.options.clickOverlayToClose) {
                overlay.on('click', function (e) {
                    if (e.target === this || $(e.target).hasClass('nivo-lightbox-content') || $(e.target).hasClass('nivo-lightbox-image')) {
                        $this.destructLightbox();
                    }
                });
            }

            close.on('click', function (e) {
                e.preventDefault();
                $this.destructLightbox();
            });

            return overlay;
        },

        destructLightbox: function destructLightbox() {
            var $this = this;
            this.options.beforeHideLightbox.call(this);

            $('.nivo-lightbox-overlay').removeClass('nivo-lightbox-open');
            $('.nivo-lightbox-nav').hide();
            $('body').removeClass('nivo-lightbox-body-effect-' + $this.options.effect);

            // For IE
            var isMSIE = /*@cc_on!@*/0;
            if (isMSIE) {
                $('.nivo-lightbox-overlay iframe').attr("src", " ");
                $('.nivo-lightbox-overlay iframe').remove();
            }

            // Remove click handlers
            $('.nivo-lightbox-prev').off('click');
            $('.nivo-lightbox-next').off('click');

            // Empty content (for videos)
            $('.nivo-lightbox-content').empty();

            this.options.afterHideLightbox.call(this);
        },

        isHidpi: function isHidpi() {
            var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                              (min--moz-device-pixel-ratio: 1.5),\
                              (-o-min-device-pixel-ratio: 3/2),\
                              (min-resolution: 1.5dppx)";
            if (window.devicePixelRatio > 1) return true;
            if (window.matchMedia && window.matchMedia(mediaQuery).matches) return true;
            return false;
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new NivoLightbox(this, options));
            }
        });
    };
})(jQuery, window, document);

/**
 * Isotope v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function (window, $, undefined) {

    'use strict';

    // get global vars

    var document = window.document;
    var Modernizr = window.Modernizr;

    // helper function
    var capitalize = function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // ========================= getStyleProperty by kangax ===============================
    // http://perfectionkills.com/feature-testing-css-properties/

    var prefixes = 'Moz Webkit O Ms'.split(' ');

    var getStyleProperty = function getStyleProperty(propName) {
        var style = document.documentElement.style,
            prefixed;

        // test standard property first
        if (typeof style[propName] === 'string') {
            return propName;
        }

        // capitalize
        propName = capitalize(propName);

        // test vendor specific properties
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof style[prefixed] === 'string') {
                return prefixed;
            }
        }
    };

    var transformProp = getStyleProperty('transform'),
        transitionProp = getStyleProperty('transitionProperty');

    // ========================= miniModernizr ===============================
    // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

    /*!
     * Modernizr v1.6ish: miniModernizr for Isotope
     * http://www.modernizr.com
     *
     * Developed by:
     * - Faruk Ates  http://farukat.es/
     * - Paul Irish  http://paulirish.com/
     *
     * Copyright (c) 2009-2010
     * Dual-licensed under the BSD or MIT licenses.
     * http://www.modernizr.com/license/
     */

    /*
     * This version whittles down the script just to check support for
     * CSS transitions, transforms, and 3D transforms.
    */

    var tests = {
        csstransforms: function csstransforms() {
            return !!transformProp;
        },

        csstransforms3d: function csstransforms3d() {
            var test = !!getStyleProperty('perspective');
            // double check for Chrome's false positive
            if (test) {
                var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
                    mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
                    $style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}' + '</style>').appendTo('head'),
                    $div = $('<div id="modernizr" />').appendTo('html');

                test = $div.height() === 3;

                $div.remove();
                $style.remove();
            }
            return test;
        },

        csstransitions: function csstransitions() {
            return !!transitionProp;
        }
    };

    var testName;

    if (Modernizr) {
        // if there's a previous Modernzir, check if there are necessary tests
        for (testName in tests) {
            if (!Modernizr.hasOwnProperty(testName)) {
                // if test hasn't been run, use addTest to run it
                Modernizr.addTest(testName, tests[testName]);
            }
        }
    } else {
        // or create new mini Modernizr that just has the 3 tests
        Modernizr = window.Modernizr = {
            _version: '1.6ish: miniModernizr for Isotope'
        };

        var classes = ' ';
        var result;

        // Run through tests
        for (testName in tests) {
            result = tests[testName]();
            Modernizr[testName] = result;
            classes += ' ' + (result ? '' : 'no-') + testName;
        }

        // Add the new classes to the <html> element.
        $('html').addClass(classes);
    }

    // ========================= isoTransform ===============================

    /**
     *  provides hooks for .css({ scale: value, translate: [x, y] })
     *  Progressively enhanced CSS transforms
     *  Uses hardware accelerated 3D transforms for Safari
     *  or falls back to 2D transforms.
     */

    if (Modernizr.csstransforms) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
        var transformFnNotations = Modernizr.csstransforms3d ? { // 3D transform functions
            translate: function translate(position) {
                return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
            },
            scale: function scale(_scale) {
                return 'scale3d(' + _scale + ', ' + _scale + ', 1) ';
            }
        } : { // 2D transform functions
            translate: function translate(position) {
                return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
            },
            scale: function scale(_scale2) {
                return 'scale(' + _scale2 + ') ';
            }
        };

        var setIsoTransform = function setIsoTransform(elem, name, value) {
            // unpack current transform data
            var data = $.data(elem, 'isoTransform') || {},
                newData = {},
                fnName,
                transformObj = {},
                transformValue;

            // i.e. newData.scale = 0.5
            newData[name] = value;
            // extend new value over current data
            $.extend(data, newData);

            for (fnName in data) {
                transformValue = data[fnName];
                transformObj[fnName] = transformFnNotations[fnName](transformValue);
            }

            // get proper order
            // ideally, we could loop through this give an array, but since we only have
            // a couple transforms we're keeping track of, we'll do it like so
            var translateFn = transformObj.translate || '',
                scaleFn = transformObj.scale || '',

            // sorting so translate always comes first
            valueFns = translateFn + scaleFn;

            // set data back in elem
            $.data(elem, 'isoTransform', data);

            // set name to vendor specific property
            elem.style[transformProp] = valueFns;
        };

        // ==================== scale ===================

        $.cssNumber.scale = true;

        $.cssHooks.scale = {
            set: function set(elem, value) {
                // uncomment this bit if you want to properly parse strings
                // if ( typeof value === 'string' ) {
                //   value = parseFloat( value );
                // }
                setIsoTransform(elem, 'scale', value);
            },
            get: function get(elem, computed) {
                var transform = $.data(elem, 'isoTransform');
                return transform && transform.scale ? transform.scale : 1;
            }
        };

        $.fx.step.scale = function (fx) {
            $.cssHooks.scale.set(fx.elem, fx.now + fx.unit);
        };

        // ==================== translate ===================

        $.cssNumber.translate = true;

        $.cssHooks.translate = {
            set: function set(elem, value) {

                // uncomment this bit if you want to properly parse strings
                // if ( typeof value === 'string' ) {
                //   value = value.split(' ');
                // }
                //
                // var i, val;
                // for ( i = 0; i < 2; i++ ) {
                //   val = value[i];
                //   if ( typeof val === 'string' ) {
                //     val = parseInt( val );
                //   }
                // }

                setIsoTransform(elem, 'translate', value);
            },

            get: function get(elem, computed) {
                var transform = $.data(elem, 'isoTransform');
                return transform && transform.translate ? transform.translate : [0, 0];
            }
        };
    }

    // ========================= get transition-end event ===============================
    var transitionEndEvent, transitionDurProp;

    if (Modernizr.csstransitions) {
        transitionEndEvent = {
            WebkitTransitionProperty: 'webkitTransitionEnd', // webkit
            MozTransitionProperty: 'transitionend',
            OTransitionProperty: 'oTransitionEnd otransitionend',
            transitionProperty: 'transitionend'
        }[transitionProp];

        transitionDurProp = getStyleProperty('transitionDuration');
    }

    // ========================= smartresize ===============================

    /*
     * smartresize: debounced resize event for jQuery
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery.smartresize.js
     *
     * Copyright 2011 @louis_remi
     * Licensed under the MIT license.
     */

    var $event = $.event,
        dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
        resizeTimeout;

    $event.special.smartresize = {
        setup: function setup() {
            $(this).bind("resize", $event.special.smartresize.handler);
        },
        teardown: function teardown() {
            $(this).unbind("resize", $event.special.smartresize.handler);
        },
        handler: function handler(event, execAsap) {
            // Save the context
            var context = this,
                args = arguments;

            // set correct event type
            event.type = "smartresize";

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function () {
                $event[dispatchMethod].apply(context, args);
            }, execAsap === "execAsap" ? 0 : 100);
        }
    };

    $.fn.smartresize = function (fn) {
        return fn ? this.bind("smartresize", fn) : this.trigger("smartresize", ["execAsap"]);
    };

    // ========================= Isotope ===============================


    // our "Widget" object constructor
    $.Isotope = function (options, element, callback) {
        this.element = $(element);

        this._create(options);
        this._init(callback);
    };

    // styles of container element we want to keep track of
    var isoContainerStyles = ['width', 'height'];

    var $window = $(window);

    $.Isotope.settings = {
        resizable: true,
        layoutMode: 'masonry',
        containerClass: 'isotope',
        itemClass: 'isotope-item',
        hiddenClass: 'isotope-hidden',
        hiddenStyle: { opacity: 0, scale: 0.001 },
        visibleStyle: { opacity: 1, scale: 1 },
        containerStyle: {
            position: 'relative',
            overflow: 'hidden'
        },
        animationEngine: 'best-available',
        animationOptions: {
            queue: false,
            duration: 800
        },
        sortBy: 'original-order',
        sortAscending: true,
        resizesContainer: true,
        transformsEnabled: true,
        itemPositionDataEnabled: false
    };

    $.Isotope.prototype = {

        // sets up widget
        _create: function _create(options) {

            this.options = $.extend({}, $.Isotope.settings, options);

            this.styleQueue = [];
            this.elemCount = 0;

            // get original styles in case we re-apply them in .destroy()
            var elemStyle = this.element[0].style;
            this.originalStyle = {};
            // keep track of container styles
            var containerStyles = isoContainerStyles.slice(0);
            for (var prop in this.options.containerStyle) {
                containerStyles.push(prop);
            }
            for (var i = 0, len = containerStyles.length; i < len; i++) {
                prop = containerStyles[i];
                this.originalStyle[prop] = elemStyle[prop] || '';
            }
            // apply container style from options
            this.element.css(this.options.containerStyle);

            this._updateAnimationEngine();
            this._updateUsingTransforms();

            // sorting
            var originalOrderSorter = {
                'original-order': function originalOrder($elem, instance) {
                    instance.elemCount++;
                    return instance.elemCount;
                },
                random: function random() {
                    return Math.random();
                }
            };

            this.options.getSortData = $.extend(this.options.getSortData, originalOrderSorter);

            // need to get atoms
            this.reloadItems();

            // get top left position of where the bricks should be
            this.offset = {
                left: parseInt(this.element.css('padding-left') || 0, 10),
                top: parseInt(this.element.css('padding-top') || 0, 10)
            };

            // add isotope class first time around
            var instance = this;
            setTimeout(function () {
                instance.element.addClass(instance.options.containerClass);
            }, 0);

            // bind resize method
            if (this.options.resizable) {
                $window.bind('smartresize.isotope', function () {
                    instance.resize();
                });
            }

            // dismiss all click events from hidden events
            this.element.delegate('.' + this.options.hiddenClass, 'click', function () {
                return false;
            });
        },

        _getAtoms: function _getAtoms($elems) {
            var selector = this.options.itemSelector,

            // filter & find
            $atoms = selector ? $elems.filter(selector).add($elems.find(selector)) : $elems,

            // base style for atoms
            atomStyle = { position: 'absolute' };

            // filter out text nodes
            $atoms = $atoms.filter(function (i, atom) {
                return atom.nodeType === 1;
            });

            if (this.usingTransforms) {
                atomStyle.left = 0;
                atomStyle.top = 0;
            }

            $atoms.css(atomStyle).addClass(this.options.itemClass);

            this.updateSortData($atoms, true);

            return $atoms;
        },

        // _init fires when your instance is first created
        // (from the constructor above), and when you
        // attempt to initialize the widget again (by the bridge)
        // after it has already been initialized.
        _init: function _init(callback) {

            this.$filteredAtoms = this._filter(this.$allAtoms);
            this._sort();
            this.reLayout(callback);
        },

        option: function option(opts) {
            // change options AFTER initialization:
            // signature: $('#foo').bar({ cool:false });
            if ($.isPlainObject(opts)) {
                this.options = $.extend(true, this.options, opts);

                // trigger _updateOptionName if it exists
                var updateOptionFn;
                for (var optionName in opts) {
                    updateOptionFn = '_update' + capitalize(optionName);
                    if (this[updateOptionFn]) {
                        this[updateOptionFn]();
                    }
                }
            }
        },

        // ====================== updaters ====================== //
        // kind of like setters

        _updateAnimationEngine: function _updateAnimationEngine() {
            var animationEngine = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, '');
            var isUsingJQueryAnimation;
            // set applyStyleFnName
            switch (animationEngine) {
                case 'css':
                case 'none':
                    isUsingJQueryAnimation = false;
                    break;
                case 'jquery':
                    isUsingJQueryAnimation = true;
                    break;
                default:
                    // best available
                    isUsingJQueryAnimation = !Modernizr.csstransitions;
            }
            this.isUsingJQueryAnimation = isUsingJQueryAnimation;
            this._updateUsingTransforms();
        },

        _updateTransformsEnabled: function _updateTransformsEnabled() {
            this._updateUsingTransforms();
        },

        _updateUsingTransforms: function _updateUsingTransforms() {
            var usingTransforms = this.usingTransforms = this.options.transformsEnabled && Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

            // prevent scales when transforms are disabled
            if (!usingTransforms) {
                delete this.options.hiddenStyle.scale;
                delete this.options.visibleStyle.scale;
            }

            this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
        },

        // ====================== Filtering ======================

        _filter: function _filter($atoms) {
            var filter = this.options.filter === '' ? '*' : this.options.filter;

            if (!filter) {
                return $atoms;
            }

            var hiddenClass = this.options.hiddenClass,
                hiddenSelector = '.' + hiddenClass,
                $hiddenAtoms = $atoms.filter(hiddenSelector),
                $atomsToShow = $hiddenAtoms;

            if (filter !== '*') {
                $atomsToShow = $hiddenAtoms.filter(filter);
                var $atomsToHide = $atoms.not(hiddenSelector).not(filter).addClass(hiddenClass);
                this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
            }

            this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
            $atomsToShow.removeClass(hiddenClass);

            return $atoms.filter(filter);
        },

        // ====================== Sorting ======================

        updateSortData: function updateSortData($atoms, isIncrementingElemCount) {
            var instance = this,
                getSortData = this.options.getSortData,
                $this,
                sortData;
            $atoms.each(function () {
                $this = $(this);
                sortData = {};
                // get value for sort data based on fn( $elem ) passed in
                for (var key in getSortData) {
                    if (!isIncrementingElemCount && key === 'original-order') {
                        // keep original order original
                        sortData[key] = $.data(this, 'isotope-sort-data')[key];
                    } else {
                        sortData[key] = getSortData[key]($this, instance);
                    }
                }
                // apply sort data to element
                $.data(this, 'isotope-sort-data', sortData);
            });
        },

        // used on all the filtered atoms
        _sort: function _sort() {

            var sortBy = this.options.sortBy,
                getSorter = this._getSorter,
                sortDir = this.options.sortAscending ? 1 : -1,
                sortFn = function sortFn(alpha, beta) {
                var a = getSorter(alpha, sortBy),
                    b = getSorter(beta, sortBy);
                // fall back to original order if data matches
                if (a === b && sortBy !== 'original-order') {
                    a = getSorter(alpha, 'original-order');
                    b = getSorter(beta, 'original-order');
                }
                return (a > b ? 1 : a < b ? -1 : 0) * sortDir;
            };

            this.$filteredAtoms.sort(sortFn);
        },

        _getSorter: function _getSorter(elem, sortBy) {
            return $.data(elem, 'isotope-sort-data')[sortBy];
        },

        // ====================== Layout Helpers ======================

        _translate: function _translate(x, y) {
            return { translate: [x, y] };
        },

        _positionAbs: function _positionAbs(x, y) {
            return { left: x, top: y };
        },

        _pushPosition: function _pushPosition($elem, x, y) {
            x = Math.round(x + this.offset.left);
            y = Math.round(y + this.offset.top);
            var position = this.getPositionStyles(x, y);
            this.styleQueue.push({ $el: $elem, style: position });
            if (this.options.itemPositionDataEnabled) {
                $elem.data('isotope-item-position', { x: x, y: y });
            }
        },

        // ====================== General Layout ======================

        // used on collection of atoms (should be filtered, and sorted before )
        // accepts atoms-to-be-laid-out to start with
        layout: function layout($elems, callback) {

            var layoutMode = this.options.layoutMode;

            // layout logic
            this['_' + layoutMode + 'Layout']($elems);

            // set the size of the container
            if (this.options.resizesContainer) {
                var containerStyle = this['_' + layoutMode + 'GetContainerSize']();
                this.styleQueue.push({ $el: this.element, style: containerStyle });
            }

            this._processStyleQueue($elems, callback);

            this.isLaidOut = true;
        },

        _processStyleQueue: function _processStyleQueue($elems, callback) {
            // are we animating the layout arrangement?
            // use plugin-ish syntax for css or animate
            var styleFn = !this.isLaidOut ? 'css' : this.isUsingJQueryAnimation ? 'animate' : 'css',
                animOpts = this.options.animationOptions,
                onLayout = this.options.onLayout,
                objStyleFn,
                processor,
                triggerCallbackNow,
                callbackFn;

            // default styleQueue processor, may be overwritten down below
            processor = function processor(i, obj) {
                obj.$el[styleFn](obj.style, animOpts);
            };

            if (this._isInserting && this.isUsingJQueryAnimation) {
                // if using styleQueue to insert items
                processor = function processor(i, obj) {
                    // only animate if it not being inserted
                    objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
                    obj.$el[objStyleFn](obj.style, animOpts);
                };
            } else if (callback || onLayout || animOpts.complete) {
                // has callback
                var isCallbackTriggered = false,

                // array of possible callbacks to trigger
                callbacks = [callback, onLayout, animOpts.complete],
                    instance = this;
                triggerCallbackNow = true;
                // trigger callback only once
                callbackFn = function callbackFn() {
                    if (isCallbackTriggered) {
                        return;
                    }
                    var hollaback;
                    for (var i = 0, len = callbacks.length; i < len; i++) {
                        hollaback = callbacks[i];
                        if (typeof hollaback === 'function') {
                            hollaback.call(instance.element, $elems, instance);
                        }
                    }
                    isCallbackTriggered = true;
                };

                if (this.isUsingJQueryAnimation && styleFn === 'animate') {
                    // add callback to animation options
                    animOpts.complete = callbackFn;
                    triggerCallbackNow = false;
                } else if (Modernizr.csstransitions) {
                    // detect if first item has transition
                    var i = 0,
                        firstItem = this.styleQueue[0],
                        testElem = firstItem && firstItem.$el,
                        styleObj;
                    // get first non-empty jQ object
                    while (!testElem || !testElem.length) {
                        styleObj = this.styleQueue[i++];
                        // HACK: sometimes styleQueue[i] is undefined
                        if (!styleObj) {
                            return;
                        }
                        testElem = styleObj.$el;
                    }
                    // get transition duration of the first element in that object
                    // yeah, this is inexact
                    var duration = parseFloat(getComputedStyle(testElem[0])[transitionDurProp]);
                    if (duration > 0) {
                        processor = function processor(i, obj) {
                            obj.$el[styleFn](obj.style, animOpts)
                            // trigger callback at transition end
                            .one(transitionEndEvent, callbackFn);
                        };
                        triggerCallbackNow = false;
                    }
                }
            }

            // process styleQueue
            $.each(this.styleQueue, processor);

            if (triggerCallbackNow) {
                callbackFn();
            }

            // clear out queue for next time
            this.styleQueue = [];
        },

        resize: function resize() {
            if (this['_' + this.options.layoutMode + 'ResizeChanged']()) {
                this.reLayout();
            }
        },

        reLayout: function reLayout(callback) {

            this['_' + this.options.layoutMode + 'Reset']();
            this.layout(this.$filteredAtoms, callback);
        },

        // ====================== Convenience methods ======================

        // ====================== Adding items ======================

        // adds a jQuery object of items to a isotope container
        addItems: function addItems($content, callback) {
            var $newAtoms = this._getAtoms($content);
            // add new atoms to atoms pools
            this.$allAtoms = this.$allAtoms.add($newAtoms);

            if (callback) {
                callback($newAtoms);
            }
        },

        // convienence method for adding elements properly to any layout
        // positions items, hides them, then animates them back in <--- very sezzy
        insert: function insert($content, callback) {
            // position items
            this.element.append($content);

            var instance = this;
            this.addItems($content, function ($newAtoms) {
                var $newFilteredAtoms = instance._filter($newAtoms);
                instance._addHideAppended($newFilteredAtoms);
                instance._sort();
                instance.reLayout();
                instance._revealAppended($newFilteredAtoms, callback);
            });
        },

        // convienence method for working with Infinite Scroll
        appended: function appended($content, callback) {
            var instance = this;
            this.addItems($content, function ($newAtoms) {
                instance._addHideAppended($newAtoms);
                instance.layout($newAtoms);
                instance._revealAppended($newAtoms, callback);
            });
        },

        // adds new atoms, then hides them before positioning
        _addHideAppended: function _addHideAppended($newAtoms) {
            this.$filteredAtoms = this.$filteredAtoms.add($newAtoms);
            $newAtoms.addClass('no-transition');

            this._isInserting = true;

            // apply hidden styles
            this.styleQueue.push({ $el: $newAtoms, style: this.options.hiddenStyle });
        },

        // sets visible style on new atoms
        _revealAppended: function _revealAppended($newAtoms, callback) {
            var instance = this;
            // apply visible style after a sec
            setTimeout(function () {
                // enable animation
                $newAtoms.removeClass('no-transition');
                // reveal newly inserted filtered elements
                instance.styleQueue.push({ $el: $newAtoms, style: instance.options.visibleStyle });
                instance._isInserting = false;
                instance._processStyleQueue($newAtoms, callback);
            }, 10);
        },

        // gathers all atoms
        reloadItems: function reloadItems() {
            this.$allAtoms = this._getAtoms(this.element.children());
        },

        // removes elements from Isotope widget
        remove: function remove($content, callback) {
            // remove elements immediately from Isotope instance
            this.$allAtoms = this.$allAtoms.not($content);
            this.$filteredAtoms = this.$filteredAtoms.not($content);
            // remove() as a callback, for after transition / animation
            var instance = this;
            var removeContent = function removeContent() {
                $content.remove();
                if (callback) {
                    callback.call(instance.element);
                }
            };

            if ($content.filter(':not(.' + this.options.hiddenClass + ')').length) {
                // if any non-hidden content needs to be removed
                this.styleQueue.push({ $el: $content, style: this.options.hiddenStyle });
                this._sort();
                this.reLayout(removeContent);
            } else {
                // remove it now
                removeContent();
            }
        },

        shuffle: function shuffle(callback) {
            this.updateSortData(this.$allAtoms);
            this.options.sortBy = 'random';
            this._sort();
            this.reLayout(callback);
        },

        // destroys widget, returns elements and container back (close) to original style
        destroy: function destroy() {

            var usingTransforms = this.usingTransforms;
            var options = this.options;

            this.$allAtoms.removeClass(options.hiddenClass + ' ' + options.itemClass).each(function () {
                var style = this.style;
                style.position = '';
                style.top = '';
                style.left = '';
                style.opacity = '';
                if (usingTransforms) {
                    style[transformProp] = '';
                }
            });

            // re-apply saved container styles
            var elemStyle = this.element[0].style;
            for (var prop in this.originalStyle) {
                elemStyle[prop] = this.originalStyle[prop];
            }

            this.element.unbind('.isotope').undelegate('.' + options.hiddenClass, 'click').removeClass(options.containerClass).removeData('isotope');

            $window.unbind('.isotope');
        },

        // ====================== LAYOUTS ======================

        // calculates number of rows or columns
        // requires columnWidth or rowHeight to be set on namespaced object
        // i.e. this.masonry.columnWidth = 200
        _getSegments: function _getSegments(isRows) {
            var namespace = this.options.layoutMode,
                measure = isRows ? 'rowHeight' : 'columnWidth',
                size = isRows ? 'height' : 'width',
                segmentsName = isRows ? 'rows' : 'cols',
                containerSize = this.element[size](),
                segments,

            // i.e. options.masonry && options.masonry.columnWidth
            segmentSize = this.options[namespace] && this.options[namespace][measure] ||
            // or use the size of the first item, i.e. outerWidth
            this.$filteredAtoms['outer' + capitalize(size)](true) ||
            // if there's no items, use size of container
            containerSize;

            segments = Math.floor(containerSize / segmentSize);
            segments = Math.max(segments, 1);

            // i.e. this.masonry.cols = ....
            this[namespace][segmentsName] = segments;
            // i.e. this.masonry.columnWidth = ...
            this[namespace][measure] = segmentSize;
        },

        _checkIfSegmentsChanged: function _checkIfSegmentsChanged(isRows) {
            var namespace = this.options.layoutMode,
                segmentsName = isRows ? 'rows' : 'cols',
                prevSegments = this[namespace][segmentsName];
            // update cols/rows
            this._getSegments(isRows);
            // return if updated cols/rows is not equal to previous
            return this[namespace][segmentsName] !== prevSegments;
        },

        // ====================== Masonry ======================

        _masonryReset: function _masonryReset() {
            // layout-specific props
            this.masonry = {};
            // FIXME shouldn't have to call this again
            this._getSegments();
            var i = this.masonry.cols;
            this.masonry.colYs = [];
            while (i--) {
                this.masonry.colYs.push(0);
            }
        },

        _masonryLayout: function _masonryLayout($elems) {
            var instance = this,
                props = instance.masonry;
            $elems.each(function () {
                var $this = $(this),

                //how many columns does this brick span
                colSpan = Math.ceil($this.outerWidth(true) / props.columnWidth);
                colSpan = Math.min(colSpan, props.cols);

                if (colSpan === 1) {
                    // if brick spans only one column, just like singleMode
                    instance._masonryPlaceBrick($this, props.colYs);
                } else {
                    // brick spans more than one column
                    // how many different places could this brick fit horizontally
                    var groupCount = props.cols + 1 - colSpan,
                        groupY = [],
                        groupColY,
                        i;

                    // for each group potential horizontal position
                    for (i = 0; i < groupCount; i++) {
                        // make an array of colY values for that one group
                        groupColY = props.colYs.slice(i, i + colSpan);
                        // and get the max value of the array
                        groupY[i] = Math.max.apply(Math, groupColY);
                    }

                    instance._masonryPlaceBrick($this, groupY);
                }
            });
        },

        // worker method that places brick in the columnSet
        //   with the the minY
        _masonryPlaceBrick: function _masonryPlaceBrick($brick, setY) {
            // get the minimum Y value from the columns
            var minimumY = Math.min.apply(Math, setY),
                shortCol = 0;

            // Find index of short column, the first from the left
            for (var i = 0, len = setY.length; i < len; i++) {
                if (setY[i] === minimumY) {
                    shortCol = i;
                    break;
                }
            }

            // position the brick
            var x = this.masonry.columnWidth * shortCol,
                y = minimumY;
            this._pushPosition($brick, x, y);

            // apply setHeight to necessary columns
            var setHeight = minimumY + $brick.outerHeight(true),
                setSpan = this.masonry.cols + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.masonry.colYs[shortCol + i] = setHeight;
            }
        },

        _masonryGetContainerSize: function _masonryGetContainerSize() {
            var containerHeight = Math.max.apply(Math, this.masonry.colYs);
            return { height: containerHeight };
        },

        _masonryResizeChanged: function _masonryResizeChanged() {
            return this._checkIfSegmentsChanged();
        },

        // ====================== fitRows ======================

        _fitRowsReset: function _fitRowsReset() {
            this.fitRows = {
                x: 0,
                y: 0,
                height: 0
            };
        },

        _fitRowsLayout: function _fitRowsLayout($elems) {
            var instance = this,
                containerWidth = this.element.width(),
                props = this.fitRows;

            $elems.each(function () {
                var $this = $(this),
                    atomW = $this.outerWidth(true),
                    atomH = $this.outerHeight(true);

                if (props.x !== 0 && atomW + props.x > containerWidth) {
                    // if this element cannot fit in the current row
                    props.x = 0;
                    props.y = props.height;
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.height = Math.max(props.y + atomH, props.height);
                props.x += atomW;
            });
        },

        _fitRowsGetContainerSize: function _fitRowsGetContainerSize() {
            return { height: this.fitRows.height };
        },

        _fitRowsResizeChanged: function _fitRowsResizeChanged() {
            return true;
        },

        // ====================== cellsByRow ======================

        _cellsByRowReset: function _cellsByRowReset() {
            this.cellsByRow = {
                index: 0
            };
            // get this.cellsByRow.columnWidth
            this._getSegments();
            // get this.cellsByRow.rowHeight
            this._getSegments(true);
        },

        _cellsByRowLayout: function _cellsByRowLayout($elems) {
            var instance = this,
                props = this.cellsByRow;
            $elems.each(function () {
                var $this = $(this),
                    col = props.index % props.cols,
                    row = Math.floor(props.index / props.cols),
                    x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
                    y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
                instance._pushPosition($this, x, y);
                props.index++;
            });
        },

        _cellsByRowGetContainerSize: function _cellsByRowGetContainerSize() {
            return { height: Math.ceil(this.$filteredAtoms.length / this.cellsByRow.cols) * this.cellsByRow.rowHeight + this.offset.top };
        },

        _cellsByRowResizeChanged: function _cellsByRowResizeChanged() {
            return this._checkIfSegmentsChanged();
        },

        // ====================== straightDown ======================

        _straightDownReset: function _straightDownReset() {
            this.straightDown = {
                y: 0
            };
        },

        _straightDownLayout: function _straightDownLayout($elems) {
            var instance = this;
            $elems.each(function (i) {
                var $this = $(this);
                instance._pushPosition($this, 0, instance.straightDown.y);
                instance.straightDown.y += $this.outerHeight(true);
            });
        },

        _straightDownGetContainerSize: function _straightDownGetContainerSize() {
            return { height: this.straightDown.y };
        },

        _straightDownResizeChanged: function _straightDownResizeChanged() {
            return true;
        },

        // ====================== masonryHorizontal ======================

        _masonryHorizontalReset: function _masonryHorizontalReset() {
            // layout-specific props
            this.masonryHorizontal = {};
            // FIXME shouldn't have to call this again
            this._getSegments(true);
            var i = this.masonryHorizontal.rows;
            this.masonryHorizontal.rowXs = [];
            while (i--) {
                this.masonryHorizontal.rowXs.push(0);
            }
        },

        _masonryHorizontalLayout: function _masonryHorizontalLayout($elems) {
            var instance = this,
                props = instance.masonryHorizontal;
            $elems.each(function () {
                var $this = $(this),

                //how many rows does this brick span
                rowSpan = Math.ceil($this.outerHeight(true) / props.rowHeight);
                rowSpan = Math.min(rowSpan, props.rows);

                if (rowSpan === 1) {
                    // if brick spans only one column, just like singleMode
                    instance._masonryHorizontalPlaceBrick($this, props.rowXs);
                } else {
                    // brick spans more than one row
                    // how many different places could this brick fit horizontally
                    var groupCount = props.rows + 1 - rowSpan,
                        groupX = [],
                        groupRowX,
                        i;

                    // for each group potential horizontal position
                    for (i = 0; i < groupCount; i++) {
                        // make an array of colY values for that one group
                        groupRowX = props.rowXs.slice(i, i + rowSpan);
                        // and get the max value of the array
                        groupX[i] = Math.max.apply(Math, groupRowX);
                    }

                    instance._masonryHorizontalPlaceBrick($this, groupX);
                }
            });
        },

        _masonryHorizontalPlaceBrick: function _masonryHorizontalPlaceBrick($brick, setX) {
            // get the minimum Y value from the columns
            var minimumX = Math.min.apply(Math, setX),
                smallRow = 0;
            // Find index of smallest row, the first from the top
            for (var i = 0, len = setX.length; i < len; i++) {
                if (setX[i] === minimumX) {
                    smallRow = i;
                    break;
                }
            }

            // position the brick
            var x = minimumX,
                y = this.masonryHorizontal.rowHeight * smallRow;
            this._pushPosition($brick, x, y);

            // apply setHeight to necessary columns
            var setWidth = minimumX + $brick.outerWidth(true),
                setSpan = this.masonryHorizontal.rows + 1 - len;
            for (i = 0; i < setSpan; i++) {
                this.masonryHorizontal.rowXs[smallRow + i] = setWidth;
            }
        },

        _masonryHorizontalGetContainerSize: function _masonryHorizontalGetContainerSize() {
            var containerWidth = Math.max.apply(Math, this.masonryHorizontal.rowXs);
            return { width: containerWidth };
        },

        _masonryHorizontalResizeChanged: function _masonryHorizontalResizeChanged() {
            return this._checkIfSegmentsChanged(true);
        },

        // ====================== fitColumns ======================

        _fitColumnsReset: function _fitColumnsReset() {
            this.fitColumns = {
                x: 0,
                y: 0,
                width: 0
            };
        },

        _fitColumnsLayout: function _fitColumnsLayout($elems) {
            var instance = this,
                containerHeight = this.element.height(),
                props = this.fitColumns;
            $elems.each(function () {
                var $this = $(this),
                    atomW = $this.outerWidth(true),
                    atomH = $this.outerHeight(true);

                if (props.y !== 0 && atomH + props.y > containerHeight) {
                    // if this element cannot fit in the current column
                    props.x = props.width;
                    props.y = 0;
                }

                // position the atom
                instance._pushPosition($this, props.x, props.y);

                props.width = Math.max(props.x + atomW, props.width);
                props.y += atomH;
            });
        },

        _fitColumnsGetContainerSize: function _fitColumnsGetContainerSize() {
            return { width: this.fitColumns.width };
        },

        _fitColumnsResizeChanged: function _fitColumnsResizeChanged() {
            return true;
        },

        // ====================== cellsByColumn ======================

        _cellsByColumnReset: function _cellsByColumnReset() {
            this.cellsByColumn = {
                index: 0
            };
            // get this.cellsByColumn.columnWidth
            this._getSegments();
            // get this.cellsByColumn.rowHeight
            this._getSegments(true);
        },

        _cellsByColumnLayout: function _cellsByColumnLayout($elems) {
            var instance = this,
                props = this.cellsByColumn;
            $elems.each(function () {
                var $this = $(this),
                    col = Math.floor(props.index / props.rows),
                    row = props.index % props.rows,
                    x = (col + 0.5) * props.columnWidth - $this.outerWidth(true) / 2,
                    y = (row + 0.5) * props.rowHeight - $this.outerHeight(true) / 2;
                instance._pushPosition($this, x, y);
                props.index++;
            });
        },

        _cellsByColumnGetContainerSize: function _cellsByColumnGetContainerSize() {
            return { width: Math.ceil(this.$filteredAtoms.length / this.cellsByColumn.rows) * this.cellsByColumn.columnWidth };
        },

        _cellsByColumnResizeChanged: function _cellsByColumnResizeChanged() {
            return this._checkIfSegmentsChanged(true);
        },

        // ====================== straightAcross ======================

        _straightAcrossReset: function _straightAcrossReset() {
            this.straightAcross = {
                x: 0
            };
        },

        _straightAcrossLayout: function _straightAcrossLayout($elems) {
            var instance = this;
            $elems.each(function (i) {
                var $this = $(this);
                instance._pushPosition($this, instance.straightAcross.x, 0);
                instance.straightAcross.x += $this.outerWidth(true);
            });
        },

        _straightAcrossGetContainerSize: function _straightAcrossGetContainerSize() {
            return { width: this.straightAcross.x };
        },

        _straightAcrossResizeChanged: function _straightAcrossResizeChanged() {
            return true;
        }

    };

    // ======================= imagesLoaded Plugin ===============================
    /*!
     * jQuery imagesLoaded plugin v1.1.0
     * http://github.com/desandro/imagesloaded
     *
     * MIT License. by Paul Irish et al.
     */

    // $('#my-container').imagesLoaded(myFunction)
    // or
    // $('img').imagesLoaded(myFunction)

    // execute a callback when all images have loaded.
    // needed because .load() doesn't work on cached images

    // callback function gets image collection as argument
    //  `this` is the container

    $.fn.imagesLoaded = function (callback) {
        var $this = this,
            $images = $this.find('img').add($this.filter('img')),
            len = $images.length,
            blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
            loaded = [];

        function triggerCallback() {
            callback.call($this, $images);
        }

        function imgLoaded(event) {
            var img = event.target;
            if (img.src !== blank && $.inArray(img, loaded) === -1) {
                loaded.push(img);
                if (--len <= 0) {
                    setTimeout(triggerCallback);
                    $images.unbind('.imagesLoaded', imgLoaded);
                }
            }
        }

        // if no images, trigger immediately
        if (!len) {
            triggerCallback();
        }

        $images.bind('load.imagesLoaded error.imagesLoaded', imgLoaded).each(function () {
            // cached images don't fire load sometimes, so we reset src.
            var src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = blank;
            this.src = src;
        });

        return $this;
    };

    // helper function for logging errors
    // $.error breaks jQuery chaining
    var logError = function logError(message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    // =======================  Plugin bridge  ===============================
    // leverages data method to either create or return $.Isotope constructor
    // A bit from jQuery UI
    //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
    // A bit from jcarousel
    //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

    $.fn.isotope = function (options, callback) {
        if (typeof options === 'string') {
            // call method
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = $.data(this, 'isotope');
                if (!instance) {
                    logError("cannot call methods on isotope prior to initialization; " + "attempted to call method '" + options + "'");
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                    logError("no such method '" + options + "' for isotope instance");
                    return;
                }
                // apply method
                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'isotope');
                if (instance) {
                    // apply options & init
                    instance.option(options);
                    instance._init(callback);
                } else {
                    // initialize new instance
                    $.data(this, 'isotope', new $.Isotope(options, this, callback));
                }
            });
        }
        // return jQuery object
        // so plugin methods do not have to
        return this;
    };
})(window, jQuery);

function main() {

    (function () {
        'use strict';

        $('a.page-scroll').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 40
                    }, 900);
                    return false;
                }
            }
        });

        // Show Menu on Book
        $(window).bind('scroll', function () {
            var navHeight = $(window).height() - 500;
            if ($(window).scrollTop() > navHeight) {
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
        $(window).load(function () {
            var $container = $('.portfolio-items');
            $container.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            $('.cat a').click(function () {
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
            keyboardNav: true
        });

        setTimeout(function () {
            $('.intro-text img').css({
                transition: 'all .7s ease-in-out',
                transform: 'scale(1.1)'
            });
        }, 500);
        setTimeout(function () {
            $('.intro-text img').css({
                transition: 'all .7s ease-in-out',
                transform: 'scale(1)'
            });
        }, 1200);

        // fade effects
        $(window).scroll(function () {
            $('.animation-scroll').each(function () {
                var elPosition = $(this).offset().top; // Position of the element
                var elHeight = $(this).height(); // Height of the element
                var windowTop = $(window).scrollTop(); // Top of the window
                var windowHeight = $(window).height(); // Height of the window
                if (elPosition < windowTop + windowHeight - elHeight) {
                    $(this).addClass("animation fade-in-up");
                } // adds the class wheh the element is fully in the visible area of the window
                if (elPosition > windowTop + windowHeight) {
                    $(this).removeClass("animation fade-in-up");
                } // removes the class when the element is not visible in the window
                if (elPosition + elHeight < windowTop) {
                    $(this).removeClass("animation fade-in-up");
                } // removes the class when the element is not visible in the window
            });
            $('.menu-item, .menu-section-title, .myhr').each(function () {
                var elPosition = $(this).offset().top; // Position of the element
                var elHeight = $(this).height(); // Height of the element
                var windowTop = $(window).scrollTop(); // Top of the window
                var windowHeight = $(window).height(); // Height of the window
                if (elPosition < windowTop + windowHeight - elHeight) {
                    $(this).addClass("animation fade-in-up");
                }
            });
            $('.menu-section-title').each(function () {
                var elPosition = $(this).offset().top; // Position of the element
                var elHeight = $(this).height(); // Height of the element
                var windowTop = $(window).scrollTop(); // Top of the window
                var windowHeight = $(window).height(); // Height of the window
                if (elPosition < windowTop + windowHeight - elHeight) {
                    $(this).addClass("animation fade-in-up");
                }
            });
        });
    })();
}
main();