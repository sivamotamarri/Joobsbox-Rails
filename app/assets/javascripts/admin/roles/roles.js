//= require jquery
//= require jquery_ujs
//= require best_in_place.purr
//= require best_in_place


$(function() {
  $('.best_in_place').best_in_place();


   $('.trigger_on_error').bind("ajax:error",function(){
      $('.trigger_on_error').best_in_place();
   });

   

	var lastJobTrSelected = null;
	
	$('input[type="checkbox"]').attr("checked", false);
	
	
	$(".role_hook").click(function(){
          $("#role_me").toggle();
        })
	
	// Operation complete jqueryUI dialog init
	$('#operationDialog').dialog({
		bgiframe: true,
		modal: true,
		hide: 'highlight',
		autoOpen: false,	
		buttons: {
			Ok: function() {
				$(this).dialog('close');
			}
		}
	});


           
	
	
	// Expand job to show description
	$(".expand").click(function(ev) {
		expandJob($(this));
		
		$(ev).preventDefault();
	});
	
	// Keyboard interaction
	$(document).keyup(function(event){
		if(lastJobTrSelected) {
			if(event.keyCode == 107) {
				expandJob(lastJobTrSelected);
			}
		}
	});
});

function checkPending() {
  if($("#pending-postings tbody tr").length == 0) {
	  $("#pending").remove();
	}
}





function expandJob(job) {
	var x = job.closest('tr').next('tr.next');
	if($(x[0]).css('display') == "none") {
		x.css('display', 'table-row');
	} else {
		x.css('display', 'none');
	}
	job.closest('tr').toggleClass("noBorder");
}
