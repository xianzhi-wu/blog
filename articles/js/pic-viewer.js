var li = document.getElementsByClassName("pic-list"), len = li.length;  //获取图片组的列表和长度
for(var i = 0; i < len; i++) {
	(function(index){
		var imgLi = li[index].getElementsByTagName("li"), l = imgLi.length, imgArr = [];
		for(var j = 0; j < l; j++){
			imgArr.push(imgLi[j].getAttribute("data-src"));
		}
		for(var k = 0; k < l; k++){
			(function(n){
				//给每个图片组的每张图片添加相应的点击事件
				imgLi[n].onclick = function(){
					var show = new showPic(imgArr, n);
				}
			})(k);
		}
	})(i);
}
/*点击小图显示大图*/
function showPic(picArr, picIndex) {
	this.picArr = picArr, this.i = picIndex;
	
	this.$bg = document.createElement("div"), this.$bg.id = "pic-bg", this.$bg.className = "cover-bg";
	var html = "<div id='nav' class='index'><span>1</span>/<span>4</span></div><div class='pic_focus_wrapper' id='pic_focus_wrapper'><ul id='pic-box'>", l = this.picArr.length;
	for (var j = 1; j <= l; j++) {
		html += "<li id='img0" + j + "'><div><img src='" + this.picArr[j-1] + "'/></div></li>";
	}
	html += "</ul></div>";
	this.$bg.innerHTML = html;
	this.$body = document.body || document.documentElement;
	this.$body.appendChild(this.$bg);     //body添加弹窗背景
	
	this.st = this.$body.scrollTop;
	
	this.w = this.$body.offsetWidth;
	this.$pic_box = document.getElementById("pic-box"), this.$pic_list = this.$pic_box.getElementsByTagName("li"), this.len = this.$pic_list.length; //获取图片的容器  
	document.getElementById("pic_focus_wrapper").style.width = this.w+"px";
	this.$pic_box.style.width = (this.w*this.len)+"px";
	var nav = document.getElementById("nav");
	this.curI = nav.getElementsByTagName("span")[0], this.curI.innerHTML = parseInt(this.i)+1;
	this.total = nav.getElementsByTagName("span")[1], this.total.innerHTML = this.len;
	
	this.showPics(this.i);
	this.swipe();
	this.close();
};
showPic.prototype.showPics = function(index) {
	var _method = this;
	_method.imgScroll = null;
	_method.$pic_box.style.left = -(_method.w * index) + "px";
	setTimeout(function() {
		if(_method.imgScroll) _method.imgScroll.destroy();
		_method.imgScroll = new IScroll("#img0" + (index + 1), {
			scrollY : true,
			mouseWheel : true,
			click: true
		});
	}, 300);
};
showPic.prototype.swipe = function() {
	//左右切换开始
	var _method = this;
	var startX = 0, endX = 0, startY = 0, endY = 0, scrollPrevent = false, tY = 1024, h=document.documentElement.clientHeight;;;
	for(var k=0;k<_method.len;k++){
		_method.$pic_list[k].style.lineHeight = h + "px";
		_method.$pic_list[k].style.width = _method.w+"px";
		
		_method.$pic_list[k].addEventListener("touchstart",function(ev){
			_method.$pic_box.className = "tran_effect";
			t = ev || window.event;
			t.preventDefault();
			t = t.touches[0], startX = t.pageX, startY = t.pageY;
		});

		_method.$pic_list[k].addEventListener("touchmove", function(ev){
			t = ev || window.event;
			t.preventDefault();
			var p = t.touches.length;
			if (p > 1) {
				scrollPrevent = true;
			} else {
				scrollPrevent = false;
			}
		});

		_method.$pic_list[k].addEventListener("touchend", function(ev){
			t = ev || window.event;
			t.preventDefault();
			endX = t.changedTouches[0].pageX;
			endY = t.changedTouches[0].pageY;

			this.getElementsByTagName("img")[0].clientHeight > _method.h ? tY = 30 : tY = 1024;
			if (Math.abs(endX - startX) >= 10 && Math.abs(endY - startY) < tY && !scrollPrevent) {
				if (endX > startX) {
					_method.prevPage();
				} else {
					_method.nextPage();
				}
			}
		});
	};
}
showPic.prototype.close = function() {
	var _method = this;
	_method.$pic_box.onclick = function(){
		if(_method.$bg) {
			_method.$body.removeChild(_method.$bg);
			_method.$bg = null;
		}
		if(_method.imgScroll) {
			_method.imgScroll.destroy();
			//_method.imgScroll = null;
		}
		_method.$body.scrollTop = _method.st;
	}
};
showPic.prototype.prevPage = function() {
	var _method = this;
	if (_method.i == 0) {
		_method.showPics(_method.i);
		return;
	}
	_method.i--;
	_method.showPics(_method.i);
	_method.curI.innerHTML = parseInt(_method.i)+1;
};
showPic.prototype.nextPage = function() {
	var _method = this;
	if (_method.i == _method.len - 1) {
		_method.showPics(_method.i);
		return;
	}
	_method.i++;
	_method.showPics(_method.i);
	_method.curI.innerHTML = parseInt(_method.i)+1;
}; 
