// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var contactForm;

$(function(){

/*contact form start*/
  contactForm = $('#new_contact');
  contactForm.ajaxForm({
    dataType: 'json',
    clearForm: true,
    success: contactSendSuccess,
    error: contactSendFail
  });
/*contact form end*/

});

function contactSendSuccess(response, status, xhr){
  //TODO: display activity indicator
  console.log(response);
}
var error;
function contactSendFail(xhr, status){
  //TODO: display the reason of failure
  var errors = $.parseJSON(xhr.responseText);
  var error_arr = [];
  $.each(errors, function(i, message){
    error_arr.push(message);
  });
  alert(error_arr.join('\n'));
}
