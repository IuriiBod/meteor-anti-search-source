Migrations.add({
  version: 11,
  name: "Remove permissions from roles",
  up: function () {
    Meteor.roles.update({}, {
      $unset: {
        permissions: 1
      }
    }, {
      multi: true
    });
  }
});