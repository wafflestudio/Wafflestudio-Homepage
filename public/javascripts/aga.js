/**
 * Aga v1.03
 * http://squareflower.de/downloads/jquery/aga/
 *
 * Copyright 2010, Lukas Rydygel
 * Attribution-ShareAlike 3.0 Unported
 * http://creativecommons.org/licenses/by-sa/3.0/
 */
(function($) {

    $.fn.aga = function(method) {
		
        var FN = function() {},
            POINTER = 'aga-pointer',
            SETTINGS = 'aga-settings',
            HORIZONTAL = 'horizontal',
            VERTICAL = 'vertical',
            OBJECT = 'object',
            FUNCTION = 'function',
            CLICK = 'click',
            HOVER = 'hover',
            MOUSEENTER = 'mouseenter',
            MOUSELEAVE = 'mouseleave',
            LEFT = 'left',
            RIGHT = 'right',
            TOP = 'top',
            BOTTOM = 'bottom',
            VARIABLE = 'variable',
            CLASS = [];
		
        CLASS[HORIZONTAL] = ['aga-horizontal', 'aga-horizontal-item', 'aga-horizontal-item-open'],
        CLASS[VERTICAL] = ['aga-vertical', 'aga-vertical-item', 'aga-vertical-item-open'];

        var settings = {
            easing: ['', ''],
            size: {
                min: 20,
                max: VARIABLE
            },
            handler: function(element) {
                return $(element);
            },
            orientation: HORIZONTAL,
            direction: LEFT,
            start: 0,
            action: CLICK,
            stayOpen: true,
            animationTime: 500,
            hoverTime: 500,
            items: 'li',
            open: {
                before: FN,
                each: FN,
                after: FN
            },
            close: {
                before: FN,
                each: FN,
                after: FN
            }
        },
		
        pointer = settings.start,
        timeout,

        methods = {

            _getItems: function() {
                return $(this).children(settings.items);
            },
			
            _getSize: function() {

                switch (settings.orientation) {

                    case HORIZONTAL:
                        return $(this).width();
                    break;

                    case VERTICAL:
                        return $(this).height();
                    break;

                }
				
            },

            _getAnimationProperties: function(key, value) {

                switch (key) {

                    case TOP:
                        return {'top':value};
                    break;

                    case RIGHT:
                        return {'right':value};
                    break;

                    case BOTTOM:
                        return {'bottom':value};
                    break;

                    case LEFT:
                        return {'left':value};
                    break;
					
                    case HORIZONTAL:
                        return {'width':value};
                    break;
					
                    case VERTICAL:
                        return {'height':value};
                    break;

                }

            },

            _setOptions: function(options) {

                $.extend(true, settings, method);

                $(this).data(SETTINGS, settings);

            },

            _getOptions: function() {
                return $(this).data(SETTINGS);
            },

            options: function(options) {
                return (typeof options === OBJECT) ? methods._setOptions.apply(this, [options]) : methods._getOptions.apply(this);
            },

            init: function(options) {

                methods._setOptions.apply(this, [options]);

                $(this).data(POINTER, pointer).addClass(CLASS[settings.orientation][0]);

                var obj = this,
                    items = methods._getItems.apply(this),
                    handler;

                for (var i = 0; i < items.length; i++) {
					
                    (function(i) {
						
                        handler = (typeof settings.handler == FUNCTION) ? settings.handler(items[i]) : null;
						
                        $(items[i]).addClass(CLASS[settings.orientation][1]);
						
                        if (handler) {
						
                            switch (settings.action) {
		
                                case CLICK:
		
                                    handler.bind(CLICK, function() {
					
                                        pointer = $(obj).data(POINTER);
										
                                        (i == pointer && !settings.stayOpen) ? methods.close.apply(obj , [i, false]) : methods.open.apply(obj , [i, false]);
										
                                    });
		
                                break;
		
                                case HOVER:

                                    $(obj).hover(function() {
                                        clearTimeout(timeout);
                                    }, function() {

                                        clearTimeout(timeout);

                                        timeout = setTimeout(function() {

                                            (settings.stayOpen) ? null : methods.close.apply(obj , [i, false]);

                                        }, settings.hoverTime);

                                    });
									
                                    handler.hover(function() {
					
                                        clearTimeout(timeout);
										
                                        timeout = setTimeout(function() {
                                            methods.open.apply(obj , [i, false]);
                                        }, settings.hoverTime);
										
                                    });
		
                                break;
		
                            }
						
                        }
						
                    })(i);
					
                }
				
                (settings.start == null) ?  methods.close.apply(this, [null, true]) : methods.open.apply(this, [settings.start, true])

            },
			
            close: function(pos, fast) {

                $(this).data(POINTER, null);

                var items = methods._getItems.apply(this),
                    properties = methods._getAnimationProperties(settings.orientation, (items.length*settings.size.min)),
                    time = (fast) ? 0 : settings.animationTime,
                    value;
					
                $(this).animate(properties, time, settings.easing[1]);
				
                settings.close.before(items, pos);

                for (var i = 0; i < items.length; i++) {
					
                    value = (i*settings.size.min),
                    properties = methods._getAnimationProperties(settings.direction, value);
                    
                    $(items[i]).animate(properties, time, settings.easing[1], function() {
                        settings.close.each(items, i, pos);
                    });
					
                    $(items[i]).removeClass(CLASS[settings.orientation][2]);
					
                }
				
                settings.close.after(items, pos);

            },

            open: function(pos, fast) {
				
                $(this).data(POINTER, pos);

                var items = methods._getItems.apply(this),
                    itemSize = (settings.size.max == VARIABLE) ? methods._getSize.apply(items[pos]) : settings.size.max,
                    contSize = (settings.size.max == VARIABLE) ? ((items.length-1)*settings.size.min)+itemSize : ((items.length-1)*settings.size.min)+settings.size.max,
                    time = (fast) ? 0 : settings.animationTime,
                    properties = methods._getAnimationProperties(settings.orientation, contSize),
                    value;
					
                $(this).animate(properties, time, settings.easing[0]);
				
                settings.open.before(items, pos);
				
                for (var i = 0; i < items.length; i++) {
					
                    value = (i <= pos) ? (i*settings.size.min) : ((i-1)*settings.size.min)+itemSize,
                    properties = methods._getAnimationProperties(settings.direction, value);

                    $(items[i]).animate(properties, time, settings.easing[0], function() {
                        settings.open.each(items, i, pos);
                    }).removeClass(CLASS[settings.orientation][2]);
					
                    (i == pos) ? $(items[i]).addClass(CLASS[settings.orientation][2]) : null;
					
                }

                settings.open.after(items, pos);

            },
			
            destroy: function() {

                var items = methods._getItems.apply(this),
                    handler;

                $(this).removeClass(CLASS[settings.orientation][0]);
				
                for (var i = 0; i < items.length; i++) {
					
                    (function(i) {
						
                        handler = (typeof settings.handler == FUNCTION) ? settings.handler(items[i]) : null;
						
                        $(items[i]).removeClass(CLASS[settings.orientation][0]+' '+CLASS[settings.orientation][1]);
						
                        if (handler) {
						
                            switch (settings.action) {
		
                                case CLICK:
                                    handler.unbind(CLICK);
                                break;
		
                                case HOVER:

                                    $(this).unbind(MOUSEENTER+' '+MOUSELEAVE);
									
                                    handler.unbind(MOUSEENTER);
		
                                break;
		
                            }
						
                        }
						
                    })(i);
					
                }
				
            }

        };

        return this.each(function() {

            if (methods[method]) {

                settings = methods._getOptions.apply(this),
                pointer = $(this).data(POINTER);

                methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

            } else if (typeof method === OBJECT || !method) {
                 methods.init.apply(this, arguments);
            }

        });

    };

})(jQuery);
