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
	masonry();

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

});