module.exports = async (client, data) => {
	if (!data.code) {
		const code = await client.linkManager.new(null, data.UUID);
		client.socketManager.linkPlayer({ UUID: data.UUID, state: "linking", result: code });
	} else {
		client.linkManager.check(data.code, null, data.UUID)
			.then(result => client.socketManager.linkPlayer({ UUID: data.UUID, state: "linked", result: result }))
			.catch(err => client.socketManager.linkPlayer({ UUID: data.UUID, state: "error", result: err }));
	}
};
