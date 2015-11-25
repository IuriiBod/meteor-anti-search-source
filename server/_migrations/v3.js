Migrations.add({
  version: 3,
  name: "Change defaultArea to currentAreaId",
  up: function () {
    var users = Meteor.users.find({defaultArea: {$ne: null}}).fetch();
    if (users.length) {
      users.forEach(function (user) {
        Meteor.users.update({
          _id: user._id
        }, {
          $rename: {
            'defaultArea': 'currentAreaId'
          }
        });
      });
    }
  }
});