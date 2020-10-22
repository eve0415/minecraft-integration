module.exports = async (instance, status, data) => {
  await instance.database.updateServer(data.port, data.platform, instance);
  
  instance.statusPage.updateStatus(data.port, status, data);
  instance.taskManager.refreshStatus();
};
