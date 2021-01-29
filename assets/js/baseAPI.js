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


//拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {

    //再发起真正的ajax请求之前，统一拼接请求的根路径
    options.url='http://ajax.frontend.itheima.net'+options.url;
    console.log(options.url);

    // http://ajax.frontend.itheima.net/api/login
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