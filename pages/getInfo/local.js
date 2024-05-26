

function runScript() {
    fetch(fetchIp, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // 处理成功的响应
            console.log(fetchIp)
        })
        .catch(error => {


        });

}