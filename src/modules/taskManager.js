module.exports = class TaskManager {
  constructor(instance) {
    this.instance           = instance;
    this.client             = instance.client;
    this.database           = instance.database;
    
    this.statusMessage = new Array;
  }
  
  reloadCache() {
    if (!this.client.readyAt) throw new Error('Bot is not ready');
    this.instance.logger.info('Caching necessarily message');
    this.cacheStatusMessage();
    this.instance.logger.info('Caching complete!');
  }
  
  cacheStatusMessage() {
    const cache = this.database.getStatusMesCache();
    cache.forEach(c => {
      this.client.channels.cache.get(c.channelID).messages.fetch(c.messageID)
        .then(mes => {
          const data = embedParse(mes);
          if (data.Page) this.instance.reactionController.init(mes);
          this.statusMessage.push(mes);
        })
      // Probably user have deleted this channel / message or have no permission to fetch anymore :(
      // Remove from cache database
        .catch(() => this.database.removeStatusMessage(c.messageID));
    });
    this.refreshStatus();
  }
  
  refreshStatus() {
    this.statusMessage.forEach(async mes => {
      const data = embedParse(mes);
      
      try {
        data?.Page
          ? mes.edit(this.instance.reactionController.getPage(data.Page.split('/')[0]))
          : mes.edit(this.instance.statusPage.getPage(data.ID));
      } catch(e) {
        this.instance.logger.error(e);
        this.database.removeStatusMessage(mes.id);
        this.statusMessage = this.statusMessage.filter(m => m.id !== mes.id);
      }
    });
  }
  
  addCache(mes) {
    this.statusMessage.push(mes);
  }
  
  changePage(reaction, user) {
    if (!(reaction.emoji.name === '◀️' || reaction.emoji.name === '▶️')) return reaction.users.remove(user);
    
    const [now, max] = embedParse(reaction.message).Page.split('/');
    let page;
    if (reaction.emoji.name === '◀️') {
      page = Number(now) - 1 <= 0 ? Number(max) : Number(now) - 1;
    } else {
      page = Number(now) + 1 > Number(max) ? 1 : Number(now) + 1;
    }
    reaction.message
      .edit(this.instance.reactionController.getPage(page))
      .then(() => reaction.users.remove(user));
  }
};

const embedParse = mes => {
  if (!mes.embeds.length) return null;
  
  const args = mes.embeds[0].footer?.text?.split(' ');
  return { ID: args[1], Page: args[3] };
};
