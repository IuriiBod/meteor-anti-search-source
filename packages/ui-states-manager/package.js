Package.describe({
  name: 'jss:ui-states',
  version: '0.2.0',
  summary: 'Permanent storage for user\'s UI states',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2');

  api.use('underscore');

  api.addFiles(['lib/client.js'], 'client');
  api.addFiles(['lib/server.js'], 'server');

  api.export('UIStates', 'client');
});