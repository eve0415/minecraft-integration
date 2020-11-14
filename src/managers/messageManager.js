module.exports = class webhookManager {
  constructor(webhook, serverID) {
    this.webhook = webhook;
    this.id      = Number(serverID);
  }
  
  send(message, name, uuid) {
    this.webhook.send(message, {
      username: name,
      avatarURL: uuid ? `https://crafatar.com/avatars/${uuid}` : null,
    });
  }
};

module.exports = class minecraftLogManager {
  constructor(channel, serverID) {
    this.channel = channel;
    this.id      = serverID;
  }
  
  send(message) {
    this.channel.send(message);
  }
};

