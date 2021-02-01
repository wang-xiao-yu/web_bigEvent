$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 1-获取文章分类的列表
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                // {status: 0, message: "获取文章分类列表成功！", data: Array(25)}
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);

            }
        })
    }


    //2-为 添加类别 按钮绑定事件
    var indexAdd = null   // 根据索引，关闭对应的弹出层   layer.close(indexAdd);
    $('#btnAdd').on('click', function () {
        // alert('ok');
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px']
            , content: $('#add').html()
        });
    })



    //3-实现添加文章分类的功能
    /* 发起Ajax请求，注意，这个确认添加按钮不是写死的，form 表单弹框是点击后动态生成的，所以我们通过事件委派方式给表单绑定`submit`事件 */

    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        // alert('ok');
        $.ajax({
            type: 'post',
            url: "/my/article/addcates",
            //快速获取表单内填写的数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);//{status: 0, message: "新增文章分类成功！"}
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类失败！');
                }
                //调用获取文章分类的列表函数，渲染最新的列表数据
                initArtCateList();
                //弹出的提示框
                layui.layer.msg('新增文章分类成功!');
                // 根据索引，关闭对应的弹出层  layer.close(index) - 关闭特定层
                layer.close(indexAdd);
            }
        })
    })



    //4 点击 编辑 按钮 弹出 修改文章分类的弹出层
    // 通过委托方式，为动态创建的表单的编辑按钮添加 点击事件  body=tbody都可以

    //4-1 修改文章分类
    var indexEdit = null;
    $('tbody').on('click', '#edit', function () {
        // alert('ok')
        // 4-1 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px']
            , content: $('#edit_add').html()
        });

        //4-2 为修改文章分类的弹出层填充表单数据
        /* 点击不同的条目，那么编辑里面的内容应该是对应的，目前问题，在代码层面，是不知道到底点击了哪个按钮，这里我们可以通过给对应 编辑按钮绑定id来实现 */
        //（1）为编辑按钮绑定 `data-id` 自定义属性
        var id = $(this).attr('data-id');
        console.log(id);
        //(2)在展示弹出层之后，根据 `id` 的值发起请求获取文章分类的数据，并填充到表单中
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res.data);
                // {Id: 1, name: "最新", alias: "删除不了的", is_delete: 0}
                form.val('form-edit', res.data)
            }
        })
    })


    //5 更新修改过后的文章分类的数据
    //（1）通过 事件委派 的方式，给修改按钮绑定提交事件
    $('body').on('submit', '#form_edit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //查阅接口文档，利用 `$.ajax()` 发送 `post` 请求
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            //快速获取表单内的数据
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                //{status: 0, message: "更新分类信息成功！"}
                //判断服务器返回的 status 是否等于0，如果不等于，利用 `layer.msg` 提示用户
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！');
                }
                //如果等于0，代表编辑成功
                layer.msg('更新分类信息成功!');
                //(1)关闭当前弹出层
                layer.close(indexEdit);
                //(2)调用 `initArtCateList()` 方法获取最新的修改过后的数据
                initArtCateList();
            }

        })
    })



    //6 删除文章分类功能
    /* 
    1- 为删除按钮绑定 `btn-delete` 类名，并添加 `data-id` 自定义属性
    2- 通过委托的形式，为删除按钮绑定点击事件 */
    $('tbody').on('click', '.btn-delete', function (e) {
        // alert('ok')
        //1-获取当前点击的删除按钮的id
        var id = $(this).attr('data-id');
        console.log(id);
        // 2-弹出询问框，提示用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something  发起ajax请求
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    // {status: 1, message: "管理员不允许删除 最新 和 科技 这两个分类!"}
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除文章分类成功！');
                    //关闭询问框
                    layer.close(index);
                    //更新，删除后的页面数据
                    initArtCateList()

                }
            })

        });
    })















})