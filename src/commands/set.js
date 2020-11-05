const set = async (instance, message, res) => {
  const channelID = res.channel ? res.channel.replace('<#').replace('>') : message.channel.id;
  const mes = await message.guild.channels.cache.get(channelID).send('Configuring...');
  
  if (res.type === 'chat') {
    if (res.id === 'all') return mes.edit('You cannot choose all server for chatting');
    
    const cache = instance.database.getFromChannelID(channelID);
    if (cache?.filter(c => c.serverID === res.id).length) return mes.edit(`You have already configured for this server ID: ${res.id}`);
    
    const webhooks = await mes.channel.fetchWebhooks();
    
    if (!webhooks?.filter(w => w.owner === instance.client.user).first()) {
      const webhook = await mes.channel.createWebhook('Minecraft');
      instance.taskManager.addWebhook(webhook, res.id);
    }
    instance.database.addChannelCache(channelID, res.id);
    mes.edit('Succesfully configured!');
  } else if (res.type === 'status') {
    await mes.channel.updateOverwrite(message.guild.roles.everyone, { deny: 'SEND_MESSAGES' });
    instance.database.addStatusMesCache(channelID, mes.id);
    
    if (res.id !== 'all') {
      mes.edit('', instance.statusPage.getPage(res.id));
    } else {
      await mes.edit('', instance.reactionController.getPage(1));
      instance.reactionController.init(mes);
    }
    instance.taskManager.addCache(mes);
  }
};

module.exports = {
  name: 'set',
  cmdOptions: {
    alias: ['s'],
    description: 'Set Channel',
    usage: 'set <status | chat>',
  },
  options: [
    {
      name: 'type',
      type: 'string',
      opt: { 
        alias: ['t'],
        required: true,
      },
    },
    { 
      name: 'channel',
      type: 'channel',
      opt: { alias: ['c'] },
    },
    {
      name: 'id',
      type: 'int',
      opt: { required: true },
    },
  ],
  owner: true,
  run: set,
};
