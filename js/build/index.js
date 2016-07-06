var index = {
		template : $('#article-tmp').html(),
		loading : $('#loading-tmp').html(),
        list : $('.articles-list'),
        page : 0,

		showArticles : function(){
			var _this = this;
			var dataArr = [];
			
			if(_this.list.find('.loading').length == 0) {
				_this.list.append(_this.loading);
			}
            if(_this.page > 0) {
				$(".loading", _this.list).removeClass("hide");
			}
			$.getJSON('/app/jsp/blog/data/data.json', function(data){
				$(".loading", _this.list).addClass("hide");
				_this.page++;
				var dataSet = ("articles"+_this.page);
				if(data[dataSet]){
   					for(var key in data[dataSet]) {
   						dataArr.push(data[dataSet][key])
   					}
   					$(".loading", _this.list).before(attachTemplateToData(_this.template, dataArr));
   					var lazy = $('.lazy');
   		            lazy.lazyload();
				}else{
					//数据显示完了
				}
			});
		},
		
        init : function(){
        	var _this = this;
        	_this.showArticles();
        	
            // 对元素的滚动监听
   			$(window).scroll(function() {
   				// 滚动条高度 + 窗口高度  >= 文档高度
				   				if ($(window).scrollTop() + $(window).height()+ 40 >= $(document).height()) {
   					_this.showArticles();
   				}
   			});
        }
}
index.init();