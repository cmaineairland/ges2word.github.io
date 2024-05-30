function check_cookie() {
    const cookies = document.cookie;
    const currentPathname = window.location.pathname;
    var parts = currentPathname.split(/\//);
    var lastElement = parts[parts.length - 2];
    if (cookies == "") {
        window.location.href = '../../index.html';
    }


}

//window.onload = check_cookie(); 