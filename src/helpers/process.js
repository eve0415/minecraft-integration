process.on("uncaughtException", err => {
	const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
	client.fatal(`Uncaught Exception: ${errorMsg}`);
	client.fatal(err);
	
	process.exit(1);
});

process.on("unhandledRejection", err => {
	client.error(`Unhandled rejection: ${err}`);
	client.error(err);
});

