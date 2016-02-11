Migrations.add({
  version: 63,
  name: 'Remove inactive users, get rid of isActive property',
  up: function () {
    let ids = Meteor.users.find({isActive: false}).forEach(user =>user._id);
    Migrations.utils.removeUserWithRelatedStuff(ids);

    Meteor.users.update({}, {$unset: {isActive: ''}}, {multi: true});
  }
});
