/*
 * @Date: 2024-05-25 09:32:51
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-25 15:32:24
 * @FilePath: \gesrec\global.js
 */
/*
 * @Date: 2024-05-25 09:32:51
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-25 11:08:38
 * @FilePath: \gesrec\global.js
 */

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

function check_cookie() {
    const cookies = document.cookie;
    const currentPathname = window.location.pathname;
    var parts = currentPathname.split(/\//);
    var lastElement = parts[parts.length - 2];
    if (cookies == "" && lastElement != "log_in" && lastElement != "create_account") {
        window.location.href = '../../pages/log_in/local.html';
    }

}

window.onload = function () {
    inner_head();
    //check_cookie();
};

