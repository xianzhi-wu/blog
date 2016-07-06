define("base", ["zepto"], function($){
	//zepto图片懒加载插件
	$.fn.lazyload = function(settings){
		var _self=$(this), winST = 0, $win = $(window);
		settings = $.extend({
			container : $win,			//图片懒加载的容器，默认为window
			threshold : 30,				//默认提前加载距离
			effect : '',	        //显示的动画class
			placeholder : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTdBMzg2MUYzODQ2MTFFNjg2NzRDN0M4NDdENjk0N0YiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTdBMzg2MjAzODQ2MTFFNjg2NzRDN0M4NDdENjk0N0YiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5N0EzODYxRDM4NDYxMUU2ODY3NEM3Qzg0N0Q2OTQ3RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5N0EzODYxRTM4NDYxMUU2ODY3NEM3Qzg0N0Q2OTQ3RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psa6w4MAAANGSURBVHja7JzhbdswEIVlwf/LThB1ArsbqAMIUCeoPUGcCdxM4GQCOxPUhQeIPEGUCaoR1AlcMjgZqhBTOlGiKeU94ODAsUzq493xjkIyOZ1OHtRePhAAIAACIABCAAiAAAiAEAACIAACIASAAAiAAAgBIAAOQdPih8PhIOTL3OC7Uml5x/ML6VXN65O0QJqa53fnANIkny2MuZO2rLwXS1sbLmBfCsiUEl0IC0sTCt95b+YgvIW0P2TPZOoR5rYE9D+AM4srWtXRMXjbKqgK2Jdiwf1KCHtXgpg55nmLms+oaP1VBRgMBGDS89xuGfcQX8sDXRaHw8ynEiZ0YOLZEGn7Vwhf1wFyUsRrAfDG4gRTC3nMRI8NP6eahqQopH/rKGs6jG0L7106HpV7muO2wX3kbwCjKErJMxqLWj9u8f2TO86VtKOU8oO6JFFKMyp67ouUMzXc7gUzdO8HtD8kZMsmm4jH9L6AvMml0A0p7F6o5SpMtWCbvsq0th646SF0c0Nwgeb3ylYlj8o0NeCmUhlkml7+cdrC+0LKC12Hbsr8XkHgYiZs5aHfNAvKqYkTnwlPNNidbIRuTKckcYtrBYW1uLCIHB25OfCWWbb0seuG1MibHL+JFmnIbBOR3jdnbhyZ47turEklje+R44EbB0K3S116hJF3DlB634qZXB8cb9fKEPsNYar51iMK3V5OY+pCVzBDN7cw94zG+ixtIu0LeX4Xhx1Nx9cDlN4XM0uFvaXQVb3qV3rNSzd0R3MwUd4JwBY1X25p48hqvPzJlRBeOxy6fbSE3QGkdm3FPLnYex9QlzzQxdAdBkDpfWtmu/bgDfSBUOcAW7RrQzsk7d0Due3anffB5Ru0a7soijg1X0Dfr1LEYiwAp6Wab829mPLlJViBpmlPqAgeB0DadbmN9cKDziEcA8VZog3AZEQAAsPrmz69C8sAbddxfS7YzTVCOEPkdn+Y0Kf+jg3gq+Vx07EBzC2Pm48NYGb5pt7zwKZRUJevjx7zVLnl4r59bmL639tkN3KplpprBk5rygjRwQ4e1JQ0ur+sqrv2fA8T/Pu7Ye7CAAgBIAACIABCAAiAAAiAAAgBIAACIABCAGhf/wQYAGMrzXt+dq/RAAAAAElFTkSuQmCC',
			callback : ''				//回调
		},settings || {});
	    function lazyLoad(){
			_self.each(function(){
				var _this = $(this), img = _this.attr('data-src'), _offsetTop = _this.offset().top;
				if(_this.attr('data-src')){
					if((_offsetTop - settings.threshold) <= (settings.container.height() + winST)){
						//如果是img标签
						if(_this.is('img')){
							_this.attr('src', img);
						}else{
							//如果作为背景图
							_this.css('background', '');
							_this.css('background-image', 'url('+ img +')');
						}
						_this.removeAttr('data-src');
						_this.addClass(settings.effect);
						_this.removeClass("lazy");
						settings.callback && settings.callback(_this);
					}else{
						if(_this.is('img')){
							if(!_this.attr('src')) {
							    _this.attr('src', settings.placeholder);
							}
						}else{
							console.log(!_this.css('background'))
							if(!_this.css('background')) {
							    _this.css('background', 'url('+ settings.placeholder +') no-repeat center center #eee');
							}
						}
					}
				}
			});
	    }
		lazyLoad();
		settings.container.on('scroll',function(){
			winST = $win.scrollTop();
			lazyLoad();
		});
	}
	
	// 将模板和数据作为参数，通过数据里所有的项将值替换到模板的标签上
	function attachTemplateToData(template, data) {
		var i = 0,
			len = data.length,
			fragment = '';
		// 遍历数据集合里的每一个项，做相应的替换
		function replace(obj) {
			var t, key, reg;
	        //遍历该数据项下所有的属性，将该属性作为key值来查找标签，然后替换
			for (key in obj) {
				reg = new RegExp('_' + key + '_', 'ig');
				t = (t || template).replace(reg, obj[key]);
			}
			return t;
		}
		for (;i < len ;i++) {
			fragment += replace(data[i]);
		}
		return fragment;
	};
	return {
		attachTemplateToData : attachTemplateToData
	}
})
