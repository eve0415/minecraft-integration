module.exports = (instance, error) => instance.logger.error(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
