const webhookManager = class webhookManager {
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

const minecraftLogManager = class minecraftLogManager {
  constructor(serverID, channel) {
    this.id      = serverID;
    this.channel = channel;
  }
  
  send(message) {
    this.channel.send(message);
  }
};

module.exports = { webhookManager, minecraftLogManager };
