const log4js = require("log4js");

log4js.configure({
	appenders: {
		console : {
			type: "console",
			layout: {
				type: "pattern",
				pattern: "%[[%d{hh:mm:ss.SSS}]%] %[[%p]%] %m",
			},
		},
	},
	categories: {
		default: { appenders : ["console"], level : "info" },
		debug: { appenders : ["console"], level : "debug" },
		error: { appenders : ["console"], level : "error" },
		fatal: { appenders : ["console"], level : "fatal" },
	},
});

module.exports = {
	debug(log) {
		log4js.getLogger("debug").debug(log);
	},
	info(log) {
		log4js.getLogger("default").info(log);
	},
	warn(log) {
		log4js.getLogger("default").warn(log);
	},
	error(log) {
		log4js.getLogger("error").error(log);
	},
	fatal(log) {
		log4js.getLogger("fatal").fatal(log);
	},
	shutdown() {
		log4js.shutdown();
	},
};
