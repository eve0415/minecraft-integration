const set = async (instance, message, res) => {
  const channelID = res.channel ? res.channel.replace('<#').replace('>') : message.channel.id;
  const mes = await message.guild.channels.cache.get(channelID).send('Configuring...');
  
  if (res.type === 'chat') {
    // TODO: later
  } else if (res.type === 'status') {
    await mes.channel.updateOverwrite(message.guild.roles.everyone, { deny: 'SEND_MESSAGES' });
    instance.database.addStatusMesCache(channelID, mes.id, res.id);
    
    if (res.id !== 'all') return await mes.edit('', instance.statusPage.getPage(res.id));
  }
};

module.exports = {
  name: 'set',
  cmdOptions: {
    alias: ['s'],
    description: 'チャンネル設定',
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
