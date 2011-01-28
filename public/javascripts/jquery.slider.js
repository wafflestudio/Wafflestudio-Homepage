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

		this.children('li').map(function(){
			var img_container = $('<div />', {
				className: settings.prefix+'_img_container',
				click: function(e){
					if(settings.onClick)
						settings.onClick($(this).find('img'));
				}
			}).css({
				float: 'left'
			}).append(
				$(this).children('img').clone()
			);
			img_container.appendTo(slider)
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
