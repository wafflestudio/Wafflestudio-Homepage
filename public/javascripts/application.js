$(function(){

  request_tweets();
  init_carousel();
  init_timeline();
  init_members();
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
function init_carousel(){
  $('#slider').nivoSlider({
    slices: 8,
    animSpeed: 500,
    pauseTime: 5000,
    directionNav: false
  });
  var control = $('.nivo-controlNav');
  control.css('margin-left', -control.width()/2);
}
function slider_action(type, value){
  switch(type){
    case 'url': 
      window.open(value);
      break;
    case 'project': 
      alert(value);
      break;
    case 'member': 
      alert(value);
      break;
  }
}
function init_contact_form(){
  $('#new_contact').ajaxForm({
    dataType: 'json',
    clearForm: true,
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
  alert('전송되었습니다');
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
      count: 4,
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
function request_member(id, replace){
  $('.member').removeClass('current');
  $('#member_'+id).addClass('current');
  var success_callback = replace? replace_member:show_member;
  $.ajax({
    dataType: 'json',
    url: '/members/'+id,
    success: success_callback
  });
}
function show_member(data){
  var member = data.member;
  $('#invisible').empty();
  $('#member_template').tmpl(member).attr('id', 'member_popup').appendTo('#invisible');
  $.colorbox({
    inline: true,
    href: '#member_popup',
    onLoad: member_bind_key_nav,
    onComplete: init_member_popup,
    onCleanup: member_unbind_key_nav
  });
}
function replace_member(data){
  var member = data.member;
  $('#invisible').empty();
  $('#cboxLoadedContent .member_popup').fadeOut(100, function(){
    $(this).remove();
    $('#member_template').tmpl(member).attr('id', 'member_popup').hide().appendTo('#cboxLoadedContent').fadeIn(100);
    init_member_popup();
  });
}
function show_next_member(){
  var next = next_member(); 
  if(!next) return;
  var id = next.attr('id').split('_')[1];
  request_member(id, true);
}
function next_member(){
  var next = $('.member.current').next();
  if(next.length > 0)
    return next;
  else
    return false;
}
function show_prev_member(){
  var prev = prev_member();
  if(!prev) return;
  var id = prev.attr('id').split('_')[1];
  request_member(id, true);
}
function prev_member(){
  var prev = $('.member.current').prev();
  if(prev.length > 0)
    return prev;
  else
    return false;
}
function member_bind_key_nav(){
  window.keyNav = true;
  $(document).bind('keydown.member_nav', function(e){
    if(!window.keyNav) return;
    if(e.keyCode == 37 && prev_member()){
      window.keyNav = false;
      show_prev_member();
    }
    if(e.keyCode == 39 && next_member()){
      window.keyNav = false;
      show_next_member();
    }
  });
}
function member_unbind_key_nav(){
  window.keyNav = false;
  $(document).unbind('keydown.member_nav');
}
function init_member_popup(){
  window.keyNav = true;
  if($('.member.current').prev().length)
    $('.member_popup .nav .prev').click(show_prev_member);
  else
    $('.member_popup .nav .prev').addClass('disabled');
  if($('.member.current').next().length)
    $('.member_popup .nav .next').click(show_next_member);
  else
    $('.member_popup .nav .next').addClass('disabled');
  $('.skills li').each(function(){
    var li = $(this);
    var skill = li.text();
    var degree = li.attr('data-degree');
    var label = $('<label>').addClass('skill_label').text(skill);
    var bar = $('<span>').addClass('skill_bar');
    li.text('')
    .append(label)
    .append(bar);
    bar.delay(300).animate({width: (li.width()-2)*parseFloat(degree/100)});
  });
}
function init_members(){
  var members = $('.member');
  var member_tags = $('#member_tags li');
  members.hover(function(){
    $(this).children('.member_thumb').stop().animate({'top': '-17px'}, 150);
  }, function(){
    $(this).children('.member_thumb').animate({'top': '0px'}, 150);
  }).each(function(){
    var tags = $(this).attr('data-tags').split(',');
    tags = $.map(tags, function(tag){
      return tag.split(' ').join('');
    });
    $(this).addClass(tags.join(' '));
  }).click(function(){
    var id = $(this).attr('id').split('_')[1]
    request_member(id, false);
  });
  member_tags.click(function(){
    var tag = $(this);
    if(!tag.hasClass('on')){
      members.removeClass('disabled on');
      var tag_str = tag.text().split(' ').join('');
      members.not('.'+tag_str).addClass('disabled');
      members.filter('.'+tag_str).addClass('on');
      member_tags.not(tag[0]).removeClass('on');
      tag.addClass('on');
    }
    else{
      members.removeClass('disabled on');
      tag.removeClass('on');
    }
  });
}
