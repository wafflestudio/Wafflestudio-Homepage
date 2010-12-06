// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var contactForm;

$(function(){

/*get tweets and show*/
  request_tweets('wafflestudio', 5)

/*timeline start*/
  $('#timeline li').tipsy({
    gravity: 's',
    fade: false,
    delayOut: 100,
    offset: 5
  })
  .each(function(){
    $(this).css('left', $('#timeline').width()*parseFloat($(this).attr('data-percent'))-$(this).width()/2);
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
}
function contactSendFail(xhr, status){
  //TODO: display the reason of failure
  var errors = $.parseJSON(xhr.responseText);
  var error_arr = [];
  $.each(errors, function(i, message){
    error_arr.push(message);
  });
  alert(error_arr.join('\n'));
}
function request_tweets(screen_name, count){
  $.ajax({
    data: {
      screen_name: screen_name,
      count: count,
      include_entities: true
    },
    url: 'http://api.twitter.com/1/statuses/user_timeline.json?callback=?',
    method: 'GET',
    dataType: 'jsonp',
    success: function(data){
      process_tweets(data);
    }
  });
}
function process_tweets(tweets){
  var processed_tweets = $.map(tweets, function(tweet){
    var processed_tweet = {};
    processed_tweet.text = linkify_entities(tweet);
    processed_tweet.time = relativeTime(tweet.created_at);
    return processed_tweet;
  });
  $('#tweet_template').tmpl(processed_tweets).appendTo('#tweetbox');
}
function relativeTime(pastTime){
  var toParse = pastTime.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC");
  var origStamp = Date.parse(toParse);
  var curDate = new Date();
  var curStamp = curDate.getTime();
  var diff = parseInt((curStamp - origStamp)/1000);

  if(diff < 0) return false;
  if(diff <= 5) return "Just now";
  if(diff <= 20) return "Seconds ago";
  if(diff <= 60) return "A minute ago";
  if(diff <= 3600) return parseInt(diff/60) + "minutes ago";
  if(diff <= 1.5*3600) return "One minutes ago";
  if(diff <= 23.5*3600) return Math.round(diff/3600)+ "hours ago";
  if(diff <= 1.5*24*3600) return "One day ago";
  if(diff <= 29.5*24*3600) return Math.round(diff/(3600*24))+ "days ago";
  return Math.round(diff/(3600*24*30))+"months ago";

  //if longer, absolute time

}
