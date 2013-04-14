$(document).ready(function(){
  $('#register').click(function() {
    var data = {
      username: $('#username').val(),
      password: $('#password').val(),
      name: $('#name').val()
    };
  });

  $('.mainnav').find('.selected').removeClass('selected');
  $('.mainnav #lg').parent().addClass('selected');

});
