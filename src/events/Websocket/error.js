module.exports = (client, err) => {
	client.error("An error was confirmed when communicating with Minecraft server");
	client.error(err);
};
