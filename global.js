/*
 * @Date: 2024-05-25 09:32:51
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-26 14:32:22
 * @FilePath: \gesrec\global.js
 */
/*
 * @Date: 2024-05-25 09:32:51
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-25 11:08:38
 * @FilePath: \gesrec\global.js
 */

let fetchIp = 'http://172.20.104.194:5000'

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

function getFetchIp() {
    fetch('http://127.0.0.1:5000', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // 处理成功的响应
            fetchIp = 'http://127.0.0.1:5000'
        })
        .catch(error => {
            console.error('Error fetching from 127.0.0.1:', error);
            // 如果请求失败，则尝试请求另一个地址
            return fetch('http://172.20.104.194:5000', { method: 'POST' });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // 处理成功的响应
            fetchIp = 'http://172.20.104.194:5000'
        })
        .catch(error => {
            console.error('Error fetching from 172.20.104.194:', error);
            // 处理所有请求都失败的情况
        });

}

window.onload = function () {
    getFetchIp();
    inner_head();
    //check_cookie();
};

