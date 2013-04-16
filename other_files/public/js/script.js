/* Let´s setup the HTML5 localStorage and some functions to help us carry info from one screen to the other. */
var db = null;
function html5_storage_support() {
  try {
    return 'localStorage' in window && window['localStorage'] == null;
  } catch (e) {
    return false;
  }
}
//CHECK TO SEE IF THE BROWSER IS COMPATIBLE 
if (!html5_storage_support) {
  alert("This Might Be a Good Time to Upgrade Your Browser or Turn On Jeavascript");
} else {
  
	//OPEN AND OR CREATE THE DATABASE ON THE USERS MACHINE
	db = openDatabase("inspiratio", "1", "Inspiratio App Data", 100000);
  
	function storeClickedIMGSrc(self) {
		var clickedSrc = self.attr('src');
		localStorage.setItem('clickedSrc',clickedSrc);
		console.log(clickedSrc);
	}
  //GET STORED VALUES FROM KEYS TO DEFINE JAVASCRIPT VALUES OR DEFINE IF THEY DO NOT EXIST
  function getClickedIMGSrc() {
    if ( localStorage.getItem('clickedSrc')) {
      	var src = localStorage.getItem('clickedSrc')
      	$('.individual .preview img').attr('src',src)
      	//console.log(src);
      	//console.log('get ran');
    }
  }

  function clearLocal() {
    clear: localStorage.clear(); 
    return false;
  }
}

$(function() {
	var shown = false;
	
	
	$('#username, #password').click(function(e){
		if( $('.arrow_box').is(':visible') ) {
			$('.arrow_box').fadeOut('normal');
		} else {
			if (!shown) {
				$('.arrow_box').fadeIn('fast').delay(1300).fadeOut(400);
				shown = true;
			}
		}
		e.stopPropagation();
		
	});
	
	dpd.ideas.get(function (ideas, err) {
	  if(err) return console.log(err);
	  console.log(ideas);
	 loadIdeas();
	  
	});
	
	var ideasContainer = $('#showIdeas');
	
	function loadIdeas() {
		dpd.ideas.get(function(ideas, error) { //Use dpd.js to send a request to the backend
		  ideasContainer.empty(); //Empty the list
		    ideas.forEach(function(idea) { //Loop through the result
		    addIdeas(idea); //Add it to the DOM.		    
		  });
		});
	}

	function addIdeas(idea) {
	  
	var html = '<article>'																			   ;
		html +=		'<header>'																		   ;
		html +=			'<img src="imgs/avatar.png" alt="avatar" width="80" height="80">'			   ;
		html +=			'<span class="username">' + idea.username + '</span>						'  ;
		html +=			'<span class="location">San Francisco, CA</span>				'			   ;
		html +=			'<button type="button" name="" value="" class="follow"></button>'			   ;    
		html +=		'</header>				  '														   ;
			   	
		html +=		'<div class="preview">	  '														   ;
		html +=			'<a href="individual.htm">'													   ;
		html +=				'<img src="' + idea.idea + '" alt="img_dummy_idea">'				   ;
		html +=			'</a>					  '													   ;
		html +=		'</div>					  '														   ;
			   	
		html +=		'<footer class="clearfix">'														   ;
		html +=			'<div>					  '													   ;
		html +=				'<span class="comments number">' +  + '</span>				  '			   ;
		html +=			'</div>					  '													   ;
		html +=			'<div>					  '													   ;
		html +=				'<span class="files number">' + idea.likes + '</span>					  ';
		html +=			'</div>					  '													   ;
		html +=			'<div>					  '													   ;
		html +=				'<span class="views number">' + idea.views + '</span>					  ';
		html +=			'</div>					  '													   ;
		html +=		'</footer>'																		   ;
		html += '</article>' 																		   ;
	
		ideasContainer.append(html);
	}    
	
	//login
	$('#signin').click(function(){
		loginuser();
	});
	
	// Get the current user or check if user is logged in..
	//
	dpd.users.me(function (me) {
	//
	// If the user is logged in, display the name.
	//
		//console.log(me.name);
		if(window.location.pathname != "/dashboard.html" ){
			if(me.name != undefined){
				$('#signinreg').empty()
				.append("Welcome back <br />" + me.name)
				.append('<br /><a href="/dashboard.html">Click here to go your Dashboard</a>')
				.css('color', '#000000');
			}
		} else {
			//
			$('#signinreg .username').empty()
			.append(me.name)
		}
	//

	});
	
	//logout
	$('.logout').click(function(){
		dpd.users.logout(function(err) {
		  if(err) console.log(err);
		  window.location = '/index.htm';
		});
	});
	
	//!uploader

	
	/*

	$('#signin, #register').click(function(){
		var url = "dashboard.html";
		$(location).attr('href',url);
	});
	
*/
	$('.preview img').click(function(){
		storeClickedIMGSrc($(this));
	});
		
	
	$(".idea").click(function(){     
		window.location=$(this).find(".ideaTitle > a").attr("href");     
		return false;
	});
	
	//masonry	
	var $container = $('#showIdeas');

	setTimeout(function() {
		$container.imagesLoaded( function(){
		  $container.masonry({
		    	itemSelector : 'article',
		    	// set columnWidth a fraction of the container width
				columnWidth: function( containerWidth ) {
				console.log(containerWidth / 3);
					return containerWidth / 3;
				},
				isResizable: true 
		  });
		});
	}, 1300);

});

//function to both detect the Enter press, then run a subsequent function if Enter press is detected
function runFunctionIfEnter(e, fnName){ // the arguments here are the event (needed to detect which key is pressed), and the name of the resulting function to run if Enter has been pressed.

var keynum; // establish variable to contain the value of the key that was pressed

    // now, set that variable equal to the key that was pressed

    if(window.event) // ID
    { keynum = e.keyCode;}
    else if(e.which) // other browsers
    { keynum = e.which;}

    if(keynum == 13){  // if the key that was pressed was Enter (ascii code 13)
        eval(fnName)(); // run the resulting function name that was specified as an argument
    }
}

$('#password').keypress(function(e){
    runFunctionIfEnter(e, 'loginuser');
});


function loginuser() {
	var username = $('#username').val();
		var pass = $('#password').val();
		
		dpd.users.login({"username":username, "password":pass}, function(user, err) {
		  if(err) return console.log(err);
		  console.log('loggin success!!');
		  console.log(user);
		  dpd.users.me(function(me) {
			  console.log("Your info:");
			  console.log(me);
			  $('#signinreg').empty()
			  .append("Welcome " + me.name)
			  .css('color', '#000000');
			  window.location = '/dashboard.html';
		  });
		});
}
