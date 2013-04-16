$(document).ready(function() {

  $('#main, header a').click(function() {
    if ($('#notificationsWrapper').is(':visible')) {
      $('#notificationsWrapper').fadeOut('normal');
    }
  });

  $('#notificationsCircle').click(function(e) {
    if ($('#notificationsWrapper').is(':visible')) {
      $('#notificationsWrapper').fadeOut('normal');
    } else {
      $('#notificationsWrapper').fadeIn('fast');
    }
    $(this).css('background', '#999');
    e.stopPropagation();
  });

}); /* end on ready function */


function runFunctionIfEnter(e, fnName) {
  var keynum;
  if (window.event) {
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  }
  if (keynum == 13) {
    eval(fnName)();
  }
}

function makeComment() {
  var inputFiled = $('input.reply');
  var commentText = inputFiled.val();
  $('.triangle_top_notInput').before('<p class="response"><img class="fl" src="imgs/avatar.png" alt="avatar" width="40" height="40">' + commentText + '</p>');
  inputFiled.val('');
}

jQuery(document).keypress(function(e) {
  runFunctionIfEnter(e, 'makeComment');
});