Migrations.add({
  version: 49,
  name: "Invitation bug fixing. Setting currentAreaId to users without this field",
  up: function () {
    var usersWithoutCurrentAreaId = Meteor.users
        .find({currentAreaId: {$exists: false}})
        .map(function(user) {
          return {_id: user._id, areaIds: user.relations.areaIds};
        });
    usersWithoutCurrentAreaId.forEach(function(user) {
      if (user.areaIds.length > 0) {
        Meteor.users.update({
          _id: user._id
        },{
          $set: {currentAreaId: user.areaIds[0]}
        });
      }
    });
  }
});