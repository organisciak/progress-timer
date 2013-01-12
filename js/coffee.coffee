class Sync
	constructor: (parent='body') ->
		@obj = $ '<div class="footer syncWindow">HELLO WORLD</div>'
		@obj.appendTo parent
	save: () ->
		@obj.slideDown()
	
	
