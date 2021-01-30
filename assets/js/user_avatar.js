$(function () {
    // var layer = layui.layer;
    // 实现基本裁剪效果
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 3 / 3,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    //2 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        //当用户点击“上传”按钮，就触发文件框的点击事件
        $('#file').click();
    })


    //3. 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        console.log(e);
        // 3-1 用户选择上传的所有图片文件 
        var filelist = e.target.files;
        console.log(filelist);//FileList {0: File, length: 1}
        // 3-2 判断用户是否上传文件
        if (filelist.length === 0) {
            return layui.layer.msg('请选择上传的图片');
        }
        layui.layer.msg('图片上传成功！！！');

        //3-3  拿到用户选择的文件
        var file = e.target.files[0];
        //（2).将文件，转化为路径
        var imgURL = URL.createObjectURL(file);
        // (3). 重新初始化裁剪区域 ,销毁cropper，并删除预览
        $image.cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })



    //4.为确定上传头像按钮。绑定点击事件
    $('#btnUpLoad').on('click', function () {
        //4-1 拿到用户裁剪之后的头像数据
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }) //转化为 `base64` 格式的字符串
            .toDataURL('image/png')

        //4-2 调用接口，把头像上传到服务器
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log(res);
                //{"status": 0,"message": "更新头像成功！"
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败！')
                }
                layui.layer.msg('更换头像成功！')

                // 4-3 调用父页面的方法，把最新的头像渲染到父页面上
                window.parent.getUserInfo()
            }
        })



    })







})