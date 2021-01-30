$(function () {

    var form = layui.form;
    // 1-利用 `form.verify()`  来定义规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 不能与旧密码一致
        somePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能相同！"
            }
        },
        // 两次密码是否相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }

    })


    //2- 发起请求实现重置密码的功能
    // 监听表单的提交事件
    $('.layui-form').on('submit',function (e) { 
        //2-1 阻止表单的默认提交行为
        e.preventDefault();
        //2-2 发起ajax的post请求
        $.ajax({
            type:'post',
            url:'/my/updatepwd',
            //快速获取表单内的数据，设置为提交的数据
            data:$(this).serialize(),
            success:function (res) {
                // 如果 服务器返回的 `status` 不等于0，说明失败，利用 l`ayui.layer.msg` 来进行提示
                if(res.status!==0){
                    return layer.msg('更新密码失败！')
                }

                // 如果更新成功，重置一下表单内容
                layer.msg('更新密码成功！');//{status: 0, message: "更新密码成功！"}
                //jq对象转为dom对象，调用重置方法
                $('.layui-form')[0].reset();
                
              }
        })
     })







})