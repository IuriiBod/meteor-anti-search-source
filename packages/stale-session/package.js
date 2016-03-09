Package.describe({
  name: 'hospohero:stale-session',
  version: '0.0.7',
  summary: 'Session timeout handling',
  git: 'https://github.com/tomhay/herochef',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'underscore',
    'jquery',
    'u2622:persistent-session',
    'ogourment:settings'
  ], 'client');

  api.use(['check'], 'server');

  api.addFiles(['lib/stale-session/client.js'], 'client');
  api.addFiles(['lib/stale-session/server.js'], 'server');
  api.addFiles(['lib/stale-session/both.js']);

  api.export(['StaleSession']);
});
