module.exports = client => {
	client.socketManager.fetchWebhook();
	client.log(`${client.user.tag} has logged in and is Ready!`);
};
