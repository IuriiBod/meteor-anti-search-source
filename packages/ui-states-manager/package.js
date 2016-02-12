Package.describe({
  name: 'jss:ui-states',
  version: '0.1.1',
  summary: 'stores collapse states for items',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');
  api.addFiles(['lib/ui-states/client.js'], 'client');
  api.addFiles(['lib/ui-states/server.js'], 'server');
  api.export('UIStates', 'client');
});