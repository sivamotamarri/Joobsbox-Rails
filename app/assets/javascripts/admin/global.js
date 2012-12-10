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