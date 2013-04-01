$(document).ready(function() {


	$('.addidea').click(function(){
		$('.newideabox').trigger('click');		
	});

	$('.newideabox').toggle(function() {
		  $('.controls').css('height', '600');
		  //$('#files-table tbody').empty();
		}, 
		function() {
		  $('.controls').css('height','0');
		}
	);
	
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

	
//masonry	
	var $container = $('#ideas');

	setTimeout(function() {
		$container.imagesLoaded( function(){
		  $container.masonry({
		    	itemSelector : '.ideacontainer',
		    	// set columnWidth a fraction of the container width
				columnWidth: function( containerWidth ) {
				console.log(containerWidth / 3);
					return containerWidth / 3;
				},
				isResizable: true 
		  });
		});
	}, 1300);

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
