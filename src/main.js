const { Client, Collection }  = require('discord.js');
const { readdir }             = require('fs');
const readdirPromise          = require('util').promisify(readdir);

const socketManager       = require('./managers/websocketManager');
const commandParser       = require('./modules/commandParser');
const taskManager         = require('./managers/taskManager');
const reactionController  = require('./modules/reactionController');

module.exports = class MinecraftIntegrations {
  constructor() {
    this.config      = require('./config');
    this.logger      = require('./logger');
    this.database    = require('./database');
    this.statusPage  = require('./modules/statusPage');

    this._init();
  }

  get client() {
    return this.bot;
  }

  async loadEvents() {
    this.logger.info('Initializing events');

    // Discord Event
    const DiscordEvtFiles = await readdirPromise('./src/events/Discord/');
    DiscordEvtFiles.forEach(file => {
      if (!file.endsWith('.js')) return;
      const eventName = file.split('.')[0];
      const event = require(`./events/Discord/${file}`);
      this.logger.info(`Loading Discord Event: ${eventName}`);
      this.bot.on(eventName, event.bind(null, this));
    });

    // Websocket Event
    const WebsocketEvtFiles = await readdirPromise('./src/events/Websocket/');
    WebsocketEvtFiles.forEach(file => {
      if (!file.endsWith('.js')) return;
      const eventName = file.split('.')[0];
      const event = require(`./events/Websocket/${file}`);
      this.logger.info(`Loading Websocket Event: ${eventName}`);
      this.socketManager.on(eventName, event.bind(null, this));
    });
  }

  async loadCommands() {
    this.logger.info('Subscribing Commands...');
    const files = await readdirPromise('./src/commands/');
    files.forEach(cmd => {
      const commandName = cmd.split('.')[0];
      const props = require(`./commands/${cmd}`);
      this.logger.info(`Loading Command: ${commandName}`);
      this.commands.set(props.name, props);
      const c = this.parser.addCommand(props.name, props.cmdOptions);
      props.options.forEach(option => c.options(option.name, option.type, option.opt));
    });
  }

  async cacheStatusPage() {
    const cache = this.database.getAllServer();
    cache.forEach((server) => {
      this.statusPage.addStatus(server.ID, server.type);
      if (server.name) this.statusPage.setName(server.ID, server.name);
    });
    // We have to load this after the pages for reactionController are initialized.
    this.reactionController = new reactionController(this);
  }

  _login() {
    this.bot.login();
  }

  _init() {
    this.logger.info('-------------------------------');
    this.logger.info('Starting...');
    require('./helpers/process')(this);

    this.bot            = new Client({ partials: ['GUILD_MEMBER'] });
    this.commands       = new Collection();
    this.socketManager  = new socketManager(this);
    this.taskManager    = new taskManager(this);
    this.parser         = new commandParser({ usePrefix: true, defaultPrefix: '!' });

    this.loadEvents();
    this.loadCommands();
    this.cacheStatusPage();

    this._login();
  }
};

