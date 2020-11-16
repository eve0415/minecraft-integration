module.exports = class webhookManager {
  constructor(id, webhook) {
    this.id      = Number(id);
    this.webhook = webhook;
  }
  
  sendChat(message, name, uuid) {
    this.webhook.send(message, {
      username: name,
      avatarURL: uuid ? `https://crafatar.com/avatars/${uuid}` : null,
    });
  }
  
  sendLog(message) {
    this.webhook.send(message);
  }
};
