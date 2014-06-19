/*
*
*	Project: 		Logallery
*
*	Version: 		1.2 (19th June 2013)
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
*/

(function($) {
	Logallery = function(element, options) {
		this.element = element;
		
		this.options = options;

		this.init().attach_events().ready();
	}

	Logallery.prototype.elements = null;
	Logallery.prototype.activeIndex = null;
	Logallery.prototype.elements = {
		container:  null,
		image_container:  null,
		thumbs_container:  null,
		caption_container:  null,
		previous:  null,
		next:  null
	}

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
			this.elements['previous'] = $('<a href="#" class="nav previous" rel="previous"></a>');
			this.elements['next'] = $('<a href="#" class="nav next" rel="next"></a>');

			$(this.elements.image_container).append(this.elements.previous).append(this.elements.next);
		}

		//add the class and setup the initia height
		this.elements.container.addClass('logallery');
		this.elements.image_container.height(this.options.imageContainerInitialHeight + 'px');

		return this;
	}

	Logallery.prototype.attach_events = function() {
		var that = this;

		//handle the nav links
		$(this.elements.image_container).find('a.nav').on('click', function(element) {
			if ($(this).hasClass('previous')) {
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

		return this;
	}

	Logallery.prototype.ready = function() {
		//we're ready, click the first thumn
		$(this.elements.thumbs_container).find('li a:first').trigger('click');

		return this;
	}

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
		$(this.elements.image_container).find('img').fadeOut(function() {
			$(thisx).remove();
		});

		return this;
	}

	Logallery.prototype.load_image = function(url, alt, callback) {
		var that = this, img = new Image;

		$(that.elements.image_container).addClass('loading');

		$(img).hide().load(function() {
			$(that.elements.image_container).animate({ height: img.height });
			$(that.elements.caption_container).append('<span>' + $(img).attr('alt') + '</span>');
			$(this).appendTo(that.elements.image_container).removeClass('loading').fadeIn();

			callback();
		}).attr({
			src: url,
			alt: alt
		});
	}

	Logallery.prototype.check_nav_controls = function() {
		if (this.options.useNextPreviousNavigation) {
			if (this.activeIndex == 0) {	
				$(this.elements.previous).removeClass('active');
			} else {
				$(this.elements.previous).addClass('active');
			}
			
			if (this.activeIndex == ($(this.elements.thumbs_container).children().length - 1)) {
				$(this.elements.next).removeClass('active');
			} else {
				$(this.elements.next).addClass('active');
			}
		}
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
		imageContainerInitialHeight: 400,
		captionContainer: '.caption',
		useNextPreviousNavigation: true
	};
	
})(jQuery);