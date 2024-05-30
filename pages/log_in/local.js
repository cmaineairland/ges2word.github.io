function get_username_password(event) {
    // 获取表单元素
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');

    // 获取用户输入的用户名和密码
    var username = usernameInput.value;
    var password = passwordInput.value;

    usernameInput.value = '';
    passwordInput.value = '';

    var data = {
        type: 'log_in',
        username: username,
        password: password,
    };

    fetch(serversIp, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Login failed');
            }
        })
        .then(data => {
            // 在此处理后端返回的响应数据
            // 根据后端返回的结果进行页面跳转
            if (data.message == 'success') {
                var cookie = username + '=' + password;
                var expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000));
                cookie += '; expires=' + expirationDate.toUTCString();
                document.cookie = cookie;
                window.location.href = '/'; // 登录成功，跳转到首页
            }
            else if (data.message == 'password wrong') {
                // 登录失败，可以显示错误消息或执行其他操作
                alert("用户名或密码错误！");
            }
            else if (data.message == 'account not exists') {
                alert("用户不存在！");
            }
            else {
                alert("未知错误");
            }
            // 可以根据响应结果进行页面跳转或其他操作
        })
        .catch(error => {
            console.error('Login error:', error.message);
        });

}