jQuery(document).ready(function($) {
	$('#subnav a').tooltip();
	$('#ideadetailspanel h2').tooltip();
	$('.tooltip').tooltip();

	//masonry	
	var $container = $('#ideas');

	//let's put it in a function so we can fire it each time a resize happens.
	function masonry(){
		$container.imagesLoaded( function(){
		  $container.masonry({
		    	itemSelector : '.idea',
		    	// set columnWidth a fraction of the container width
				columnWidth: function( containerWidth ) {
					console.log(containerWidth / 3);
					return containerWidth / 3;
				},
				isResizable: true 
		  });
		});
	}
	//trigger on load 
	if ( typeof $container.imagesLoaded != 'undefined' ) {
		masonry();
	}

	//now triger for the resize with a delay so it wont fire constanly while resizing.
	var delay = (function(){
	  var timer = 0;
	  return function(callback, ms){
	    clearTimeout (timer);
	    timer = setTimeout(callback, ms);
	  };
	})();

	$(window).resize(function() {
	    delay(function(){
	    	//trigger masonry again if the browser was resized.
	    	//console.log('resize triggered');
	    	masonry();
	    }, 500);
	});

	//lets give the container a min-height so it always pushes footer to bottom
	var viewportheihgt = $(window).height();
	var cheight = (viewportheihgt - $('#container + header').height() ) - $('body > footer').height();
	$('#container').css('min-height', cheight);

	//auto dismiss alert of success
	$('.alert-success').delay(1500).fadeOut();
	//auto dismiss alert of error
	$('.alert-success').delay(3000).fadeOut();
});