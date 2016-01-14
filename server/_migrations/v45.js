Migrations.add({
  version: 45,
  name: "Fix relations.areaIds in users",
  up: function () {
    Meteor.users.find().forEach(function (user) {
      if (user.relations && _.isString(user.relations.areaIds)) {
        Meteor.users.update(user._id, {$set: {'relations.areaIds': [user.relations.areaIds]}});
      }
    });
  }
});