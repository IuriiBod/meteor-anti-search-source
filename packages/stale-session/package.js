Package.describe({
  name: 'hospohero:stale-session',
  version: '0.0.5',
  summary: 'Session timeout handling',
  git: 'https://github.com/tomhay/heroche',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'underscore',
    'u2622:persistent-session',
    'jquery'
  ], 'client');
  api.addFiles('lib/stale-session/client.js', 'client');
  api.addFiles('lib/stale-session/server.js', 'server');
  api.addFiles('lib/collections.js');
  api.addFiles('lib/publications.js', 'server');
  api.export(['StaleSessionConfigs', 'StaleSession']);
});
