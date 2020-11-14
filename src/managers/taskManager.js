const { webhookManager, minecraftLogManager } = require('./messageManager');

module.exports = class TaskManager {
  constructor(instance) {
    this.instance = instance;
    this.client   = instance.client;
    this.database = instance.database;
    
    this.ready = false;
    
    this.statusMessage  = new Array;
    this.webhooks       = new Array;
    this.logChannels    = new Array;
  }
  
  reloadCache() {
    if (!this.client.readyAt) throw new Error('Bot is not ready');
    this.cacheStatusMessage();
    this.cacheWebhooks();
    this.cacheChannelsForLog();
  }
  
  async cacheStatusMessage() {
    this.instance.logger.info('Trying to cache necessarily message');
    
    const cache = this.database.getStatusMesCache();
    if (!cache.length) return this.instance.logger.info('No message to cache!');
    
    for (const c of cache) {
      await this.client.channels.cache.get(c.channelID).messages.fetch(c.messageID)
        .then(mes => {
          const data = embedParse(mes);
          if (data.Page) this.instance.reactionController.init(mes);
          this.statusMessage.push(mes);
        })
        // Probably user have deleted this channel / message or have no permission to fetch anymore :(
        // Remove from cache database
        .catch(() => this.database.removeStatusMessage(c.messageID));
    }
    
    this.instance.logger.info('Succesfully cached messages.');
    this.refreshStatus();
  }
  
  async cacheChannelsForLog() {
    this.instance.logger.info('Trying to cache all channels for logging');
    
    const cache = this.database.getAllChannelLog();
    if (!cache.length) return this.instance.logger.info('No message to cache!');
    
    for (const c of cache) {
      const channel = await this.client.channels.cache.get(c.channelID);
      if (!channel) {
        // Probably user have deleted this channel or have no permission to use anymore :(
        // Remove from cache database
        this.database.removeChannelLog(c.channelID);
      }
      
      this.logChannels.push(new minecraftLogManager(c.serverID, channel));
    }
    this.instance.logger.info('Succesfully cached channels to send logs.');
  }
  
  async cacheWebhooks() {
    this.instance.logger.info('Trying to cache all webhook datas');
    
    const cache = this.database.getAllChannelCache();
    if (!cache.length) return this.instance.logger.info('No webhook to cache!');
    
    for (const c of cache) {
      await this.client.channels.cache.get(c.channelID).fetchWebhooks()
        .then(webhooks => {
          const webhook = webhooks.filter(w => w.owner === this.instance.client.user).first();
          this.webhooks.push(new webhookManager(webhook, c.serverID));
        })
        // Probably user have deleted this channel / webhooks or have no permission to fetch anymore :(
        // Remove from cache database
        .catch(() => this.database.removeChannelCache(c.channelID));
    }
    
    this.instance.logger.info('Successfully cached webhook datas.');
    this.ready = true;
  }
  
  refreshStatus() {
    this.statusMessage.forEach(async mes => {
      const data = embedParse(mes);
      
      try {
        if (data.Page) {
          const [now, max] = data.Page.split('/');
          mes.edit(this.instance.reactionController.getPage(now));
          await mes.fetch(true); // Needs to update cache
          if (max !== 1 && mes.reactions.cache.size === 0) this.instance.reactionController.doReactions(mes);
        } else {
          mes.edit(this.instance.statusPage.getPage(data.ID));
        }
      } catch(e) {
        this.instance.logger.error(e);
      }
    });
  }
  
  addCache(mes) {
    this.statusMessage.push(mes);
  }
  
  addWebhook(webhook, port) {
    this.webhooks.push(new webhookManager(webhook, port));
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
  
  sendWebhook(data) {
    if (!this.ready) return;
    
    const filtered = this.webhooks.filter(webhook => webhook.id === data.port);
    filtered.forEach(webhook => {
      data.UUID.startsWith('00000000') ? webhook.send(data.message, data.name) : webhook.send(data.message, data.name, data.UUID);
    });
  }
  
  sendLog(id, embed) {
    const filtered = this.logChannels.filter(data => data.id === id || data.id === 0);
    filtered.forEach(data => {
      data.channel.send(embed);
    });
  }
};

const embedParse = mes => {
  if (!mes.embeds.length) return null;
  
  const args = mes.embeds[0].footer?.text?.split(' ');
  return { ID: args[1], Page: args[3] };
};
