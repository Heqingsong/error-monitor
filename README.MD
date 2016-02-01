# 前端代码异常监控解决方案
----

@author suix
@version v1
@time 2016-01-30
@copyright MIT
@codeReview ["@子慕大诗人"](https://github.com/zimv);

## 摘要
在复杂的网络环境和浏览器环境下，自测、QA测试以及 Code Review 都是不够的，如果对页面稳定性和准确性要求较高，就必须有一套完善的代码异常监控体系，本文用于介绍**E.js**前端代码异常监控解决方案。

为满足业务快速增长，特编写该解决方案，方便开发人员第一时间快速定位BUG位置，排查错误原因，提高工作效率，提高产品稳定性。

## 特别说明
该解决方案在传递参数的时候默认会判断值是否为空，若**为空将不发送空值**，只发送有值的参数。在文档中标记为**（默认）**的字段名是解决方案自动获取的信息，开发人员可传递参数进行覆盖，在文档中标记为 **(String)** 的表示必须传递的数据类型。注意：0 !== "0"

## E.js

**E** 为Error的缩写，E.js主要用于定位前端JS报错信息的收集，及时发送到后端服务器，方便项目出错的时候快速定位错误，排查问题。使用方式如下
```html
<!DOCTYPE html>
<html>
    <head>
    	<meta charset="UTF-8">
    	<title></title>
    	<!-- 推荐放在head，这样可以快速监听页面加载中的错误信息 -->
    	<script src="E.js"></script>
    </head>
    <body data-api="http://abc.api.baidu.com/" data-name="jule" data-wxid="oEcxUtyS2nCnem1cmF5x6Qk2oCAE" data-play="http://wx.baidu.com" data-base="http://daojia.baidu.com/">
    
    
    <!-- 自定义参数，和初始化参数配置 -->
    <script type="text/javascript">
        var _temp_ = document.getElementsByTagName("body")[0]["dataset"];
    	E.init({
    		url:_temp_.api,//E.js把捕获到的异常信息提交到哪里(必填)
    		name:_temp_.name,//商户名(可选)
    		openId:_temp_.wxid//用户的OPENID(可选)
    	});
    </script>
    <!-- 防止跨域JS问题 返回HTTP头加  Access-Control-Allow-Origin:* -->
    <script src="您的JS.js" crossorigin></script>
    </body>
</html>
```
## 使用方式
E.js会默认读取全局的onerror事件中的错误信息进行上报，不显示使用的情况下，默认捕捉全局所有JS报错信息。

### 显示调用(例一)
```js
try{
    abc;//Uncaught ReferenceError: abc is not defined
}catch(e){
    //在catch中手动把e信息放到上报信息中.
    E.error(e);
}
```

### 显示调用(例二)
```js
ajax.G("url枚举字段",{
    a:1,
    b:2
}).then(function(data){
    //在必要环节的错误信息上报，比如AJAX的时候，后端可能接口不稳定导致的数据信息不完整的情况。
    E.error({
    	module:"cycle",
    	grade:1,//错误等级1-10
    	info:"自定义错误信息说明!",
    	http:"url枚举字段名",
    	code:data.code,
    	msg:data.msg,
    	result:data.result
    });
});
```

## 参数列表说明

### E.js初始化参数列表

#### 错误信息上报URL（必填）(String)
> url:"https://error.baidu.com/"

#### 商户名称字段（可选）(String)
> name:"jule"

#### 用户OPENID（可选）(String)
> openId:"oEcxUtyS2nCnem1cmF5x6Qk2oCAE"

#### 用户所在地址（可选）(String)
> address:"104.23565464,96.65603242"

----

### E.js错误信息上报列表

#### 代码隶属于那个模块（可选）(String)
> module:"cycle"

#### 静态HTML所在的URL(默认)（String）
> viewUrl:"http://error.baidu.com/tabs/index",        

#### 发生的时间(默认)（Date）
> date:"2016-01-31 00:00:15",                         

#### 用户的OPENID(可选)（String）
> openId:"oEcxUtyS2nCnem1cmF5x6Qk2oCAE",              

#### 商户的ID(可选)（String）
> name:"jule",                                        

#### 用户所在位置(可选)（String）
> address:"104.23565464,96.65603242",                 

#### 错误等级:1 最低, 10 最高(默认10)(可选)（number）
> grade:10,                                           

#### 手机平台类型(默认)（String）
> platform:"ios",                                     

#### UserAgent(默认)（String）
> ua:"Mozilla/5.0 ....",                              

#### 出错的文件(默认)（String）
> file:"http://error.baidu.com/test.js",              

#### 出错文件所在行(默认)（number）
> line:128,                                           

#### 出错文件所在列(默认)（number）
> col:27,                                             

#### 使用的语言(默认)（String）
> lang:"zh-CN",                                       

#### 分辨率(默认)（String）
> screen:"1920 * 1080",                               

#### 浏览器编码环境(默认)（String）
> carset:"UTF-8",                                     

#### 错误代码（暂不开放）
> code:"",                                            

#### 错误信息(可选)（String）
> info:"自定义错误描述!",                             

#### RESTful API(可选)（String）
> http:"http://error.baidu.com/login",                

#### 状态码(可选)（number）
> code:200,                                           

#### 接口解释信息(可选)（String）
> msg:"登陆成功",                                     

#### 返回的信息(可选)（String）
> result:"{}"                                         