$(document).ready(function($) {

	$('.bvinv').click(function(){
		console.log('Show bubble View clicked');
		$('#bubbleView').fadeIn();

	});
	
	$('.lvinv').click(function(){
		$('#bubbleView').fadeOut();
	});

});