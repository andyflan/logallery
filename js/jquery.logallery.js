/*
*
*	Project: 		LoGallery
*
*	Version: 		1.0 (22th July 2009)
*
*	Author: 		Rolled by Losource (losource.net)
*
*	Description: 	In-place gallery, nice and small
*
*	License: 		GNU General Public License
*
*	Copyright:		2009 Andrew Flannery
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
	$.fn.loGallery = function(options) {
		var opts = $.extend({}, $.fn.loGallery.defaults, options);
		
		this.each(function(i, ul) {
			var elImageContainer = $(opts.imageContainer).height(opts.imageContainerInitialHeight + 'px');
			var elCaptionContainer = $(opts.captionContainer);
			var w = $(elImageContainer).width();
			var activeIndex;
			
			if (opts.useNextPreviousNavigation) {
				elPrevious = $('<a href="#" class="nav previous active" rel="previous"></a>');
				elNext = $('<a href="#" class="nav next active" rel="next"></a>');
				$(elImageContainer).append(elPrevious).append(elNext).find('a.nav').click(function() {
					if ($(this).hasClass('previous')) {
						$(ul).children().eq(activeIndex-1).find('a').click();
					}

					if ($(this).hasClass('next')) {
						$(ul).children().eq(activeIndex+1).find('a').click();
					}
					
					return false;
				});	
			}
			
			$(ul).find('a').click(function() {
				var img = new Image;
				
				$(ul).find('.active').removeClass('.active')
				
				$(this).addClass('active');
				activeIndex = $(ul).children().index($(this).parent());
				
				$(elImageContainer).addClass('loading');
				
				$(img).hide(); 
				
				jQuery(img).load(function() {
					$(elImageContainer).animate({ height: img.height });
					$(elCaptionContainer).append('<span>' + $(img).attr('alt') + '</span>');
					$(this).css('margin-left', (w - img.width) / 2 + 'px').appendTo(elImageContainer).removeClass('loading').fadeIn();
				}).attr({
					src: $(this).attr('href'),
					alt: $(this).attr('title'),
					title: $(this).attr('title')
				});

				if (opts.useNextPreviousNavigation) {
					if (activeIndex == 0) {	
						$(elPrevious).removeClass('active');
					} else {
						$(elPrevious).addClass('active');
					}
					
					if (activeIndex == ($(ul).children().length - 1)) {
						$(elNext).removeClass('active');
					} else {
						$(elNext).addClass('active');
					}
				}
								
				$(elImageContainer).find('img').fadeOut(function() {
					$(this).remove();
				});
				
				$(elCaptionContainer).children().fadeOut(function() {
					$(this).remove();
				});
				
				return false;
			});
			
			$(ul).find('li a:first').click();
		});
	};
	 
	$.fn.loGallery.defaults = {
		imageContainer: '#image',
		imageContainerInitialHeight: 400,
		captionContainer: '#caption',
		useNextPreviousNavigation: true
	};
	
})(jQuery);