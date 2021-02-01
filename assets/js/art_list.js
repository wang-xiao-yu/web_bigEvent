$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;  //---------渲染分页 

    //定义一个查询的参数对象q，将来请求数据的时候，需要将请求参数对象提交到服务器
    /* 查阅接口文档我们发现，需要提交的参数是比较多的，所以我们可以先来定义一下这个查询的参数对象，由于服务器文章的数量会很多，不能一次性请求回来，这种功能也是很常见的，分页查询 */
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页能够显示的条目数，默认每页显示2条
        cate_id: '', // 文章分类的 Id,你需要找哪一个分类下的文章，默认是所有文章
        state: '' // 你需要查找的是什么状态的文章
    }


    initTable();  // 1-获取文章的列表数据的方法
    initCate();   // 3-初始化 文章类别

    //2-定义美化时间格式的过滤器  ---通过 `template.defaults.imports` 定义过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }





    // 1-获取文章的列表数据的方法
    // initTable()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                //{status: 0, message: "获取文章列表成功！", data: Array(0), total: 0}
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！');

                // （1-2）---使用模板引擎渲染页面的数据----------------------
                var htmlStr = template('tpl-table', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);

                // 5---(1-3)-----调用渲染分页的方法-------------------------------
                renderPage(res.total)  //传入总的数据的条目数
            }
        })
    }



    //3-获取 并 初始化 文章类别-分类数据的方法    获取文章分类列表
    // initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "获取文章分类列表成功！", data: Array(5)}
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染文章分类的可选项
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)

                // 通过 layui 重新渲染表单区域的UI结构
                form.render();

            }
        })
    }


    //4.为表单的筛选按钮绑定提交事件
    $('#form-search').on('submit', function (e) {
        //(1)阻止表单的默认提交行为
        e.preventDefault();
        //(2)在事件里面获取到表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //(3)为查询参数对象 q 中对应的属性赋值,把这个值同步到我们 参数对象 `q` 里面
        q.cate_id = cate_id;
        q.state = state;
        //(4)根据最新的筛选条件，重新渲染表格的数据,再次调用 `initTable()` 方法即可
        initTable();

    })



    //5.-------------------调用渲染分页的方法-----------
    function renderPage(total) {  //1-传入的总的数据条目数
        // console.log(total);
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',        //指向存放分页的容器，值可以是容器ID、DOM对象
            //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total,           //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数
            curr: q.pagenum,   //页码值，设置默认被请求选中的数据，默认1
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 5-2 拿到最新选中的页码值  
            // 分页发生切换的时候，触发 jump 回调; 触发 jump 回调的方式有两种：
            // 1. 只要调用了 laypage.render() 方法，就会触发 jump 回调，造成死循环
            // 2. 手动点击页码的时候，会触发 jump 回调

            jump: function (obj, first) {//obj包含了当前分页的所有参数，比如：

                //1-把最新的选中的页码值，赋值到q这个查询参数对象中
                // console.log(obj.curr);  //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr;

                //2-实现切换每页展示多少条数据的功能
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit;


                // console.log(first);
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式1触发的，是死循环
                // 否则就是方式1,点击页码触发的，undefined


                //3-首次不执行 ，true=1            
                if (!first) {
                    //！undefiined = true 方式2时执行,若方式1时不调用initTable方法
                    //do something
                    initTable();
                }
            }


        });
    }


    //6.实现删除文章的功能
    //(1)为删除按钮绑定 `btn-delete` 类名和 `data-id` 自定义属性
    $('tbody').on('click', '.btn-delete', function () {
        //5.获取当前页面上的数据长度
        var len = $('.btn-delete').length;
        console.log(len);

        // 通过委托的形式，为删除按钮绑定点击事件处理函数
        // alert('ok');
        var id = $(this).attr('data-id'); //要删除的文章 Id，注意：这是一个URL参数

        // 1- 弹出询问框，确认取消，提示用户
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //2- do something  用户点击确认，发送请求，删除当前文章，携带文章`id`
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    // {status: 0, message: "获取文章列表成功！", data: Array(2), total: 5}
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    // 3- 请求成功之后，获取最新的文章列表信息
                    layer.msg('删除文章成功！');

                    //5- 当数据删除完成后，需要判断当前这一页面中，是否还有剩余的数据
                    //如果没有剩余数据了，则让 页码值 -1，
                    //再重新调用 initTable（）
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1,则让 页码值 -1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            // 4- 关闭当前弹出层
            layer.close(index);
        });
    })
    /* 
    ## 解决删除文章时的小 Bug
    1-问题：删除后，页码值虽然正常，但是当前页码的数据没有渲染出来
    2-解决：判断删除后，页面上是否还有数据
      - 判断当前页面的删除按钮的长度是否等于1
      - 如果等于1，那么我们让当前页码-1即可，如果不等于1，不用处理
    */




    //7.实现编辑 按钮的功能
    //（1）为编辑按钮绑定 ‘btn-edit’类名 与 ‘data-id’自定义属性
    //通过委托方式，注册点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // alert('ok')
        //7-1点击编辑按钮，跳转修改文章页面
        window.location.href = '/Day-1/article/art_edit.html';


        //7-2 为修改文章分类的页面填充表单数据---------------------------------------------没有完成修改文章填充数据---------
        /* 点击不同的条目，那么编辑里面的内容应该是对应的，目前问题，在代码层面，是不知道到底点击了哪个按钮，这里我们可以通过给对应 编辑按钮绑定id来实现 */
        //（1）为编辑按钮绑定 `data-id` 自定义属性
        var id = $(this).attr('data-id');
        console.log(id);
        //(2)在展示弹出层之后，根据 `id` 的值发起请求根据 Id 获取文章详情，并填充到表单中
        // $.ajax({
        //     method: 'get',
        //     url: '/my/article/' + id,
        //     success: function (res) {
        //         console.log(res);
        //         form.val('form-edit', res.data)
        //     }

        // })

    })


    //   //8. 监听编辑 内的确认修改 的提交事件---失败
    //     $('tbody').on('submit', '#form_edit', function (e) {
    //         alert('ok')
    //         e.preventDefault();
    //         $.ajax({
    //             method:'POST',
    //             url:'/my/article/edit',
    //             data:$(this).serialize(),
    //             success:function (res) { 
    //                 console.log(res);
    //                 if (res.status !== 0) {
    //                     return layer.msg('更新分类信息失败！');
    //                 }
    //                 //如果等于0，代表编辑成功
    //                 layer.msg('更新分类信息成功!');
    //                 //(1)关闭当前弹出层
    //                 layer.close(indexEdit);
    //                 //(2)调用 `initArtCateList()` 方法获取最新的修改过后的数据
    //                 initTable();
    //              }
    //         })


    //     })




















})