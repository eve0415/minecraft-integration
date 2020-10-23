module.exports = class TaskManager {
  constructor(instance) {
    this.instance  = instance;
    this.client    = instance.client;
    this.database  = instance.database;
    
    this.statusMessage = new Array;
  }
  
  reloadCache() {
    if (!this.client.readyAt) throw new Error('Bot is not ready');
    this.cacheStatusMessage();
  }
  
  cacheStatusMessage() {
    const cache = this.database.getStatusMesCache();
    cache.forEach(c => {
      this.client.channels.cache.get(c.channelID).messages.fetch(c.messageID)
        .then(mes => {
          const data = embedParse(mes);
          mes.edit(this.instance.statusPage.getPage(data.ID))
            .then(() => this.statusMessage.push(mes))
            .catch(() => this.database.removeStatusMessage(mes.id));
        })
      // Probably user have deleted this channel / message or have no permission to fetch anymore :(
      // Remove from cache database
        .catch(() => this.database.removeStatusMessage(c.messageID));
    });
  }
  
  refreshStatus() {
    this.statusMessage.forEach(mes => {
      const data = embedParse(mes);
      mes.edit(this.instance.statusPage.getPage(data.ID))
        .catch(() => this.database.removeStatusMessage(mes.id));
      
    });
  }
};

const embedParse = mes => {
  if (!mes.embeds.length) return;
  
  const args = mes.embeds[0].footer?.text?.split(' ');
  return { ID: args[1], Page: args[3] };
};
