module.exports = instance => {
	instance.socketManager.fetchWebhook();
	instance.logger.info(`${instance.client.user.tag} has logged in and is Ready!`);
};
