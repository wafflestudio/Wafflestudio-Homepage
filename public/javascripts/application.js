$(function(){

  request_tweets();
  init_timeline();
  init_contact_form();

});

function init_timeline(){
  $('#timeline li').tipsy({
    gravity: 's',
    fade: false,
    delayOut: 100,
    offset: 5
  })
  .each(function(){
    $(this).css('left', $('#timeline').width()*parseFloat($(this).attr('data-percent'))-$(this).width()/2);
  });
}
function init_contact_form(){
  $('#new_contact').ajaxForm({
    dataType: 'json',
    clearForm: false,
    success: contact_send_success,
    error: contact_send_fail
  });
  $('#new_contact input[title]').tipsy({
    trigger: 'focus',
    fade: true,
    html: true,
    gravity: 'w'
  });
  $('#new_contact textarea[title]').tipsy({
    trigger: 'focus',
    fade: true,
    gravity: 'e'
  });
}
function contact_send_success(response, status, xhr){
  //TODO: display activity indicator
}
function contact_send_fail(xhr, status){
  //TODO: display the reason of failure
  var errors = $.parseJSON(xhr.responseText);
  var error_arr = [];
  $.each(errors, function(i, message){
    error_arr.push(message);
  });
  alert(error_arr.join('\n'));
}
function request_tweets(){
  $('#tweets').html('<li class="loading">Loading tweets...</li>');
  $.ajax({
    data: {
      screen_name: 'wafflestudio',
      count: 5,
      include_entities: true
    },
    url: 'http://api.twitter.com/1/statuses/user_timeline.json?callback=?',
    method: 'GET',
    dataType: 'jsonp',
    success: process_tweets,
    error: fail_loading_tweets
  });
}
function process_tweets(tweets){
  var processed_tweets = $.map(tweets, function(tweet){
    var processed_tweet = {};
    processed_tweet.text = linkify_entities(tweet);
    processed_tweet.time = relativeTime(tweet.created_at);
    return processed_tweet;
  });
  $('#tweets').empty();
  $('#tweet_template').tmpl(processed_tweets).hide().appendTo('#tweets').fadeIn();
}
function fail_loading_tweets(){
  $('#tweets').html('<li class="failed">Failed to load tweets. <a class="reload_tweet">Try again</a></li>');
  $('.reload_tweet').click(function(){
    request_tweets();
  });
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
}
