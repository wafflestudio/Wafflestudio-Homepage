$(function(){
	$('nav.navigation a').hover(function(){
		$(this).addClass('hover');
	}, function(){
		$(this).removeClass('hover');
	});
  request_tweets();
  init_carousel();
  init_timeline();
  init_members();
  init_projects();
  init_contact_form();
});

function init_timeline(){
  $('#timeline li').tipsy({
    gravity: 's',
    fade: true,
    delayOut: 50,
    offset: 5
  })
  .each(function(){
    $(this).css('left', $('#timeline').width()*parseFloat($(this).attr('data-percent'))+$(this).width());
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
      request_project(value, false);
      break;
    case 'member': 
      //TODO:request_member as callback of scrolling to member section
      request_member(value, false);
      break;
  }
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
  $('.reload_tweet').click(request_tweets);
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
  if(replace){
    $('#cboxLoadedContent').addClass('loading')
    .children('.member_popup').fadeOut(50, function(){
      $(this).remove();
    });
  }
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
  $('#member_template').tmpl(member).attr('id', 'member_popup').hide().appendTo('#cboxLoadedContent').fadeIn(100, function(){
    $('#cboxLoadedContent').removeClass('loading');
  });
  init_member_popup();
}
function show_next_member(){
  var next = next_member(); 
  if(!next) return;
  var id = next.attr('data-id');
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
  var id = prev.attr('data-id');
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
    else if(e.keyCode == 39 && next_member()){
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
  if(prev_member())
    $('.member_popup .nav .prev').click(show_prev_member);
  else
    $('.member_popup .nav .prev').addClass('disabled');
  if(next_member())
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
  $('.member_popup .projects .caption').hide()
  $('.member_popup .projects li').hover(function(){
    $(this).children('.caption').stop().fadeIn(300, function(){$(this).css('opacity', 1);});
  }, function(){
    $(this).children('.caption').stop().fadeOut(300);
  })
  .click(function(){
    member_to_project($(this).attr('data-id'));
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
    var id = $(this).attr('data-id');
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
  //TODO:choco&cream/jam separation
}
function init_projects(){
  var projects = $('.project');
  projects.click(function(){
    var id = $(this).attr('data-id');
    request_project(id, false);
  });
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
function request_project(id, replace){
  /*
  $('.member').removeClass('current');
  $('#member_'+id).addClass('current');
  */
  $('.project').removeClass('current');
  $('#project_'+id).addClass('current');
  var success_callback = replace? replace_member:show_member;
  if(replace){
    $('#cboxLoadedContent').addClass('loading')
    .children('.project_popup').fadeOut(50, function(){
      $(this).remove();
    });
  }
  var success_callback = replace? replace_project:show_project;
  if(replace){
    $('#cboxLoadedContent').addClass('loading')
    .children('.member_popup').fadeOut(50, function(){
      $(this).remove();
    });
  }
  $.ajax({
    dataType: 'json',
    url: '/projects/'+id,
    success: success_callback
  });
}
function show_project(data){
  var project = data.project;
  $('#invisible').empty();
  $('#project_template').tmpl(project).attr('id', 'project_popup').appendTo('#invisible');
  $.colorbox({
    inline: true,
    href: '#project_popup',
    onLoad: project_bind_key_nav,
    onComplete: init_project_popup,
    onCleanup: project_unbind_key_nav
  });
}
function replace_project(data){
  var project = data.project;
  $('#project_template').tmpl(project).attr('id', 'project_popup').hide().appendTo('#cboxLoadedContent').fadeIn(100, function(){
    $('#cboxLoadedContent').removeClass('loading');
  });
  init_project_popup();
}
function init_project_popup(){
  window.keyNav = true;
  if(prev_project())
    $('.project_popup .nav .prev').click(show_prev_project);
  else
    $('.project_popup .nav .prev').addClass('disabled');
  if(next_project())
    $('.project_popup .nav .next').click(show_next_project);
  else
    $('.project_popup .nav .next').addClass('disabled');
  var screenshots = $('.project_popup .screenshots li');
  var thumbnails = $('.project_popup .thumbnails li');
  screenshots.eq(0).css('z-index', 1).addClass('cur');
  thumbnails.eq(0).addClass('cur');
  thumbnails.click(function(){
    var index = thumbnails.index($(this));
    var cur = screenshots.eq(index);
    if(cur.hasClass('cur') || window.changing) return;
    thumbnails.removeClass('cur');
    $(this).addClass('cur');
    window.changing = true;
    cur.hide().css('z-index', 2).fadeIn(500, function(){
      window.changing = false;
      screenshots.not(cur).css('z-index', 0).removeClass('cur');
      cur.css('z-index', 1).addClass('cur');
    });
  });
  $('.project_popup .members .caption').hide()
  $('.project_popup .members li').hover(function(){
    $(this).children('.caption').stop().fadeIn(300, function(){$(this).css('opacity', 1);});
  }, function(){
    $(this).children('.caption').stop().fadeOut(300);
  })
  .click(function(){
    project_to_member($(this).attr('data-id'));
   });
}
function show_next_project(){
  var next = next_project();
  if(!next) return;
  var id = next.attr('data-id');
  request_project(id, true);
}
function next_project(){
  var next = $('.project.current').next();
  if(next.length > 0)
    return next;
  else
    return false;
}
function show_prev_project(){
  var prev= prev_project();
  if(!prev) return;
  var id = prev.attr('data-id');
  request_project(id, true);
}
function prev_project(){
  var prev = $('.project.current').prev();
  if(prev.length > 0)
    return prev;
  else
    return false;
}
function project_bind_key_nav(){
  window.keyNav = true;
  $(document).bind('keydown.project_nav', function(e){
    if(!window.keyNav) return;
    if(e.keyCode == 37 && prev_project()){
      window.keyNav = false;
      show_prev_project();
    }
    else if(e.keyCode == 39 && next_project()){
      window.keyNav = false;
      show_next_project();
    }
  });
}
function project_unbind_key_nav(){
  window.keyNav = false;
  $(document).unbind('keydown.project_nav');
}
function member_to_project(id){
  $(document).one('cbox_closed', function(){
    request_project(id, false);
  });
  $.colorbox.close();
}
function project_to_member(id){
  $(document).one('cbox_closed', function(){
    request_member(id, false);
  });
  $.colorbox.close();
}
