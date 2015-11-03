var consoleTransportOptions = {
  colorize: true,
  level: Meteor.settings.logLevel || 'warn',
  levels: {debug: 0, info: 1, warn: 2, error: 3},
  colors: {debug: 'blue', info: 'green', warn: 'orange', error: 'red'},
  handleExeptions: true,
  humanReadableUnhandledException: true
};

var papertrailTransportOptions = {
  host: 'logs3.papertrailapp.com',
  port: 35920,
  logFormat: function (level, message) {
    return '[' + level + '] ' + message;
  },
  inlineMeta: true,
  json: true,
  colorize: true,
  handleExeptions: true
};


// Add & configure transport
if (HospoHero.isProductionMode()) {
  logger.addTransport('papertrail', papertrailTransportOptions);
} else {
  logger.addTransport('console', consoleTransportOptions);
}

