Migrations.add({
  version: 64,
  name: 'Remove old notification token field',
  up: function () {
    Meteor.users.update({}, {$unset: {pushNotificationTokens: ''}}, {multi: true});
  }
});
