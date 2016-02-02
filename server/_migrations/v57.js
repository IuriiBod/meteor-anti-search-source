
currentStocks
Migrations.add({
  version: 57,
  name: 'Remove defaultRole from roles object',
  up: function () {
    Meteor.users.update({
      'roles.defaultRole': {
        $exists: true
      }
    }, {
      $unset: {
        'roles.defaultRole': 1
      }
    }, {multi: true});

    var ownerRole = Meteor.roles.findOne({name: 'Owner'})._id;

    var getIdsFromCursor = function (cursor) {
      return cursor.map(function (item) {
        return item._id;
      });
    };

    Meteor.users.find({'relations.locationIds': [], 'relations.areaIds': []}).forEach(function (user) {
      if (user && user.relations) {
        var locationIds = getIdsFromCursor(Locations.find({
          organizationId: {
            $in: user.relations.organizationIds
          }
        }));

        var areaIds = getIdsFromCursor(Areas.find({
          organizationId: {
            $in: user.relations.organizationIds
          }
        }));


        var rolesObject = {};
        areaIds.forEach(function (areaId) {
          rolesObject[areaId] = ownerRole;
        });

        Meteor.users.update({_id: user._id}, {
          $set: {
            'relations.locationIds': locationIds,
            'relations.areaIds': areaIds,
            roles: rolesObject
          }
        });
      }
    });
  }
});