$(function () {

    // 1.点击链接--切换登录-注册
    // （1）.点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // （2).点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })



    //2. 从layui中获取form对象
    var form = layui.form;
    //3. layer.msg(content, options, end) - 提示框
    var layer = layui.layer;


    // 2-1 通过 form.verify() 函数，自定义了校验规则
    form.verify({
        // (1) 自定义了一个密码校验规则；
        // 数组的形式:数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // (2) 校验两次密码是否一致的规则
        // 函数式: username: function(value, item){ //value：表单的值、item：表单的DOM对象}
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可

            //类似后代选择器=类名 属性，选择类名为reg-box元素 包裹的 name 属性为password的元素
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }

        }

    })



    // 3.监听注册表单的提交事件 
    $('#form_reg').on('submit', function (e) {
        // (1) 阻止表单的默认跳转提交行为
        e.preventDefault();

        // (2) 发起ajax的post请求
        //--------------------------- 获取表单用户输入的数据--方法1------
        // 方法2-----data:$(this).serialize(),

        var data = {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        };
        
        $.post( //url:'http://ajax.frontend.itheima.net/api/reguser'
            '/api/reguser', data, function (res) {
                if (res.status !== 0) {
                    // 返回注册失败的信息提示-提示框
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                // console.log('注册成功！');
                layer.msg('注册成功！请登录');

                //注册成功后，模拟人的点击行为，跳转到登录页面
                $('#link_login').click();

            }
        )

    })



    //4.监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 4-1 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            // url: 'http://ajax.frontend.itheima.net/api/login',
            url:'/api/login',
            method: 'POST',
            // 4-2 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                // 4-3 请求成功之后提示用户：登录成功，保持token信息，跳转到后台主页
                layer.msg('登录成功！');
                // （1）将登录成功得到的 token 字符串，保存到 localStorage 中 ,用于有权限接口的身份认证
                localStorage.setItem('token', res.token);
                // （2）跳转到后台主页
                location.href = '/Day-1/index.html';
            }
        })
    })
  
// token 用来标识用户是否登录的令牌，后台的页面需要用户登录之后才能查阅，那么权限校验的机制也就出来了，需要检验权限的页面后台先判断请求头里面是否有token，以此来判断是否是登录状态
























})