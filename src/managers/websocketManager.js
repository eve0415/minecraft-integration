const { EventEmitter } = require('events');
const io = require('socket.io')();

module.exports = class socketManager extends EventEmitter {
  constructor(instance) {
    super();
    this.instance  = instance;
    this.client    = instance.client;
    this.database  = instance.database;
    this.logger    = instance.logger;
    
    this.connected  = 0;
    this.webhook    = new Array;
    
    this._init();
  }
  
  send(id, message) {
    io.in(id).emit('chat', { 
      name:     message.author.username,
      UUID:     null,
      message:  message.content
        ? message.attachments.size
          ? `${message.content} (Click this message to open the URL)`
          : message.content
        : 'Click this message to open the URL',
      URL:      message.attachments.size ? message.url : null,
    });
  }
  
  connectionEvent() {
    io.on('connection', sock => {
      this.logger.info('Succesfully connected to Minecraft Server');
      
      this.connected = this.connected++;
      
      this.listen(sock);
    });
  }
  
  async listen(sock) {
    sock.on('disconnecting', () => this.emit('status', 'offline', { port: Object.keys(sock.rooms)[0] }));
    sock.on('disconnect', (reason) => {
      this.connected = this.connected--;
      this.emit('disconnect', reason);
    });
    sock.on('error', (err) => this.emit('error', err));
    
    sock.on('STARTING', (data) => this.emit('status', 'start', data));
    sock.on('STOPPING', (data) => this.emit('status', 'stop', data));
    sock.on('STATUS', (data) => this.emit('status', 'online', data));
    
    sock.on('CHAT', (data) => this.instance.taskManager.sendWebhook(data));
    sock.on('ADVANCEMENT', (data) => this.emit('event', 'advancement', data));
    
    sock.on('SERVERINFO', (data) => this.emit('info', data));
    
    sock.on('ROOM', (roomID) => sock.join(roomID));
  }
  
  async _init() {
    this.logger.info('Loading Manager: Socket Manager');
    
    this.connectionEvent();
    
    io.listen(this.instance.config.port);
    
    this.logger.info('Socket Manager is ready!');
  }
};