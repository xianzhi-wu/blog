var post = {
	imgsData : new Array(), // 选择的图片集合(data内存对象,已经通过convas缩放处理的了)
	savimg_maxwidth : 750, // 保存的图片限制的宽度(自动用canvas重绘图片)
	$add01 : $("#addPic-01"), 
	$add02 : $("#addPic-02"),	
	count : 0,   //选择文件表单改变事件(表示选择了图片的)
	
	//提交发布
	finish : function() {
		if(post.imgsData.length == 0) {
			post.showTip("请上传图片");
			return;
		}	
		//处理图片内容
		var datahtml = '';
		for(var i = 0; i < post.imgsData.length; i++) {
			datahtml = datahtml + '<input type="hidden" name="image_data'+i+'" id="image_data'+i+'" value="'+post.imgsData[i]+'" />';
		}
		$("#div-imgdata").html(datahtml);  
	},
	/*显示提示信息*/
	showTip : function(msg) {
		var html = '<div class="popup-tip">'+ msg +'</div>';
		$("body").append(html);
		setTimeout(function() {
			$(".popup-tip").remove();
		}, 1000);
	},
	
	checkPic : function() {
		if($(".uploaded-pics ul li").length == 0) {
			$("#pic-tip").text("*请上传图片");
			return false;
		} else {
			$("#pic-tip").text("");
		}
		return true;
	},
	//上传图片
	uploadPic : function() {
		var url = "", file = this.files[0];
		if(file === undefined) { //点击取消时，可能会引起file === undefined
			return;
		}
		//多次上传
	    post.count++;
	    $("#f-pic").replaceWith('<input type="file" id="f-pic" capture="camera" accept="image/jpg,image/jpeg,image/png,image/gif" style="visibility:hidden;" title="'+ post.count +'">');
		//如果超过9张
		if($(".uploaded-pics ul li").length>=9) { post.showTip("最多只能上传9张图片！");  return false; }
		if(!post.$add01.parent(".camera-add").hasClass("hide")) {
			post.$add01.parent(".camera-add").addClass("hide");
			post.$add02.removeClass("hide");
		 }
		var html = '<li>' +
			   '<div class="delete-area hide"><i class="delete-icon"></i></div>' +
			   '<div class="load-pic"></div>' +
			   '<p class="hide">请重新上传</p>'+
			   '</li>';
		$(html).appendTo($(".uploaded-pics ul"));
		//如果图片超过9张就隐藏添加按钮
		if($(".uploaded-pics ul li").length>=9&&!post.$add02.hasClass("hide")) { post.$add02.addClass("hide"); }
		//图片方向角
		var Orientation = null;
		//获取照片方向角属性，用户旋转控制  
		EXIF.getData(file, function() {EXIF.getAllTags(this);Orientation = EXIF.getTag(this, 'Orientation');});

		url = post.getObjectURL(file);
		var $latest =  $(".uploaded-pics ul li:last-child");
		var img = new Image();
		img.onload = function() {
			var width = this.width, height = this.height;
			// 生成图片区域
			var p_nw = 0, p_nh = 0;
			width <= post.savimg_maxwidth ? (p_nw = width, p_nh = height) : (p_nw = post.savimg_maxwidth, p_nh = height * p_nw / width);
			var img = canvasFunc.getImgToCanvasData(this, p_nw, p_nh, Orientation); //canvasFunc.js里的getImgToCanvasData
			for(var i = 0; i < post.imgsData.length; i++) {
				if(post.imgsData[i] == img) {
					$latest.remove();
					post.showTip("请勿重复上传图片");
				    return false;
			    }
			}
			post.imgsData[post.imgsData.length] = img;
			$latest.children(".load-pic").addClass("hide");
			$latest.children(".delete-area").removeClass("hide");
	        $latest.css({"background" : "url(" + img + ")","background-size" : "cover","background-position" : "center"});  
			post.revokeObjectUrl(url);
		}
		img.onerror = function() {
			post.imgsData[post.imgsData.length] = null;
			$latest.children(".load-pic").addClass("hide");
			$latest.children("p.hide").removeClass("hide");
			$latest.children(".delete-area").removeClass("hide");
			post.revokeObjectUrl(url);
		}
	    img.src = url;	
	},
	
	//删除图片
	deletePic : function() {
		var currI = $(this).parent(".uploaded-pics ul li").index();
		$(".uploaded-pics ul li").eq(currI).remove();
		post.imgsData.splice(currI, 1);
		/*少于9张就显示添加图片按钮*/
		if($(".uploaded-pics ul li").length <= 9&&post.$add02.hasClass("hide")) {post.$add02.removeClass("hide"); }
		/*删除完时 显示中间添加按钮*/
		if($(".uploaded-pics ul li").length == 0) {post.$add01.parent(".camera-add").removeClass("hide");post.$add02.addClass("hide");}
	},
	
	getObjectURL : function(file) {
		var url = null;
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	},
	
	revokeObjectUrl : function(url) {
		window.URL && window.URL.revokeObjectURL(url)|| window.webkitURL && window.webkitURL.revokeObjectURL(url);
	},
	
	init : function() {
		$("#f-pic").live("change", this.uploadPic);
		this.$add01.on("click", function(){ $("#f-pic").click(); });
		this.$add02.on("click", function(){ $("#f-pic").click(); });
		$(".uploaded-pics").delegate(".delete-area","click", this.deletePic);
		$("#upload").on("click", this.finish);
	}
}
post.init();
