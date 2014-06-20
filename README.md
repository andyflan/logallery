# Logallery

A very simple jQuery gallery plugin that doesn't do very much, but it's very lightweight.

## Usage

Do something like this:

```html
<link rel="stylesheet" type="text/css" media="screen, projection" href="css/logallery.css" />

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
```

## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
