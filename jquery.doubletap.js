// created by David Kane - 17/10/2012
// based on blog post that I saw here: http://stackoverflow.com/questions/5507638/whats-the-best-way-to-handle-longtap-and-double-tap-events-on-mobile-devices-us
(function($)
{
    $.fn.doubletap = function(fn)
    {
        return fn ? this.bind('doubletap', fn) : this.trigger('doubletap');
    };

    $.attrFn.doubletap = true;

    $.event.special.doubletap = 
    {
        setup: function(data, namespaces)
        {
            $(this).bind('touchstart', $.event.special.doubletap.handler);
            $(this).bind('touchmove', $.event.special.doubletap.handler);
            $(this).bind('touchend', $.event.special.doubletap.handler);
        },

        teardown: function(namespaces)
        {
            $(this).unbind('touchstart', $.event.special.doubletap.handler);
            $(this).unbind('touchmove', $.event.special.doubletap.handler);
            $(this).unbind('touchend', $.event.special.doubletap.handler);
        },

        handler: function(event)
        {	
        	switch(event.type)
        	{
        		case 'touchstart' :
        			$(this).data('isScrolling', false);
        			return;
        		case 'touchmove' :
        			$(this).data('isScrolling', true);
        			return;
        		default :
        			break;
        	} 
        	
        	if($(this).data('isScrolling'))
        		return;
        	
            var action;

            clearTimeout(action);

            var now       = new Date().getTime();
            
            //the first time this will make delta a negative number
            var lastTouch = $(this).data('lastTouch') || now + 1;
            var delta     = now - lastTouch;
            var delay     = delay == null? 500 : delay;

            if(delta < delay && delta > 0)
            {
                // After we detct a doubletap, start over
                $(this).data('lastTouch', null);

                // set event type to 'doubletap'
                event.type = 'doubletap';

                // let jQuery handle the triggering of "doubletap" event handlers
                $.event.handle.apply(this, arguments);
            }
            else
            {
                $(this).data('lastTouch', now);

                action = setTimeout(function(evt)
                {
                    // set event type to 'doubletap'
                    event.type = 'tap';

                    // let jQuery handle the triggering of "doubletap" event handlers
                    $.event.handle.apply(this, arguments);

                    clearTimeout(action); // clear the timeout
                }, delay, [event]);
            }
        }
    };
})(jQuery);