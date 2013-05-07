$(document).ready(function($) {

	$('.bvinv').click(function(){
		//console.log('Show bubble View clicked');
		$('#bubbleView').fadeIn();
		$('.lvinv a').removeClass('icon_active');
		$(this).find('a').addClass('icon_active');

	});
	
	var geturl = window.location.href.split('#')[0];
	$('.lvinv').click(function(){
		$('#bubbleView').fadeOut();
		$('.bvinv a').removeClass('icon_active');
		$(this).find('a').addClass('icon_active');
		$.ajax({
        	type: "get",
        	url: geturl + '/get_bubble_list', 
        	dataType: "JSON" // you want a difference between normal and ajax-calls, and json is standard
        }).success(function( msg ) {
		 	//console.log(msg);
		  	var searchfor = msg.idea.tags.join(" ");
		  	var searchControl = new google.search.SearchControl();
			options = new google.search.SearcherOptions();
			options.setExpandMode(google.search.SearchControl.EXPAND_MODE_PARTIAL);
			searchControl.addSearcher(new google.search.WebSearch(), options);
			searchControl.addSearcher(new google.search.BlogSearch(), options);
			searchControl.addSearcher(new google.search.ImageSearch());

			options = new google.search.SearcherOptions();
			options.setExpandMode(google.search.SearchControl.EXPAND_MODE_CLOSED);
			searchControl.addSearcher(new google.search.VideoSearch(), options);
			searchControl.addSearcher(new google.search.BookSearch(), options);
			searchControl.addSearcher(new google.search.PatentSearch(), options);
			var drawOptions = new google.search.DrawOptions();
			drawOptions.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);
			searchControl.draw(document.getElementById("searchcontrol"), drawOptions);
		  	searchControl.execute(searchfor);
		}).error(function(xhr, status, err) {
			//if (xhr.status == 401)
			//console.log("error");
			//console.log(err);
			//console.log(xhr);
		});
	});

	$('.word > .close').click(function (e) {
		e.preventDefault();
		console.log($(this).siblings('.term').text());
		$.ajax({
        	type: "post",
        	url: geturl + '/del_from_bubble_list', 
        	data: { bubblelist : { tag : $(this).siblings('.term').text() } }, 
        	dataType: "JSON" // you want a difference between normal and ajax-calls, and json is standard
        }).success(function( msg ) {
		 	//console.log(msg);
		}).error(function(xhr, status, err) {
			//if (xhr.status == 401)
			//console.log("error");
			console.log(err);
			//console.log(xhr);
		});
	});

});