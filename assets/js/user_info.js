$(function () {

    //1- form表单的验证规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        //方法1-昵称的验证   校验表单数据
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
        //方法2
        // ,nickname: [
        //     /^[\S]{6,12}$/
        //     ,'密码必须6到12位，且不能出现空格'
        //   ] 



    })

    //调用初始化-获取用户的基本信息的函数
    initUserInfo();
    // 2-初始化-获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                // status: 0, message: "获取用户基本信息成功！", data: {…}}
                //data: {id: 34393, username: "669", nickname: "", email: "", user_pic: null}
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                layer.msg('获取用户信息成功');

                //2-2 调用 `form.val()` 方法为表单赋值
                // 语法：form.val('filter', object);如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
                form.val('formUserInfo', res.data);
            }
        })

    }


    //3 重置表单的数据
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //重新调用 `initUserInfo()` 函数，重新获取用户信息
        initUserInfo()
    })


    //4 发起请求更新用户的信息
    //监听表单的提交事件
    $('.layui-form').on('submit',function (e) {
        //4-1 阻止表单的默认提交行为
        e.preventDefault();
        //4-2 发起ajax请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            // 4-2-1 快速获取表单所填写的数据
            data:$(this).serialize(),
           /*  data:{
                id:'id',
                nickname:'nickname',
                email:'email'
            }, */
            success:function (res) {
                console.log(res);
                // {status: 0, message: "修改用户信息成功！"}
                if(res.status!==0){
                    return layer.msg('更新用户信息失败！')
                }
               layer.msg('更新用户信息成功');
                 // 4-2-1-1 调用父页面的方法，重新渲染用户的头像和用户的信息  window=ifarme parent=index
                 window.parent.getUserInfo();

              }
        })


      })







})




/*
表单赋值 / 取值
语法：form.val('filter', object);
用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。


//1-给表单赋值
form.val("formTest", {
//formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
  "username": "贤心" // "name": "value"
  ,"sex": "女"
  ,"auth": 3
  ,"check[write]": true
  ,"open": false
  ,"desc": "我爱layui"
});

//2-获取表单区域所有值
var data1 = form.val("formTest");



*/