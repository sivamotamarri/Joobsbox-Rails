$(document).ready(function() {
	$('div.inner').wrap('<div class="outer"></div>');

	$("#searchInput").click(function(ev) {
		$(ev.target).attr("value", "");
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
