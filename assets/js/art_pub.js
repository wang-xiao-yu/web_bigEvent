$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate()
    //2-调用 `initEditor()` 方法，初始化富文本编辑器：
    initEditor();

    //1-定义加载文章分类的方法,用模板引擎渲染到页面
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                // {status: 0, message: "获取文章分类列表成功！", data: Array(2)}

                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // layer.msg('获取文章分类列表成功！');
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 动态渲染填充，一定要记得调用 form.render() 方法，重新渲染数据
                form.render();
            }
        })
    }


    //3-实现基本裁剪效果
    // （1）. 初始化图片裁剪器
    var $image = $('#image');

    // （2）. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // （3）. 初始化裁剪区域
    $image.cropper(options)


    //4.隐藏的图片文件选择框
    //为 选择封面 的按钮注册点击事件，程序调用点击，显示选择图片文件框
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })



    //5.更换裁剪的图片
    //（1）监听 隐藏的图片文件选择框  coverFile  ，为其绑定change 事件
    $('#coverFile').on('change', function (e) {
        //(2)获取用户选择的文件列表数组
        var files = e.target.files;
        //选择的地1张图片
        var file = files[0];
        //（3）判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('你没有选择图片！');
        }
        layer.msg('你已选择了新的图片');

        //5-2 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 5-3 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })




    //6.分析发布文章的实现步骤
    //(1)定义文章的发布状态
    var art_state = '已发布';
    //(2)为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })


    //7.基于`Form`表单创建`FormData`对象,为表单绑定submit提交事件
    //（1）为发布文章的 Form 表单添加 `id` 属性，阻止表单默认提交行为

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // (2). 基于 form 表单，快速创建一个 FormData 对象
        var myform = document.getElementById('form-pub');
        var fd = new FormData(myform);

        // var fd = new FormData($(this)[0]) // 综合写法
        // (3). 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);

        fd.forEach(function (v,k) {
            console.log(k,v);
          })

        //（4）将裁剪后的封面追加到`FormData`对象中
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起`Ajax`请求实现发布文章的功能-----------
                publishArticle(fd);
            })
    })


    // 6. 发起`Ajax`请求实现发布文章的功能--------------------
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/Day-1/article/art_list.html'
            }
        })
    }

    /* 
     Ajax 操作往往用来提交表单数据。为了方便表单处理,HTML5 新增了一个 FormData 对象，可以模拟表单操作;
    */




})