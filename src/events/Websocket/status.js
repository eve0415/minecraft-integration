module.exports = (instance, status, data) => {
	console.log(status, data);
	instance.database.updateServer(data.port, data.platform, status);
};
