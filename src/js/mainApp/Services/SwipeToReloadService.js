welldonegoodServices.service('SwipeToReloadService', [
	function() {
		var SwipeToReloadService = {};

		SwipeToReloadService.init = function(container, slidebox, slidebox_icon, scroll_content, handler) {
			SwipeToReloadService.container = SwipeToReloadService.getEl(container);
			SwipeToReloadService.slidebox = SwipeToReloadService.getEl(slidebox);
			SwipeToReloadService.slidebox_icon = SwipeToReloadService.getEl(slidebox_icon);
			SwipeToReloadService.scroll_content = SwipeToReloadService.getEl(scroll_content);
			SwipeToReloadService.handler = handler;

			SwipeToReloadService.breakpoint = 80;

			SwipeToReloadService._slidedown_height = 0;
            SwipeToReloadService._anim = null;
            SwipeToReloadService._dragged_down = false;

            SwipeToReloadService.hammertime = Hammer(SwipeToReloadService.container)
                .on("touch dragdown release", function(ev) {
                    SwipeToReloadService.handleHammer(ev);
                });
		}

		SwipeToReloadService.handleHammer = function(ev) {
            switch(ev.type) {
                // reset element on start
                case 'touch':
                    SwipeToReloadService.hide();
                    break;

                // on release we check how far we dragged
                case 'release':
                    if(!SwipeToReloadService._dragged_down) {
                        return;
                    }

                    // cancel animation
                    try {
                        cancelAnimationFrame(SwipeToReloadService._anim);    
                    } catch (error) {
                        console.log(error);
                    }

                    // over the breakpoint, trigger the callback

                    if(ev.gesture.deltaY >= SwipeToReloadService.breakpoint) {
                        SwipeToReloadService.container.className = 'pullrefresh-loading full-height';
                        SwipeToReloadService.slidebox_icon.className = 'icon loading';

                        SwipeToReloadService.setHeight(60);
                        SwipeToReloadService.handler.call(SwipeToReloadService);
                    }
                    // just hide it
                    else {
                        SwipeToReloadService.slidebox.className = 'slideup';
                        SwipeToReloadService.container.className = 'pullrefresh-slideup full-height';

                        SwipeToReloadService.hide();
                    }
                    break;

                // when we dragdown
                case 'dragdown':
                    // if we are not at the top move down
                    if(SwipeToReloadService.scroll_content.scrollTop > 15) {
                        return;
                    } 

                    SwipeToReloadService._dragged_down = true;

                    // no requestAnimationFrame instance is running, start one
                    if(!SwipeToReloadService._anim) {
                        SwipeToReloadService.updateHeight();
                    }

                    // stop browser scrolling
                    ev.gesture.preventDefault();

                    // update slidedown height
                    // it will be updated when requestAnimationFrame is called
                    SwipeToReloadService._slidedown_height = ev.gesture.deltaY * 0.4;
                    break;
            }
        };

        SwipeToReloadService.setHeight = function(height) {
            SwipeToReloadService.container.style.transform = 'translate3d(0,'+height+'px,0) ';
            SwipeToReloadService.container.style.oTransform = 'translate3d(0,'+height+'px,0)';
            SwipeToReloadService.container.style.msTransform = 'translate3d(0,'+height+'px,0)';
            SwipeToReloadService.container.style.mozTransform = 'translate3d(0,'+height+'px,0)';
            SwipeToReloadService.container.style.webkitTransform = 'translate3d(0,'+height+'px,0) scale3d(1,1,1)';
        };

        SwipeToReloadService.hide = function() {
            SwipeToReloadService.container.className = ' full-height';
            SwipeToReloadService._slidedown_height = 0;
            SwipeToReloadService.setHeight(0);

            try {
                cancelAnimationFrame(SwipeToReloadService._anim);    
            } catch (error) {
                console.log(error);
            }

            SwipeToReloadService._anim = null;
            SwipeToReloadService._dragged_down = false;
        };

        SwipeToReloadService.slideUp = function() {
            try {
                cancelAnimationFrame(SwipeToReloadService._anim);    
            } catch (error) {
                console.log(error);
            }
            
            SwipeToReloadService.slidebox.className = 'slideup';
            SwipeToReloadService.container.className = 'pullrefresh-slideup full-height';

            SwipeToReloadService.setHeight(0);
            setTimeout(function() {
                SwipeToReloadService.hide();
            }, 500);
        };

        SwipeToReloadService.updateHeight = function() {

            SwipeToReloadService.setHeight(SwipeToReloadService._slidedown_height);

            if(SwipeToReloadService._slidedown_height >= SwipeToReloadService.breakpoint){
                SwipeToReloadService.slidebox.className = 'pull-to-reload-box breakpoint';
                SwipeToReloadService.slidebox_icon.className = 'icon arrow arrow-up';
            }
            else {
                SwipeToReloadService.slidebox.className = 'pull-to-reload-box';
                SwipeToReloadService.slidebox_icon.className = 'icon arrow';
            }

            SwipeToReloadService._anim = requestAnimationFrame(function() {
                SwipeToReloadService.updateHeight();
            });
        };

        SwipeToReloadService.getEl = function(id) {
        	return document.getElementById(id);
    	}


		return SwipeToReloadService;
	}
]);