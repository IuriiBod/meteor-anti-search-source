Package.describe({
  name: 'jss-copleykj:socialize-messaging',
  version: '0.0.1',
  summary: '',
  git: 'https://github.com/copleykj/socialize-messaging',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use([
    'check', 
    'socialize:user-model@0.1.7', 
    'socialize:user-presence@0.3.4', 
    'socialize:server-time@0.1.2'
  ]);

  //Add the conversation-model files
  api.addFiles('lib/conversation-model/common/conversation-model.js');
  api.addFiles('lib/conversation-model/common/user-extensions.js');
  api.addFiles('lib/conversation-model/server/publications.js', 'server');
  api.addFiles('lib/conversation-model/server/server.js', 'server');

  //Add the message-model files
  api.addFiles('lib/message-model/common/message-model.js');
  api.addFiles('lib/message-model/server/server.js', 'server');

  //Add the participant-model files
  api.addFiles('lib/participant-model/common/participant-model.js');
  api.addFiles('lib/participant-model/server/server.js', 'server');

  api.export(['Conversation', 'Message', 'Participant']);
});
