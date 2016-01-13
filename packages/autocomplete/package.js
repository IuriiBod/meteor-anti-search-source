Package.describe({
  name: "mizzao:autocomplete",
  summary: "Client/server autocompletion designed for Meteor's collections and reactivity",
  version: "0.5.1",
  git: "https://github.com/mizzao/meteor-autocomplete.git"
});

Package.onUse(function (api) {
  api.versionsFrom("1.2");

  api.use(['blaze', 'templating', 'jquery'], 'client');
  api.use(['coffeescript', 'underscore']); // both
  api.use(['mongo', 'ddp']);

  api.use("dandv:caret-position@2.1.1", 'client');

  // Our files
  api.addFiles([
    'autocomplete.css',
    'inputs.html',
    'autocomplete-client.coffee',
    'templates.coffee'
  ], 'client');
  
  api.addFiles([
    'autocomplete-server.coffee'
  ], 'server');

  api.export('Autocomplete', 'server');
});
