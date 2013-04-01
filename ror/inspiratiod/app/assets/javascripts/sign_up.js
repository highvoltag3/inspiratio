$(document).ready(function(){
  $('#register').click(function() {
    var data = {
      username: $('#username').val(),
      password: $('#password').val(),
      name: $('#name').val()
    };
    dpd.users.post(data, function(){                  
      window.location = '/';
    });
  });
});
