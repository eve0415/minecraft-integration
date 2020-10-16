module.exports = instance => {
	instance.getSocketManager().fetchWebhook();
	instance.logger.info(`${instance.client.user.tag} has logged in and is Ready!`);
};
