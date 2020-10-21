module.exports = async (instance, status, data) => {
	// console.log(status, data);
	await instance.database.updateServer(data.port, data.platform, status, instance);
	
	instance.statusPage.updateStatus(data.port, status, data);
};
