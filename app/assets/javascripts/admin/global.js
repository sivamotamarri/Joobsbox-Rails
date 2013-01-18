
$(document).ready(function(){
 function CSRFProtection(xhr) {   
 var token = $('meta[name="csrf-token"]').attr('content');
 if (token) xhr.setRequestHeader('X-CSRF-Token', token);
}
if ('ajaxPrefilter' in $) $.ajaxPrefilter(function(options, originalOptions, xhr) {CSRFProtection(xhr);});
else $(document).ajaxSend(function(e, xhr) {CSRFProtection(xhr);});





            $('#permission_m_manage').click(function(){
                $(".perms input[type=checkbox]").attr("checked", false);
                $('#permission_limited').val('');
                $('.perms').hide();             
            });
             $('#permission_m_').click(function(){
               if($(this).attr("checked")){
                  $('.perms').show();
                }
             });

               if($('#permission_m_').attr("checked")){
                  $('.perms').show();
                  $('#permission_limited').val('1');
                }

             $(".perms input[type=checkbox]").click(function(){
               if($(this).attr("checked")){
                 $('.error').hide();
                  $('#permission_limited').val('1');
               }
             });


         



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


function validate(){
  if($("#permission_m_manage").attr("checked")){
    return true
  }else{
    if($(".perms input:checkbox:checked").length > 0){
      return true;
    }else{
      $('.error').show();
      return false;
    }
  }
}

 