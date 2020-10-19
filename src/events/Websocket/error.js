module.exports = (instance, err) => {
	instance.logger.error("An error was confirmed when communicating with Minecraft server");
	instance.logger.error(err);
};
