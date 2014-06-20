/*
 *	Project: 		Logallery
 *
 *	Version: 		1.2 (19th June 2014)
 *
 *	Author: 		Andrew Flannery (inheritweb.net)
 *
 *	Description: 	In-place gallery, nice and small
 *
 *	License: 		GNU General Public License
 *
 *	Copyright:		2014 Andrew Flannery
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *	Usage:
 *
		<div class="gallery">
			<div class="image"></div>
			
			<h3 class="caption"></h3>
			
			<ul class="thumbs">
				<li><a href="<path_to_large_image>" title="Image Title"><img src="<path_to_thumb_image>" alt="Image Caption" /></a></li>
				<li><a href="<path_to_large_image>" title="Image Title"><img src="<path_to_thumb_image>" alt="Image Caption" /></a></li>
				<li><a href="<path_to_large_image>" title="Image Title"><img src="<path_to_thumb_image>" alt="Image Caption" /></a></li>
			</ul>
		</div>

		<script>
			$('.gallery').logallery();
		</script>
 *
 *	Extend:
 *	
 *	All the functionality is encapsulated by the Logallery constructor. If you want to extend this plugin or override
 *	it without forking it then simply modify the Logallery prototype, eg:
 *
 		Logallery.prototype.ready = function() {
			//do some stuff
 		}

 		Logallery.prototype.after_load_image = function() {
			//do some stuff
 		}
 *
 */

/*
 *	Constructor
 */

Logallery = function(element, options) {
	this.element = element;
		
	this.options = options;

	this.init();
}

/*
 *	Initialisation function, gets redefined inside the jquery closure below
 */

Logallery.prototype.init = function() {};

(function($) {
	/*
	 *	Used by prev/next navigation
	 */

	Logallery.prototype.activeIndex = null;

	/*
	 *	A container for gallery elements
	 */

	Logallery.prototype.elements = {
		container:  null,
		image_container:  null,
		thumbs_container:  null,
		caption_container:  null,
		previous:  null,
		next:  null
	}

	/*
	 *	Initialisation function, assigns elements and appends nav if needed
	 */

	Logallery.prototype.init = function() {
		//setup some elements and metrics
		this.elements = {
			container: 			$(this.element),
			image_container:  	$(this.element).find(this.options.imageContainer),
			thumbs_container: 	$(this.element).find('ul'),
			caption_container: 	$(this.element).find(this.options.captionContainer) || $(this.element).nextAll(this.options.captionContainer)
		};

		//add the nav if we're using it
		if (this.options.useNextPreviousNavigation) {
			this.elements['previous'] = $('<a href="#" class="nav prev" rel="prev"><span></span></a>');
			this.elements['next'] = $('<a href="#" class="nav next" rel="next"><span></span></a>');

			$(this.elements.image_container).append(this.elements.previous).append(this.elements.next);
		}

		//add the class
		this.elements.container.addClass('logallery');

		this.attach_events().ready();

		//click the first thumb
		$(this.elements.thumbs_container).find('li a:first').trigger('click');

		return this;
	}

	/*
	 *	Attaches any event handlers to elements
	 */

	Logallery.prototype.attach_events = function() {
		var that = this;

		//handle the nav links
		$(this.elements.image_container).find('a.nav').on('click', function(element) {
			if ($(this).hasClass('prev')) {
				$(that.elements.thumbs_container).children().eq(that.activeIndex-1).find('a').trigger('click');
			}

			if ($(this).hasClass('next')) {
				$(that.elements.thumbs_container).children().eq(that.activeIndex+1).find('a').trigger('click');
			}
				
			return false;
		});	

		//handle the thumb clicks
		$(this.elements.thumbs_container).find('a').on('click', function(event) {
			event.preventDefault();

			that.prepare_for_switch(this).load_image($(this).attr('href'), $(this).attr('title'), function() {
				that.check_nav_controls();
			});
		});

		//handle the resize of the window
		$(window).on('resize', function(event) {
			that.check_image_container_height();
		});

		return this;
	}

	/*
	 *	Gets called after initialisation - ripe for extensibility
	 */

	Logallery.prototype.ready = function() {};

	/*
	 *	Works out thumbs/caption ui and existing image before a new image comes in
	 */

	Logallery.prototype.prepare_for_switch = function(thumb_a) {
		//deactivate old thumb
		$(this.elements.thumbs_container).find('a.active').removeClass('active')
				
		//activate the new one
		$(thumb_a).addClass('active');
			
		//set the active index
		this.activeIndex = $(this.elements.thumbs_container).children().index($(thumb_a).parent());
			
		//remove the caption
		$(this.elements.caption_container).children().hide().remove();

		//fade any existing image out then remove it
		$(this.elements.image_container).find('img').fadeOut('fast', function() {
			$(this).remove();
		});

		return this;
	}

	/*
	 *	Loads an image and fades it in
	 */

	Logallery.prototype.load_image = function(url, alt, callback) {
		var that = this, img = new Image;

		$(that.elements.image_container).addClass('loading');
		
		$(img).hide().attr({
			src: url,
			alt: alt
		}).load(function() {
			that.check_image_container_height(img);

			//setup the caption
			$(that.elements.caption_container).append('<span>' + alt + '</span>');

			//add the image to the container and fade it in
			$(this).appendTo(that.elements.image_container).removeClass('loading').fadeIn('slow');

			//call the callback
			callback();

			that.after_load_image(url, alt)
		});
	}

	/*
	 *	Gets called then the image is loaded, ripe for extensibility
	 */

	Logallery.prototype.after_load_image = function(url, alt) {};

	/*
	 *	Works out which nav controls should show
	 */

	Logallery.prototype.check_nav_controls = function() {
		if (this.options.useNextPreviousNavigation) {
			if (this.activeIndex == 0) {	
				$(this.elements.previous).addClass('disabled');
			} else {
				$(this.elements.previous).removeClass('disabled');
			}
			
			if (this.activeIndex == ($(this.elements.thumbs_container).children().length - 1)) {
				$(this.elements.next).addClass('disabled');
			} else {
				$(this.elements.next).removeClass('disabled');
			}
		}
	}

	/*
	 * 	Call on resize and on new image, works out img container height anim and centring of image
	 */

	Logallery.prototype.check_image_container_height = function(img) {
		var resize_width, resize_height;

		//get the image height/width from either dom or imcoming image
		img = (typeof img == 'undefined' || img == null) ? $(this.elements.image_container).find('img').get(0) : img;

		//if the container is smaller than
		if (this.elements.image_container.width() < img.width) {
			resize_width = this.elements.image_container.width();
			resize_height = img.height * (resize_width / img.width);
		} else {
			resize_width = img.width;
			resize_height = img.height;
		}

		//center the image
		$(img).css({ "margin-left": -(resize_width / 2) });

		//animate the height
		$(this.elements.image_container).css({ "height": resize_height });
	}

	//extend jquery
	$.fn.logallery = function(options) {
		//setup the options
		var opts = $.extend({}, $.fn.logallery.defaults, options);
		
		//iterate over the matching elements
		this.each(function(i, element) {
			//make the object
			new Logallery(element, opts);
		});
	};
	 
	$.fn.logallery.defaults = {
		imageContainer: '.image',
		captionContainer: '.caption',
		useNextPreviousNavigation: true
	};
	
})(jQuery);