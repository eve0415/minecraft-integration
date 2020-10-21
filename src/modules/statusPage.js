const statusEmbeds	= require("./statusEmbeds");

class statusPage {
	constructor() {
		this.pages = new Array;
	}
    
	addStatus(id) {
		if (this.pages.find(page => page.id === id)) return new Error("Conflict id, trying to add status page");
		this.pages.push(new Status(id));
	}
	
	updateStatus(id, status, data) {
		const page = this.pages.find(p => p.id === id);
		if (!page) return new Error("Unknown id");
		page.updateStatus(status, data);
	}
	
	setName(id, name) {
		const page = this.pages.find(p => p.id === id);
		if (!page) return new Error("Unknown id");
		page.setName(name);
	}
	
	getPage(id) {
		return this.pages.find(p => p.id === id) ?? statusEmbeds.no(id);
	}
	
	getAllpages() {
		return this.pages;
	}
}

class Status {
	constructor(id) {
		this.id = id;
		this.name = null;
		this.embed = statusEmbeds.offline(id);
		return this;
	}
	
	updateStatus(status, data) {
		this.embed = statusEmbeds[status](status === "offline" ? this.id : data);
		return this;
	}
	
	setName(name) {
		this.name = name;
		return this;
	}
}

module.exports = new statusPage();
