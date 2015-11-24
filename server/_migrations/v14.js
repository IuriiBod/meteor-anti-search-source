Migrations.add({
  version: 14,
  name: "Add a new action to the Manager role",
  up: function () {
    var managerRole = Meteor.roles.findOne({name: 'Manager'});

    if (managerRole) {
      Meteor.roles.update({
        _id: managerRole._id
      }, {
        $push: {
          actions: 'view area reports'
        }
      });
    }
  }
});