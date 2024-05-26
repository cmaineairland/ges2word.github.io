function detectOS() {
    var userAgent = window.navigator.userAgent;
    var platform = window.navigator.platform;
    var os = null;

    if (platform.startsWith('Win')) {
        os = 'Windows';
    } else if (platform.startsWith('Linux')) {
        os = 'Linux';
    } else if (platform.startsWith('Mac')) {
        os = 'MacOS';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        os = 'iOS';
    } else {
        os = 'Unknown';
    }

    return os;
}

console.log("Operating System: " + detectOS());
