let serversIp = null;

async function setServerIp() {
    const servers = [
        'http://182.92.78.173:5000',
        'http://127.0.0.1:5000'
    ];

    for (let i = 0; i < servers.length; i++) {
        try {
            const response = await fetch(servers[i], {
                method: 'POST'
            });
            if (response.ok) {
                serversIp = servers[i];
                console.log(`Server IP set to: ${serversIp}`);
                return;
            }
        } catch (error) {
            // Ignore the error and try the next server
        }
    }

    console.log('No available servers.');
}

// Call the function to set the server IP
setServerIp();
