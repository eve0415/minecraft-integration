module.exports = class webhookManager {
	constructor(websocketManager, webhook, options = {}) {
		this.socketManager	= websocketManager;
		this.webhook 				= webhook;
		this.sendType 			= options.sendType;
		this.sendID 				= options.sendID;
	}
	
	get sendData() {
		return { type: this.sendType, id: this.sendID };
	}
};
