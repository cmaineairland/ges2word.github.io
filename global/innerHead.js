function inner_head() {

    var box = document.getElementById('head');

    var content = `
        <img src="../../image/logo.png" alt="picture loose" class="logo">
        <div class="button-container">
            <a href="../index/local.html"><button class="head-button">首页</button></a>
            <a href="../recog/local.html"><button class="head-button">手语识别</button></a>
            <a href="../news/local.html"><button class="head-button">最新消息</button></a>
            <a href="../more_info/local.html"><button class="head-button">了解更多</button></a>
            <a href="../pay/local.html"><button class="head-button">付费捐赠</button></a>
            <a href="../connect/local.html"><button class="head-button">联系我们</button></a>
        </div>
    `;

    box.innerHTML = content;
}

inner_head(); 
