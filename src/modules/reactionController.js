module.exports = class ReactionController {
  constructor(instance) {
    this.instance = instance;
    this.client   = instance.client;
    this.pages    = instance.statusPage.getAllPages();
  }
  
  init(msg) {
    msg.reactions.removeAll();
    this.doReactions(msg);
    this.createReactionCollector(msg);
  }
  
  createReactionCollector(msg) {
    // We actually don't need to filter any reactions as we handle everything,
    // but let's say we'll block reactions from this bot.
    const filter = (reaction, user) => user !== this.client.user;
    const collector = msg.createReactionCollector(filter);
    collector.on('collect', (reaction, user) => this.instance.taskManager.changePage(reaction, user));
  }
  
  doReactions(msg) {
    if (this.pages.length > 1) msg.react('◀️').then(() => msg.react('▶️'));
  }
  
  getPage(page) {
    if (!this.pages.length) return this.instance.statusPage.getNoPage();
    // There might be a case where there are no specific pages available,
    // so let's just return the first page.
    const p = this.pages[page - 1] ?? this.pages[0];
    const editedEmbed = p.embed.setFooter(`ID: ${p.id} Page: ${page}/${this.pages.length}`);
    return editedEmbed;
  }
};
