/*
 * jQuery Slider Plugin
 * developed with jQuery v1.4.4
 * version: 0.10 (2011-01-28)

 * Author: Hoseong Hwang
 *   http://thefron.me 
 */


(function($){
	$.fn.slider = function(options) {

		var settings = {
			prefix: 'thefron',
			onClick: undefined,
			duration: 3000,
			animateTime: 500,
			startIndex: 0,
			useCaption: false
		};
		if(options){
			$.extend(settings, options);
		}

		var box = $('<div />', {
			id: settings.prefix+'_box'
		}).css({
			overflow: 'hidden',
			width: settings.maxWidth,
			height: settings.maxHeight
		});

		var slider = $('<div />', {
			id: settings.prefix+'_slider'
		}).css({
			width: '99999px',
			position: 'absolute',
			top: '0px'
		});

		this.children('li').map(function(i){
			var li = $(this);
			var img_container = $('<div />', {
				className: settings.prefix+'_img_container',
				click: function(e){
					if(settings.onClick)
						settings.onClick($(this).find('img'));
				},
				id: settings.prefix+'_img_container_'+i
			}).css({
				float: 'left'
			}).append(
				li.children('img').clone()
			);
			img_container.appendTo(slider).data({
				name: li.children('.name:eq(0)').text(),
				subtitle: li.children('.subtitle:eq(0)').text()
			});
			if(settings.useCaption){
				var caption = $('<div />', {
					className: settings.prefix+'_img_caption',
					id: settings.prefix+'_img_caption_'+i
				}).append(
					$('<div />').addClass('name').text(img_container.data('name'))
				).append(
					$('<div />').addClass('subtitle').text(img_container.data('subtitle'))
				).appendTo(img_container);
				if(i != settings.startIndex) caption.hide();
			}
		});
		this.hide().after(box.append(slider));

		var num_loaded = 0;
		var num_total = box.find('img').length;
		box.find('img').load(function(){
			num_loaded++;
			if(num_loaded >= num_total) init();
		});

		var isRight = true;

		function init(){
			var cur_i = $('.'+settings.prefix+'_img_container').eq(settings.startIndex);
			go_to(cur_i, false)
			var animate_id = null;
			var startAnimate = function(){
				animate_id = setInterval(function(){
					cur_i = get_next(cur_i);
					go_to(cur_i, true);
				}, settings.duration);
			};

			startAnimate();

			box.hover(function(){
				clearInterval(animate_id);
			}, function(){
				startAnimate();
			});
		}

		function go_to(img, animate){
			var left = (box.width()/2) - (img.position().left + img.width()/2);
			var tmp = (img.width()/2);
			if(animate){
				slider.animate({'left': left}, settings.animateTime, function(){
				});
				$('.'+settings.prefix+'_img_caption').not(img.find('.'+settings.prefix+'_img_caption')).fadeOut();
				img.find('.'+settings.prefix+'_img_caption').fadeIn();
			}
			else{
				slider.css('left', left);
			}
		}

		function get_next(cur){

			if(cur.next().length == 0 && cur.prev().length == 0)
				return cur;

			if(isRight){
				var next = cur.next();
				if(next.length > 0){
					return next;
				}
				else{
					isRight = false;
					return get_next(cur);
				}
			}
			else{
				var next = cur.prev();
				if(next.length > 0){
					return next;
				}
				else{
					isRight = true;
					return get_next(cur);
				}
			}
		}

		return this;
	};
})(jQuery);
