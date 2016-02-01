try{
	a;
	throw new Error("测试错误信息！");
}catch(e){
	E.error(e);
}

//http请求的时候
E.error({
	module:"cycle",//隶属于那个模块
	openId:1223,//用户的ID 默认获取设置的OPENID
	grade:1,//错误等级 1 最低 10 最高 默认 10
	info:"自定义错误信息!",//错误信息
	http:"http://www.baidu.com/users/coulist?id=157827&m_id=6&status=0",//PHP接口名称
	code:200,//状态码
	msg:"请求成功的时候",//接口解释信息
	result:"{num: 0}"//返回的信息
});