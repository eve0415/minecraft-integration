module.exports = (client, error) => client.error(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
