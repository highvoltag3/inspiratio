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

/*
  function loadFiles() {
    dpd.files.get({$sort: {dateUploaded: 1}}, function(res) {
      $('#files-table tbody').empty();
      console.log("res:" + res);
      res.forEach(function(file) {
        $('#files-table tbody').append('<tr>' + 
          '<td><a href="/s3bucket/' + file.fileName + '" target="_blank">' + file.fileName + '</a></td>' +
          '<td>' + file.fileSize + ' bytes</td>' +
          '<td><a href="#" class="delete-link" data-file-id="' + file.id + '">Delete</a></td>' +
          '</tr>');
      });
    });
  }

  loadFiles();
*/   
 
  dpd.on('files:changed', loadExistingIdeas);  //dpd.on('files:changed', loadFiles);

  $('#files-table').on('click', '.delete-link', function() {
    var id = $(this).attr('data-file-id');
    dpd.files.del(id, function(res, err) {
      if (err) alert(err.message);
    });
    return false;
  });

  //darios
	function addidea(file) 
	{
		var idea = $("#ideaform").serializeObject();
		console.log(fileName);
		 
		dpd.ideas.post(
			{
				"title":idea.ideatitle,
				"description":idea.description,
				"private":idea.publicidea,"idea":"https://s3.amazonaws.com/inspiratiod/" + fileName,
				"tags":idea.tags
			}, 			
				function(result, err) {
				  if(err) return console.log(err);
				  console.log(result, result.id);
				}
		);
	}
	
	loadExistingIdeas();
	
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




	//lets load only my ideas
	function loadExistingIdeas() {
		var whoami = "";
		
  		dpd.users.me(function(me) {
			var query = {"ownerID":me.id};
	
			dpd.ideas.get(query, function (results) {
			  console.log(results);
			  loadIdeas(results);
			});	
		});
	}
  	
  	
	
	var ideasContainer = $('#ideas');
	
	function loadIdeas(results) {
		  ideasContainer.empty(); //Empty the list
		    results.forEach(function(idea) { //Loop through the result
		    addIdeas(idea); //Add it to the DOM.		    
		  });
	}

	function addIdeas(idea) {
	  
	var html = '<article class="ideacontainer">'																		;
		html +=		'<header>'																		   					;
		html +=			'<span class="title">' + idea.title + '</span>'							   						;
		html +=		'</header>				  '														   					;
			   	
		html +=		'<div class="preview">	  '														   					;
		html +=			'<a href="individual.htm">'													   					;
		html +=				'<img src="' + idea.idea + '" alt="img_dummy_idea">'				   						;
		html +=			'</a>					  '													   					;
		html +=		'</div>					  '														   					;
			   	
		html +=		'<footer class="clearfix">'														   					;
		html +=			'<div>					  '													   					;
		html +=				'<span class="comments number">' + userfriendlyresult(idea.comments) + '</span>'			;
		html +=			'</div>					  '													   					;
		html +=			'<div>					  '													   					;
		html +=				'<span class="files number">' + userfriendlyresult(idea.likes) + '</span>'					;
		html +=			'</div>					  '													   					;
		html +=			'<div>					  '													   					;
		html +=				'<span class="views number">' + userfriendlyresult(idea.views) + '</span>'					;
		html +=			'</div>					  '													   					;
		html +=		'</footer>'																		   					;
		html += '</article>' 																		   					;
	
		ideasContainer.append(html);
	}  
	
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
