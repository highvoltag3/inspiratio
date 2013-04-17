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