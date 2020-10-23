const statusEmbeds = require('./statusEmbeds');

class StatusPage {
  constructor() {
    this.pages = new Array;
    this.noPage = statusEmbeds.fetching;
  }
  
  addStatus(id) {
    if (this.pages.find(page => page.id === id)) return new Error('Conflict id, trying to add status page');
    this.pages.push(new Status(id));
    this.sortPages();
  }
  
  updateStatus(id, status, data) {
    const page = this.pages.find(p => p.id === Number(id));
    if (!page) return new Error('Unknown id');
    page.updateStatus(status, data);
  }
  
  setName(id, name) {
    const page = this.pages.find(p => p.id === id);
    if (!page) return new Error('Unknown id');
    page.setName(name);
  }
  
  getPage(id) {
    return this.pages.find(p => p.id === Number(id))?.embed.setFooter(`ID: ${id}`) ?? statusEmbeds.unknown(id);
  }
  
  getAllPages() {
    return this.pages;
  }
  
  getNoPage() {
    return this.noPage;
  }
  
  sortPages() {
    this.pages.sort((p1, p2) => p1.id > p2.id);
  }
}

class Status {
  constructor(id) {
    this.id = id;
    this.name = null;
    this.embed = statusEmbeds.offline;
  }
  
  updateStatus(status, data) {
    this.embed = status === 'offline' ? statusEmbeds[status] : statusEmbeds[status](data);
  }
  
  setName(name) {
    this.name = name;
  }
}

module.exports = new StatusPage();
