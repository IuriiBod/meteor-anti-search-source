Migrations.add({
  version: 78,
  name: "Remove space at the end of 'fullName'",
  up: function () {
    Meteor.users.find({'profile.fullName': /^\s+|\s+$/}).forEach((user) => {
      Meteor.users.update({_id: user._id}, {
        $set: {
          'profile.fullName': user.profile.fullName.trim()
        }
      });
    });
  }
});