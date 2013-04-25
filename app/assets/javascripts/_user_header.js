$(document).ready(function() {

  $('#main, header a').click(function() {
    if ( $('#notificationsWrapper').is(':visible') ) {
         $('#notificationsWrapper').fadeOut('normal');
    }
  });



  $('#notificationsCircle').click(function(e) {
    if ( $('#notificationsWrapper').is(':visible') ) {
        var hideTimer = null;
        $('#notificationsWrapper').bind('mouseleave', function() {
            hideTimer = setTimeout(function() {
                $('#notificationsWrapper').fadeOut('normal');
                $('.count').html('0');
            }, 1000);
        });

        
    } else {
      $('#notificationsWrapper').fadeIn('fast');
    }
    $(this).css('background', '#999');
    e.stopPropagation();
  });

  $('.notification .close').click(function (e) {
      //user has dismissed the notification.
      createCookie('notsViewed','yes',30);
      $('.count').html('0');
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

var avatar = $('.useravatar img').attr('src');
function makeComment() {
  var inputFiled = $('input.reply');
  var commentText = inputFiled.val();
  $('.triangle_top_notInput').before('<p class="well response"><img class="fl" src="' + avatar + '" alt="avatar" width="40" height="40">' + commentText + '</p>');
  inputFiled.val('');
  createCookie('notsViewed','yes',30);
}

jQuery(document).keypress(function(e) {
  runFunctionIfEnter(e, 'makeComment');
});