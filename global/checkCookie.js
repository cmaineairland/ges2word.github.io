function check_cookie() {
    const cookies = document.cookie;
    const currentPathname = window.location.pathname;
    var parts = currentPathname.split(/\//);
    var lastElement = parts[parts.length - 2];
    if (cookies == "" && lastElement != "log_in" && lastElement != "create_account") {
        window.location.href = '../../pages/log_in/local.html';
    }

}

//window.onload = check_cookie(); 