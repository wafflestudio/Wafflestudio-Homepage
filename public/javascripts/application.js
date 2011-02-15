$(function(){
	init_navigation();
  request_tweets();
  init_carousel();
  init_timeline();
  init_members();
  init_projects();
  init_contact_form();
  //팝업용 임시공간
	$('<div>').attr('id', 'invisible').appendTo($('body')).hide()
	//hover클래스가 필요한 것들
	$('nav.navigation a, #contact_submit, #top').hover(function(){
		$(this).addClass('hover');
	}, function(){
		$(this).removeClass('hover');
	});
});

function init_navigation(){
	//주 네비게이션 스크롤 기능
	$('nav.navigation li a').click(function(e){
		e.preventDefault();
		switch($(this).text()){
			case 'About Us':
				$('html, body').animate({
					scrollTop: $('#about_us').offset().top-100
				}, 1000);
				break;
			case 'Members':
				$('html, body').animate({
					scrollTop: $('#members').offset().top-40
				}, 1000);
				break;
			case 'Projects':
				$('html, body').animate({
					scrollTop: $('#projects').offset().top-100
				}, 1000);
				break;
			case 'Contact':
				$('html, body').animate({
					scrollTop: $('#contact').offset().top-50
				}, 1000);
				break;
		}
	});
	$('#top').click(function(e){
		e.preventDefault();
		$('html, body').animate({
			scrollTop: 0
		}, 1000);
	}).css({
		marginLeft: $('#container').width()/2-20
	});
}
function init_timeline(){
	//연혁에 내용물 뿌리고, 툴팁 적용
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
	//top section의 카로슬 활성화
  $('#slider').nivoSlider({
    slices: 8,
    animSpeed: 500,
    pauseTime: 5000,
    directionNav: false
  });
  var control = $('.nivo-controlNav');
  control.css('margin-left', -control.width()/2);
}
function slider_action(e, type, value){
	//top section 카로슬 개체 클릭 시 동작 지정
	e.preventDefault();
  switch(type){
    case 'url': 
      window.open(value);
      break;
    case 'project': 
			$('html, body').animate({
				scrollTop: $('#projects').offset().top-100
			}, 500, function(){
				request_project(value, false);
			});
      break;
    case 'member': 
			$('html, body').animate({
				scrollTop: $('#members').offset().top-40
			}, 500, function(){
				request_member(value, false);
			});
      break;
  }
}
function request_tweets(){
	//최신 트윗 가져오기
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
	//트위터 API로 가져온 데이터 처리
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
	//트윗 가져오기 실패했을 때
  $('#tweets').html('<li class="failed">Failed to load tweets. <a class="reload_tweet">Try again</a></li>');
  $('.reload_tweet').click(request_tweets);
}
function relativeTime(pastTime){
	//상대시간 계산
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
	//멤버 페이지 보여주기 replace는 팝업을 열면서 보여줄지, 열려있는 상태에서 다른 멤버를 보여줄지를 결정
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
	//멤버 팝업 열기
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
	//현재 열려있는 멤버 팝업 내용 교체하기
  var member = data.member;
  $('#member_template').tmpl(member).attr('id', 'member_popup').hide().appendTo('#cboxLoadedContent').fadeIn(100, function(){
    $('#cboxLoadedContent').removeClass('loading');
  });
  init_member_popup();
}
function show_next_member(){
	//다음 멤버 페이지 요청
  var next = next_member(); 
  if(!next) return;
  var id = next.attr('data-id');
  request_member(id, true);
}
function next_member(){
	//다음 멤버 알아오기
  var next = $('.member.current').next();
  if(next.length > 0)
    return next;
  else
    return false;
}
function show_prev_member(){
	//이전 멤버 페이지 요청
  var prev = prev_member();
  if(!prev) return;
  var id = prev.attr('data-id');
  request_member(id, true);
}
function prev_member(){
	//이전 멤버 알아오기
  var prev = $('.member.current').prev();
  if(prev.length > 0)
    return prev;
  else
    return false;
}
function member_bind_key_nav(){
	//키보드로 멤버 좌우 네비게이션
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
	//키보드로 멤버 좌우네비게이션 해제
  window.keyNav = false;
  $(document).unbind('keydown.member_nav');
}
function init_member_popup(){
	//멤버 팝업 오픈 후 내용 세팅해주기
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
	//멤버 리스트 초기화 
  var members = $('.member');
  var member_tags = $('#member_tags li');
  members.hover(function(){
  	//호버 시 슬라이드업 되면서 이름 보여줌
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
  	//멤버 태그 클릭시 해당멤버 보여주기
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
	//프로젝트 리스트 초기화
  $('#project_list').slider({
		onClick: function(el){
			var id = el.attr('data-id');
			request_project(id, false);
		},
		startIndex: 0,
		useCaption: true,
		duration: 6000
	});
}
function init_contact_form(){
	//컨택 폼 ajax로 동작하게
  $('#new_contact').ajaxForm({
    dataType: 'json',
    clearForm: true,
    success: contact_send_success,
    error: contact_send_fail,
    beforeSubmit: function(){
			var submit_btn = $('#contact_submit');
			if(submit_btn.hasClass('sending'))
				return false;
			$('#contact_submit').addClass('sending').val('Sending...');
		},
		complete: function(){
			$('#contact_submit').removeClass('sending').val('Send');
		}
  });
	//컨택 폼 툴팁
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
  //컨택 폼 전송 성공
  $.prompt('전송되었습니다');
}
function contact_send_fail(xhr, status){
	//컨택 폼 전송 실패시 메시지 띄우기
  var errors = $.parseJSON(xhr.responseText);
  var error_arr = [];
  $.each(errors, function(i, message){
    error_arr.push(message);
  });
  $.prompt(error_arr.join('\n'));
}
function request_project(id, replace){
	//프로젝트 페이지 요청 replace에 따라 팝업이 열리거나 열려있는 팝업의 내용물 대체
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
	//프로젝트 팝업 열기
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
	//열려있는 프로젝트 팝업에 다른 프로젝트 내용 불러오기
  var project = data.project;
  $('#project_template').tmpl(project).attr('id', 'project_popup').hide().appendTo('#cboxLoadedContent').fadeIn(100, function(){
    $('#cboxLoadedContent').removeClass('loading');
  });
  init_project_popup();
}
function init_project_popup(){
	//프로젝트 팝업 초기화
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
	//다음 프로젝트 페이지 요청
  var next = next_project();
  if(!next) return;
  var id = next.attr('data-id');
  request_project(id, true);
}
function next_project(){
	//다음 프로젝트 가져오기
  var next = $('.project.current').next();
  if(next.length > 0)
    return next;
  else
    return false;
}
function show_prev_project(){
	//이전 프로젝트 페이지 요청
  var prev= prev_project();
  if(!prev) return;
  var id = prev.attr('data-id');
  request_project(id, true);
}
function prev_project(){
	//이전 프로젝트 가져오기
  var prev = $('.project.current').prev();
  if(prev.length > 0)
    return prev;
  else
    return false;
}
function project_bind_key_nav(){
	//프로젝트 팝업 좌우 키보드 네비게이션
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
	//프로젝트 팝업 좌우 키보드 네비게이션 해제
  window.keyNav = false;
  $(document).unbind('keydown.project_nav');
}
function member_to_project(id){
	//멤버 팝업에서 프로젝트 클릭시
  $(document).one('cbox_closed', function(){
    request_project(id, false);
  });
  $.colorbox.close();
}
function project_to_member(id){
	//프로젝트 팝업에서 멤버 클릭시
  $(document).one('cbox_closed', function(){
    request_member(id, false);
  });
  $.colorbox.close();
}
