module.exports = (instance, reason) => {
	instance.logger.info(`Disconnected from Minecraft Server: ${reason}`);
};
