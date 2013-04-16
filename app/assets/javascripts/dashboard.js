$(document).ready(function() {

	$('.addidea').click(function(){
    //because we are using CSS transitions we don't need slideDown or up or siletoggle here.
		if ( $('.controls').css('height') === '0px' ) {
      $('.controls').css('height', '600');
    }	else {
      $('.controls').css('height', '0'); 
    }      
	});
	
	$('#tags_p').tagsInput();


  $('#upload-panel').on('dragover', function() {
    $(this).addClass('hover');
    return false;
  });

  $('#upload-panel').on('dragleave', function() {
    $(this).removeClass('hover');
    return false;
  });

  $('#upload-panel').on('drop', function(e) {
    $(this).removeClass('hover');
    var files = e.originalEvent.dataTransfer.files;

    for (var i = 0; i < files.length; i++) {
      
      uploadFile(files[i]);
      addidea(files[i]);
    };

    return false;
  });
  
  var fileName = '';
  
  function uploadFile(file) {
    var $panel = $('<div>').addClass('indicator').append('<p>Uploading ' + file.name + '</p>')
      , $progress = $('<div>').addClass('progress').addClass('progress-striped')
        .addClass('active').appendTo($panel).append('<div class="bar" style="width: 100%"></div>');
        fileName = file.name;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/s3bucket/' + file.name, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
    xhr.upload.onprogress = function(e) {
      var progress = e.loaded / e.total; 
      console.log(progress);
      $progress.find('.bar').css('width', $panel.width() * progress);
    };
    xhr.onload = function() {
      $progress.remove();
      $panel.append('<p>Finished!</p>');
      setTimeout(function() {
      	$('.newideabox').trigger('click');
        $panel.remove();
      }, 2000);
    };

    $('#uploads').append($panel);
  }

  //delete ideas
  // $(".confirm").easyconfirm({
  //   locale: {
  //     title: 'Are you sure?',
  //     button: ['No', 'Yes']
  //   }
  // });

  // $(".confirm").click(function() {
  //   $(this).closest('.idea').fadeOut('slow');
  // });

}); /* end on ready function */


	
function userfriendlyresult(what) {
	response = (what == "undefined") ? what : "0";
	return response;	
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};