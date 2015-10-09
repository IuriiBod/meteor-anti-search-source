Package.describe({
  name: 'alonoslav:roles',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');
  api.use(['accounts-password', 'underscore', 'minimongo', 'mongo-livedata', 'templating', 'tracker'], 'client');
  api.use(['mongo', 'underscore'], 'server');
  api.addFiles(['collection.js', 'permissions.js', 'roles.js', 'roles_server.js', 'default_roles.js', 'roles_client.js']);
  api.export('Roles');
});

Package.onTest(function (api) {
  api.use(['accounts-password'], 'client');
  api.use('tinytest');
  api.use('alonoslav:roles');
  api.addFiles('roles_tests.js');
});