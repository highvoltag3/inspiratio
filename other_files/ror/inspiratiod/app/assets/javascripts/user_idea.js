jQuery(document).ready(function($) {
	$('.bvinv').click(function(){
		$('#bubbleView').fadeIn();
	});
	$('.lvinv').click(function(){
		$('#bubbleView').fadeOut();
	});
});