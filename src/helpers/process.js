module.exports = instance => {
  process.on('uncaughtException', err => {
    instance.logger.fatal(err);

    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    instance.logger.error(err);
  });

  process.on('SIGINT', function() {
    instance.logger.info('Detected Ctrl + C');
    instance.logger.info('Exiting...');
    process.exit();
  });

  process.on('beforeExit', () => {
    instance.logger.shutdown();
  });
};
