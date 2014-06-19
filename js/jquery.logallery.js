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

		this.init();

		this.attach_events();

		this.ready();
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
		}, 
		w = $(this.elements.image_container).width();

		this.elements.container.addClass('logallery');
		this.elements.image_container.height(this.options.imageContainerInitialHeight + 'px');

		//add the nav if we're using it
		if (this.options.useNextPreviousNavigation) {
			this.elements['previous'] = $('<a href="#" class="nav previous" rel="previous"></a>');
			this.elements['next'] = $('<a href="#" class="nav next" rel="next"></a>');

			$(this.elements.image_container).append(this.elements.previous).append(this.elements.next);
		}
	}

	Logallery.prototype.attach_events = function() {
		var that = this;

		//handle the nav links
		$(this.elements.image_container).find('a.nav').on('click', function(element) {
			if ($(this).hasClass('previous')) {
				$(elements.thumbs_container).children().eq(activeIndex-1).find('a').click();
			}

			if ($(this).hasClass('next')) {
				$(elements.thumbs_container).children().eq(activeIndex+1).find('a').click();
			}
				
			return false;
		});	

		$(this.elements.thumbs_container).find('a').on('click', function(element) {
			var img = new Image;
				
			$(that.elements.thumbs_container).find('a.active').removeClass('active')
				
			$(this).addClass('active');
			
			that.activeIndex = $(that.elements.thumbs_container).children().index($(this).parent());
				
			$(that.elements.image_container).addClass('loading');
				
			$(img).hide(); 
				
			$(img).load(function() {
				$(that.elements.image_container).animate({ height: img.height });
				$(that.elements.caption_container).append('<span>' + $(img).attr('alt') + '</span>');
				//$(this).css('margin-left', (w - img.width) / 2 + 'px').appendTo(elements.image_container).removeClass('loading').fadeIn();
				$(this).appendTo(that.elements.image_container).removeClass('loading').fadeIn();
			}).attr({
				src: $(this).attr('href'),
				alt: $(this).attr('title'),
				title: $(this).attr('title')
			});

			if (that.options.useNextPreviousNavigation) {
				if (that.activeIndex == 0) {	
					$(that.elements.previous).removeClass('active');
				} else {
					$(that.elements.previous).addClass('active');
				}
				
				if (that.activeIndex == ($(that.elements.thumbs_container).children().length - 1)) {
					$(that.elements.next).removeClass('active');
				} else {
					$(that.elements.next).addClass('active');
				}
			}
							
			$(that.elements.image_container).find('img').fadeOut(function() {
				$(this).remove();
			});
			
			$(that.elements.caption_container).children().hide().remove();
			
			return false;
		});
	}

	Logallery.prototype.ready = function() {
		$(this.elements.thumbs_container).find('li a:first').trigger('click');
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