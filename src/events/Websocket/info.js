module.exports = (instance, data) => {
  Object.keys(data).map((port) => {
    const info = instance.database.getFromPort(Number(port));
    if (!info) return;
    
    instance.database.updateServer(info.ID, info.type, data[port]);
    instance.statusPage.setName(info.ID, data[port]);
  });
};
