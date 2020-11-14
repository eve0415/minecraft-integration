module.exports = (instance, data) => {
  Object.keys(data).map((port) => {
    const info = instance.database.getFromPort(Number(port));
    if (!info) return;
    
    instance.database.setName(info.ID, data[port], instance);
    instance.statusPage.setName(info.ID, data[port]);
  });
};
