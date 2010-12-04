// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var contactForm;

$(function(){

/*timeline start*/
  $('#timeline li>a').qtip({
    position: {
      corner: {target: 'topMiddle',
               tooltip: 'bottomMiddle'}
    },
    style: {name: 'dark', tip: 'bottomMiddle',
      border: {radius: 5},
      title: {'font-size': 8, 'color': 'black'}
    },
    show: {delay: 0}
  });
  $('#timeline li').each(function(){
    var anchor = $(this).children('a');
    $(this).css('left', $('#timeline').width()*parseFloat(anchor.attr('data-percent'))-anchor.width()/2);
  });
/*timeline end*/

/*contact form start*/
  contactForm = $('#new_contact');
  contactForm.ajaxForm({
    dataType: 'json',
    clearForm: false,
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
