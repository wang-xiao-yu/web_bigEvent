$(function () {
  //1-调用getUserInfo() 获取用户的基本信息
  getUserInfo();

  //2-点击“退出”按钮，实现退出功能
  // layer.confirm(content, options, yes, cancel) - 询问框
  var layer = layui.layer;
  // 2-1 给退出按钮绑定点击事件
  $('#btnLoginOut').on('click', function () {
    //(1)询问-提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // console.log('ok');
      //（2）清空本地存储中的 token
      localStorage.removeItem('token');
      // (3) 重新跳转到登录页面
      location.href = '/Day-1/login.html';
      // (4) layui自带的，关闭confirm询问框
      layer.close(index);
    });
  })



})








//1-获取用户的基本信息--不写在入口函数内，就是全局函数，方便子页面调用此函数
function getUserInfo() {
  $.ajax({
    method: "get",
    // 地址已封装根路径拼接
    url: '/my/userinfo',
    //headers 请求头配置对象
    /* `ajaxPrefilter` 函数，在我们调用 `$.ajax()` 后，并且在请求服务器之前调用的过滤器，那么我们能统一设置根路径，那么我们就可以去统一设置请求头 */
    // headers:{
    //     // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
    //     Authorization:localStorage.getItem('token')||''
    // },
    success: function (res) {
      // console.log(res);
      // console.log(res.data.username[0]);//6
      /* {status: 0, message: "获取用户基本信息成功！", data: {…}}
               data:
               email: ""
               id: 34393
               username: "669"
               nickname: ""
               user_pic: null
               __proto__: Object
               message: "获取用户基本信息成功！"
               status: 0                         */

      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！');
      }
      // 1-2-调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data);
    },

    //3. 全局统一挂载 complete 回调函数,每一个权限的请求不需要每次去再写一次判断complete的逻辑代码
    // 3.控制用户的访问权限，优化权限控制的代码，封装到baseAPI中

    //用户如果没有登录，是不允许用户访问后台主页，所以我们需要进行权限的校验，可以利用请求后服务器返回的状态来决定 

    //(3-1)- 在调用有权限接口的时候，指定`complete`回调函数，这个回调函数不管成功还是失败都会调用;
   /*  complete: function (res) {
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
        // location.href = '/Day-1/login.html';
      }

    } */




  })



}

// 1-2-调用 renderAvatar 渲染用户的头像
function renderAvatar(user) {
  //1.获取用户的名称
  var name = user.nickname || user.username;
  //2.设置欢迎的文本内容
  $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
  //3.按需渲染用户的头像
  if (user.user_pic !== null) {
    //3-1 渲染图片头像，用户已设置过图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();

  } else {
    //3-2 渲染文本头像，刚注册的用户还没来得及设置图片头像，自动显示文本头像
    $('.layui-nav-img').hide();
    var first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();

  }


}