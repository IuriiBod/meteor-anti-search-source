Migrations.add({
  version: 50,
  name: 'Users: organizationId => organizationIds, String => Array',
  up: function () {
    Meteor.users.find({
        relations: {$exists: true},
        'relations.organizationIds': {$exists: false}
      })
      .forEach(function (user) {
        Meteor.users.update({_id: user._id}, {
          $set: {
            'relations.organizationIds': [user.relations.organizationId]
          },
          $unset: {
            'relations.organizationId': ''
          }
        });
      });
  }
});