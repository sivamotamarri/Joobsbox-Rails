//= require jquery
//= require jquery_ujs
//= require best_in_place.purr
//= require best_in_place


$(function() {
  $('.best_in_place').best_in_place();


   $('.trigger_on_error').bind("ajax:error",function(){
      $('.trigger_on_error').best_in_place();
   });
    $('.trigger_on_error').bind("ajax:success",function(){
      $.ajax({
        url: "/admin/groups",
        dataType: "script"
        });
    });
   

	var lastJobTrSelected = null;
	
	$('input[type="checkbox"]').attr("checked", false);
	restoreEvents();


        // Select all button
	$("#selectAllUsers").click(function(){          
		if($(this).attr("checked")) {
			$("#pending-postings tbody tr td input[type=checkbox]").attr("checked", true);
			$("#pending-postings tbody tr").addClass("selected");
		} else {
			$("#pending-postings tbody tr td input[type=checkbox]").attr("checked", false);
			$("#pending-postings tbody tr").removeClass("selected");
		}
	});
	
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


           
	
	// Action buttons
	$("#acceptPostingsPending").click(function(ev) {		
		$.ajax({
			type: "POST",
			url: $("#form-pending").attr("action"),
			data: $("#form-pending").serialize(),
			success: function(msg){
                                $("#operationDialog").html(msg);
				$("#pending-postings tbody tr.selected").each(function() {
					$(this).fadeOut("slow", function(el) {
						$(this).next('tr.next').prependTo("#approved-postings tbody");
						var a = $(this);
                                                
						$(a).css("display", "table-row").removeClass("selected").contents('input[type="checkbox"]').checked = false;
						//$(a).find("td:nth-child(1)").remove();
                                                $('input[type="checkbox"]').attr("checked", false);
                                                $(a).prependTo("#approved-postings tbody");
                                                 $('.selected').removeClass('selected');
						//restoreEvents();
					});
				});
                                
				$('#operationDialog').dialog('open');
        setTimeout(checkPending, 1000);
        
			}
		 });
                 
	});


        $("#deletePostingsApproved").click(function(ev) {		
		$.ajax({
			type: "POST",
			url: $("#form-approved").attr("action"),
			data: $("#form-approved").serialize(),
			success: function(msg){
                                $("#operationDialog").html(msg);
				$("#approved-postings tbody tr.selected").each(function() {
					$(this).fadeOut("slow", function(el) {
                                          $(this).next('tr.next').prependTo("#pending-postings tbody");
                                          var a = $(this);
                                          $(a).css("display", "table-row").removeClass("selected").contents('input[type="checkbox"]').checked = false;
                                          $(a).prependTo("#pending-postings tbody");
                                          $('input[type="checkbox"]').attr("checked", false);
                                           $('.selected').removeClass('selected');
                                          //restoreEvents();
					//	$(this).next('tr.next').remove();
					//	$(this).remove();
					});
				});
				$('#operationDialog').dialog('open');
			}
		 });
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



function restoreEvents() {
  $('input[type="checkbox"]').attr("checked", false);
  $('.selected').removeClass('selected');
  // For each job, make the whole line clickable
	// Also checks the respective checkbox
	$("tbody tr.job").click(function(ev) {
		if($(ev.target).attr("tagName") == "A") {
			return;
		}

		lastJobTrSelected = $(this);

		var cb = $(this).find("input[type=checkbox]");
		cb = cb[0];
		$(this).toggleClass("selected");
		if($(ev.target).attr("tagName") != "INPUT") {
			$(cb).attr("checked", $(this).hasClass("selected"));
		}
	});
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
