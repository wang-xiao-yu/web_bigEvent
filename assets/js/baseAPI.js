/*
jQuery.ajaxPrefilter( [ dataType ,] handler )
	(1)options：(Object对象)当前AJAX请求的所有参数选项。
	(2)originalOptions：(Object对象)传递给$.ajax()方法的未经修改的参数选项。
	(3)jqXHR：当前请求的jqXHR对象(经过jQuery封装的XMLHttpRequest对象)。
 
1-jQuery.ajaxPrefilter()函数用于指定预先处理Ajax参数选项的回调函数。

2-在所有参数选项被jQuery.ajax()函数处理之前，你可以使用该函数设置的回调函数来预先更改任何参数选项。

3-你还可以指定数据类型(dataType)，从而只预先处理指定数据类型的参数选项。

4-该函数可以调用多次，以便于为不同数据类型的AJAX请求指定不同的回调函数。

该函数属于全局jQuery对象。 */


/* 
 每次请求的时候都需要去添加根路径，比较的麻烦，如果根路径进行了修改，那么每个请求的页面都需要调整，那么`jQuery`中提供了一个 过滤器，可以帮我们统一去进行设置，而这个过滤器调用的时机是在我们调用 `$.ajax()` 之后，请求真正发给后台之前调用的：`$.ajax() > ajaxPrefilter过滤器 -> 发送请求给服务器`



// 1-注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数过滤器
// 3-在这个函数中，可以拿到我们给Ajax提供的配置对象，调用 `$.ajaxPrefilter()` 函数，里面传递一个回调函数，回调函数里面有一个形成 `options`，这个形成里面就包含了这一次请求的相关信息

	`ajaxPrefilter` 函数，在我们调用 `$.ajax()` 后，并且在请求服务器之前调用的过滤器，那么我们能统一设置根路径，那么我们就可以去统一设置请求头

	1-判断`url` 里面是否携带 `/my/`
	2-如果携带，那么我们就设置 `options.headers`

	// （1）项目的请求根路径为 http://ajax.frontend.itheima.net

	// （2）以 / api 开头的请求路径，不需要访问权限

	// （3）以 / my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
*/
$.ajaxPrefilter(function (options) {

	//1-再发起真正的ajax请求之前，统一拼接请求的根路径
	options.url = 'http://ajax.frontend.itheima.net' + options.url;
	console.log(options.url);



	// http://ajax.frontend.itheima.net/api/login

	//2- 统一为以(包含)/ my 开头的请求路径，需要在请求头中携带有权限的接口，设置 headers 请求头
	if (options.url.indexOf('/my/') !== -1) {
		options.headers = {
			Authorization: localStorage.getItem('token') || ''
		}
	}


	//3. 全局统一挂载 complete 回调函数
	// 3.控制用户的访问权限，优化权限控制的代码，封装到baseAPI中
	
	/* 用户如果没有登录，是不允许用户访问后台主页，所以我们需要进行权限的校验，可以利用请求后服务器返回的状态来决定 */

	//(3-1)- 在调用有权限接口的时候，指定`complete`回调函数，这个回调函数不管成功还是失败都会调用;
	options.complete = function (res) {
		// console.log('执行了 complete 回调：')
		console.log(res);
		console.log(res.responseJSON);//拿到服务器响应回来的数据
		// {status: 1, message: "身份认证失败！"}
		//{status: 0, message: "获取用户基本信息成功！", data: {…}}
		// (3-2)- 在回调里面判断 服务器返回的的状态是否等于 1，并且错误的信息是  "身份认证失败"，如果成立，那么就强制用户跳转到登录页; 
		if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
			//强制清空本地的 token
			localStorage.removeItem('token');
			//强制用户跳转到登录页
			location.href = '/Day-1/login.html';
		}

	}



})













//   补充知识：
/*
//设置AJAX的全局默认选项
$.ajaxSetup( {
	url: "/index.html" , // 默认URL
	aysnc: false , // 默认同步加载
	type: "POST" , // 默认使用POST方式
	headers: { // 默认添加请求头
		"Author": "CodePlayer" ,
		"Powered-By": "CodePlayer"
	} ,
	error: function(jqXHR, textStatus, errorMsg){ // 出错时默认的处理函数
		// 提示形如：发送AJAX请求到"/index.html"时出错[404]：Not Found
		alert( '发送AJAX请求到"' + this.url + '"时出错[' + jqXHR.status + ']：' + errorMsg );
	}
} );


// 指定预处理参数选项的函数
$.ajaxPrefilter( function(options, originalOptions, jqXHR){
	// options对象 包括accepts、crossDomain、contentType、url、async、type、headers、error、dataType等许多参数选项
	// originalOptions对象 就是你为$.ajax()方法传递的参数对象，也就是 { url: "/index.php" }
	// jqXHR对象 就是经过jQuery封装的XMLHttpRequest对象(保留了其本身的属性和方法)

	options.type = "GET"; // 将请求方式改为GET
	options.headers = { }; // 清空自定义的请求头
});


// 执行AJAX请求
$.ajax( {
	url: "/index.php"
} );


*/