
$(document).ready(function(){
 function CSRFProtection(xhr) {   
 var token = $('meta[name="csrf-token"]').attr('content');
 if (token) xhr.setRequestHeader('X-CSRF-Token', token);
}
if ('ajaxPrefilter' in $) $.ajaxPrefilter(function(options, originalOptions, xhr) { CSRFProtection(xhr); });
else $(document).ajaxSend(function(e, xhr) { CSRFProtection(xhr); });

});




    
$(function(){
	$("li.item").mouseenter(function() {
		$(this).addClass("hover");
	});
	$("li.item").mouseleave(function() {
		$(this).removeClass("hover");
	});
        alertInfo();
});
function alertInfo() {
  setTimeout(showFlashMessages, 500);
  setTimeout(hideFlashMessages, 2500);
}

function hideFlashMessages() {
    $('.alert').slideUp(200);
}

function showFlashMessages() {
  $('.alert').slideDown(200);
}

 