$(document).ready(function() {

	$('.addidea').click(function(){
    //because we are using CSS transitions we don't need slideDown or up or siletoggle here.
		if ( $('.controls').css('height') === '0px' ) {
      $('.controls').css('height', '600');
    }	else {
      $('.controls').css('height', '0'); 
    }      
	});
	
	$('#idea_tag_list').tagsInput({
      defaultText:'add a tag and press enter or use commas',
      minChars:2,
      width:'100%',
      autosize: false
  });

  //set the with for the tag input field.
  $('#idea_tag_list_addTag').addClass('span12');

  $('.cancelnewidea').click(function(e){
    e.preventDefault;
    $('.controls form').find("input[type=text], textarea").val("");
    $('.controls').delay(600).css('height', '0'); 
    $('.tagsinput > .tag').remove();
    return false;
  })
  
//  delete ideas
  $(".confirm").click(function (e) {
      e.preventDefault;
      openConfirmModal();
      return false;
  }); 

}); /* end on ready function */


function openConfirmModal() {
    $("#confirmDiv").confirmModal({
        heading: 'Are you sure?',
        body: 'You are about to completely destroy your idea, should we proceed?',
        btntype: 'btn-danger',
        confirmtext: 'Yes, Destroy!',
        callback: function () {
            $('.yesdelete').trigger('click');
        }
    });
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