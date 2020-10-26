module.exports = class webhookManager {
  constructor(webhook, serverID) {
    this.webhook        = webhook;
    this.id             = Number(serverID);
  }
  
  send(message, name, uuid) {
    console.log(message);
    this.webhook.send(message, {
      username: name,
      avatarURL: uuid ? `https://crafatar.com/avatars/${uuid}` : null,
    });
  }
};
