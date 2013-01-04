
$(document).ready(function(){
 function CSRFProtection(xhr) {
 var token = $('meta[name="csrf-token"]').attr('content');
 if (token) xhr.setRequestHeader('X-CSRF-Token', token);
}
if ('ajaxPrefilter' in $) $.ajaxPrefilter(function(options, originalOptions, xhr) { CSRFProtection(xhr); });
else $(document).ajaxSend(function(e, xhr) { CSRFProtection(xhr); });

});

$(document).ready(function() {
	$('div.inner').wrap('<div class="outer"></div>');

	$("#searchInput").click(function(ev) {
		$(ev.target).attr("value", "");
	});

        alertInfo();

        $('#sign_me').click(function(){
          login();
        });
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

function hideErrorMessages() {
    $('.error').slideUp(200);
    $('.error').html('');
}

function showErrorMessages() {
  $('.error').slideDown(200);
}


function login() {

var email = $('#user_email').val();

var password = $('#user_password').val();

var data = {remote: true, commit: "Sign in", user: {remember_me: 1, password: password, email: email}};

$.post('/users/sign_in.json', data, function(resp) {

if(resp.success) {
  window.location = resp.redirect
// process success case

} else {
$('.error').html(resp.errors)
setTimeout(showErrorMessages, 500);
setTimeout(hideErrorMessages, 2500);


// let the user know they failed authentication

}

});

return false;

}