Package.describe({
  name: 'jss:apns',
  version: '0.0.1',
  summary: 'APNS (Apple Push Notification Service) interface',
  git: 'https://github.com/neoziro/node-apns',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('apns.js', 'server');
  api.export('Apns', 'server');
});

Npm.depends({
  "apns": "0.1.0"
});
