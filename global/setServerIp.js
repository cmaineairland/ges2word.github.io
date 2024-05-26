let serversIp = null;

async function setServerIp() {
    const servers = [
        'https://182.92.78.173:5000',
        'http://127.0.0.1:5000'
    ];

    for (let i = 0; i < servers.length; i++) {
        try {
            const response = await fetch(servers[i], {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: 'ping' }) // 添加请求体
            });
            if (response.ok) {
                serversIp = servers[i];
                console.log(`Server IP set to: ${serversIp}`);
                return;
            }
        } catch (error) {
            console.error(`Error connecting to server ${servers[i]}: `, error);
        }
    }

    console.log('No available servers.');
}

// Call the function to set the server IP
setServerIp();
