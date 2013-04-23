$(document).ready(function($) {

	$('.bvinv').click(function(){
		//console.log('Show bubble View clicked');
		$('#bubbleView').fadeIn();
		$('.lvinv a').removeClass('icon_active');
		$(this).find('a').addClass('icon_active');

	});
	
	$('.lvinv').click(function(){
		$('#bubbleView').fadeOut();
		$('.bvinv a').removeClass('icon_active');
		$(this).find('a').addClass('icon_active');
	});

});