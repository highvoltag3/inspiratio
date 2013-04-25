jQuery(document).ready(function($) {
	$('#subnav a').tooltip();
	$('#ideadetailspanel h2').tooltip();
	$('.tooltip').tooltip();

	if( $('.slider-thumbs').length ) {
    	$('.slider-thumbs .thumbnail').fancybox();
  	}


	$('.likes').click(function(){
		var likes;
		var thisobj = $(this);
		$.ajax({
		  type: "GET",
		  url: $(this).attr('href'),
		}).success(function( msg ) {
		  	likes = msg.idea.likes;
		  	$(thisobj).html(likes);
		}).error(function(xhr, status, err) {
			if (xhr.status == 401)
			openErrorModal("<p>We are sorry, but to ensure quality and so we can all benefit from a great community we require that you register before you can like an idea.</p><br /> <p>Join us and enjoy some great benefits, it's really quick and easy.</p>", 'I\'d like toRegister!');
		});
		return false;
	});

	$('.follow').click(function(){
		var current_bg = $(this).css('background');
		if ( current_bg.search("follow_icon") > 0 ) {
			$(this).css('background', 'url(/assets/new/following_icon.png) 15px 0 no-repeat');
			var title = $(this).attr('data-title');
			title.replace("Follow","Following");
			$(this).attr('data-title', title);
		} else {
			$(this).css('background', 'url(/assets/new/follow_icon.png) 15px 0 no-repeat');
		}
	});
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
	$('.alert-success').delay(1500).fadeOut('slow');
	//auto dismiss alert of error
	$('.alert-error').delay(3000).fadeOut('slow');
});

function openErrorModal(errorMsg, confirmtext) {
	$('#container').append('<div id="confirmDiv"></div>');
    $("#confirmDiv").confirmModal({
        heading: 'Bummer',
        body: errorMsg,
        btntype: 'btn-info',
        confirmtext: confirmtext,
        callback: function () {
            window.location.href = './users/sign_up?where=modal';
        }
    });
}