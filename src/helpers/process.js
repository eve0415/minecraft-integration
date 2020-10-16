module.exports = instance => {
	process.on("uncaughtException", err => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
		instance.logger.fatal(`Uncaught Exception: ${errorMsg}`);
		instance.logger.fatal(err);
		
		process.exit(1);
	});
	
	process.on("unhandledRejection", err => {
		instance.logger.error(`Unhandled rejection: ${err}`);
		instance.logger.error(err);
	});
	
	process.on("SIGINT", function() {
		instance.logger.info("Detected Ctrl + C");
		instance.logger.info("Exiting...");
		process.exit();
	});
	
	process.on("beforeExit", () => {
		instance.logger.shutdown();
	});
};

