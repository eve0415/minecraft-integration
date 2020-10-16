module.exports = (client, event, data) => {
	console.log(event);
	console.log(data);
	switch (event) {
		case "STARTING":
			return client.socketManager.status(client.embeds.starting);
			
		case "STARTED":
			return client.enableChat();
			
		case "STOPPING":
			client.disableChat();
			client.socketManager.status(client.embeds.stopping);
			
			setTimeout(() => {
				client.socketManager.status(client.embeds.offline);
			}, 3000);
			return; 
			
		case "STATUS":
			client.socketManager.status(client.embeds.status(data));
			
			return client.enableChat();
	}
};
