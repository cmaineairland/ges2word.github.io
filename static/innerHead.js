/*
 * @Date: 2024-05-24 20:59:04
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-25 09:47:50
 * @FilePath: \gesrec\static\innerHead.js
 */
// 假设盒子的ID为'myBox'
var box = document.getElementById('head');

var content = `
    <img src="static/logo.png" alt="some_text" class="logo">
    <div class="button-container">
        <a href="/"><button class="button">首页</button></a>
        <a href="/手语识别"><button class="button">手语识别</button></a>
        <a href="/news"><button class="button">最新消息</button></a>
        <a href="/more_info"><button class="button">了解更多</button></a>
        <a href="/pay_for_us"><button class="button">付费捐赠</button></a>
        <a href="/connect_us"><button class="button">联系我们</button></a>
    </div>
`;

box.innerHTML = content;
