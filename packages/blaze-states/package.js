Package.describe({
  name: 'jss:blaze-states',
  version: '0.0.1',
  summary: 'Adds ability to do set/get in context of Blaze template',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');
  api.use(['templating', 'reactive-var']);
  api.addFiles('blaze-states.js', 'client');
});
