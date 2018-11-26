requirejs(["zepto", "base"], function($, base){
	var index = {
			template : $('#article-tmp').html(),
			loading : $('#loading-tmp').html(),
	        $list : $('.articles-list'),
	        $wrapper : $("#articles-wrapper"),
	        $loading : $(".loading", this.$wrapper),
	        page : 0,
	        len : 0,

			showArticles : function(){
				var _this = this;
				if(_this.page!=0 && _this.page == _this.len) {
					_this.$loading.remove();
					return;
				}
				var dataArr = [];
				_this.$loading.removeClass("hide");
				$.getJSON('/blog/data/data.json', function(data){
					_this.$loading.addClass("hide");
					_this.len = Object.keys(data).length;
					var dataSet = "articles"+(_this.page+1);
					if(data[dataSet]){
						_this.page++;
	   					for(var key in data[dataSet]) {
	   						dataArr.push(data[dataSet][key]);
	   					}
	   				    _this.$list.append(base.attachTemplateToData(_this.template, dataArr));
	   					var lazy = $('.lazy');
	   		            lazy.lazyload();
					}else{
						//数据显示完了
					}
				});
			},
			
	        init : function(){
			alert("test")
			$("#test").on("focus",function(){
				$(this).prop("type", "number");
				setTimeout(function(){
					$("#test").prop("type", "text");
					$("#test").val("1234 56789");
				},0);
			});			
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
	};
	index.init();
});
