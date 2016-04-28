Migrations.add({
  version: 77,
  name: "Change field 'firstname' and 'lastname' for 'fullName' in user profile.",
  up: function () {
    Meteor.users.find({ $or: [ {'profile.firstname':{ $exists: true }}, {'profile.lastname':{ $exists: true }} ] }).
      forEach((user) => { Meteor.users.update({_id:user._id},
        {
          $set: { 'profile.fullName': `${user.profile.firstname || ''} ${user.profile.lastname || ''}` },
          $unset: { 'profile.firstname': user.profile.firstname, 'profile.lastname': user.profile.lastname }
        });
    });
  }
});