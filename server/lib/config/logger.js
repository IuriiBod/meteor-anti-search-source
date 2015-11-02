var consoleTransportOptions = {
  colorize: true,
  level: Meteor.settings.logLevel || 'warn',
  levels: {debug: 0, info: 1, warn: 2, error: 3},
  colors: {debug: 'blue', info: 'green', warn: 'orange', error: 'red'},
  handleExeptions: true,
  humanReadableUnhandledException: true
};

var fileTransportOptions = {
  name: 'file.error',
  filename: '/root/hospo_hero.log',
  colorize: true,
  level: Meteor.settings.logLevel || 'warn',
  levels: {debug: 0, info: 1, warn: 2, error: 3},
  colors: {debug: 'blue', info: 'green', warn: 'orange', error: 'red'},
  json: true,
  handleExeptions: true
};

// Add & configure transport
if (HospoHero.isProductionMode()) {
  logger.addTransport('file', fileTransportOptions);
} else {
  logger.addTransport('console', consoleTransportOptions);
}

