/*
 * @Date: 2024-05-25 20:12:23
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-26 23:41:17
 * @FilePath: \gesrec\pages\news\local.js
 */
/*
 * @Date: 2024-05-25 20:12:23
 * @LastEditors: Qianshanju
 * @E-mail: z1939784351@gmail.com
 * @LastEditTime: 2024-05-26 15:10:05
 * @FilePath: \gesrec\pages\news\local.js
 */
function changeContent(url) {
    // 假设你有一个包含要上传的JSON数据的变量jsonData
    var jsonData = {
        type: 'getNews',
        newsTitle: url
    };
    console.log(serversIp);
    fetch(serversIp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // 解析并打印后端返回的JSON数据
            return response.json();
        })
        .then(data => {
            var Element = document.getElementById('article_body');
            Element.innerHTML = data.result;
        })
        .catch(error => {
            // 处理错误
            console.error('There was a problem with the fetch operation:', error);
        });
}