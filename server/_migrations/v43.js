Migrations.add({
  version: 43,
  name: "Removing gender and address fields from users collection",
  up: function() {
    Meteor.users.update({}, {$unset: {'profile.gender': 1, 'profile.address': 1}}, {multi: true});
  }
});