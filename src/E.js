/**
* @des 错误对象
* @class 
*/
function E(){}
(function(global,E){
	if(!E){
		return false;
	}

	//内置参数列表
	var options = {
		url:"",
		name:"",
		openId:"",
		address:""
	};

	//处理用户所在位置
	window.navigator.geolocation.getCurrentPosition(function(position){
		if(options.address === ""){
			options.address = position.coords.latitude+","+position.coords.longitude;
		}
	});

	/**
	* @des 将对象转为键值对参数字符串。
	* @param {Object} obj 参数列表对象
	* @return 返回拼接之后的参数列表字符串
	* @private
	*/
	function param(obj){
		if(Object.prototype.toString.call(obj) !== "[object Object]" ){
	  		return false;
	  	}

	  	var array = [];
	  	for(var k in obj){
	    	if(!Object.prototype.hasOwnProperty.call(obj,k)){
	    		return false;
	    	}
	    	if(obj[k] != ""){
	    		array.push(k + "=" + encodeURIComponent(obj[k]));
	    	}
	  	}
	  	return array.join("&");
	}

	/**
	* @des 处理时间
	* @return YYYY-MM-DD hh:mm:ss
	* @private
	*/
	function dateFun(){
		var date = new Date();
	    return date.getFullYear()+"-"+(date.getMonth() + 1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	}

	/**
	* @des 创建一个HTTP GET 请求
	* @param {Object} obj 参数列表对象 {url:'',data:{},callback:function(){}}
	* @private 
	*/
	function send(obj){
		if(!obj.callback){
			obj.callback = function(){}
		}

		var d = param(obj.data),
	  		url = obj.url + (obj.url.indexOf("?") < 0 ? "?" : "&") + d;
	  	// 忽略超长 url 请求，避免资源异常。
	  	if(url.length > 7713){return data.callback();}

	  	if(window.navigator.onLine){
	  		var img = new Image(1,1);
		  		img.onload = img.onerror = img.onabort = function(){
		    		obj.callback();
		    		img.onload = img.onerror = img.onabort = null;
		    		img = null;
		  		};
	  		img.src = url;
	  	}
	}

	/**
	* @des 获取报错JS所在行的源代码上传服务器
	* @private
	* @return 报错代码
	*/
	function getCodeFun(){
		return "";
	}

	/**
	* @des 私有方法
	* @param {Object} arg, 错误信息对象
	* @private 
	*/
	function error(arg){
		if(typeof arg === "string"){
			return false;
		}
		var errorMsg = {
				module:"",//模块
				viewUrl:encodeURIComponent(location.href),//URL
				date:dateFun(),//发生的时间
				openId:options.openId,//用户的ID
				name:options.name,//商户的ID
				address:options.address,//用户所在位置
				grade:10,//错误等级 1 最低 10 最高
				platform:window.navigator.platform,//手机型号
				ua:window.navigator.userAgent.toString(),//UserAgent
				file:document.currentScript.src,//出错的文件
				line:0,//出错文件所在行
				col:(window.event && window.event.errorCharacter) || 0,//出错文件所在列
				lang:navigator.language || navigator.browserLanguage || "",//使用的语言
				screen:window.screen.width+" * "+window.screen.height,//分辨率
				carset:(document.characterSet ? document.characterSet : document.charset),//浏览器编码环境
				code:getCodeFun(),//错误代码
				info:"无错误描述!",//错误信息
				http:"",//PHP接口名称
				code:"",//状态码
				msg:"",//接口解释信息
				result:""//返回的信息
			};

		for(var i in arg){
			if(arg[i] != ""){
				errorMsg[i] = arg[i];
			}
		}

		//错误信息上报
		setTimeout(function(){
			send({
				url:options.url,
				data:errorMsg
			});
	    },0);
	}

	/**
	* @des 公有方法处理初始参数设置
	* @param {Error} obj, 用户传递过来的初始化信息
	* @public
	*/
	E.init = function(obj) {
		if(obj["url"] === undefined){
			return false;
		}
		for(var i in obj){
			options[i] = obj[i];
		}
	}

	/**
	* @des 公有方法处理,用于监控 `try/catch` 中被捕获的异常。
	* @param {Error} obj, 传递过来的异常对象信息。
	* @return {Object} 主要用于单元测试。
	* @public
	*/
	E.error = function(obj){
		var _ = {};
		if(obj instanceof Error){
			_.info = (obj.message || obj.description) +" "+(obj.stack || obj.stacktrace),
	      	_.grade = 10,
	      	_.module = "try_catch";
		}else{
			_ = obj;
		}

		error(_);
		return true;
	}

	/**
	* @des 全局对象
	* @params {String}
	* @public
	*/
	global.onerror = function(message, file, line, column){
		var obj = {
			info:message,
			file:file,
			line:line,
			col:column,
			grade:10,
			module:"global"
		};
		error(obj);
    	return true;
	};

	//TODO
	//DOMError   DOMException

})(this,this.E);