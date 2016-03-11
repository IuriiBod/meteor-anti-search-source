Router.route('chat', {
  name: 'chat',
  template: 'chat',
  path: '/chat',
  waitOn: function () {
    return Meteor.subscribe('conversations');
  }
});

