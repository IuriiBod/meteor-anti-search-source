Meteor.methods({
  'addUserToArea': function (userId, areaId) {
    var area = Areas.findOne({_id: areaId});
    var orgId = area.organizationId;
    var locId = area.locationId;

    var relation = Relations.findOne({
      collectionName: 'users',
      entityId: userId,
      organizationId: orgId
    });

    if(relation) {
      var doc = { areaIds: areaId };
      if(relation.locationIds.indexOf(locId) == -1) {
        doc.locationIds = locId;
      }
      Relations.update({_id: relation._id}, {
        $push: doc
      });
    } else {
      Relations.insert({
        organizationId: orgId,
        locationIds: [locId],
        areaIds: [areaId],
        collectionName: 'users',
        entityId: userId
      });
    }
    return area;
  },

  'removeUserFromArea': function(userId, areaId) {
    var relation = Relations.findOne({
      collectionName: 'users',
      entityId: userId
    });

    if(!relation) {
      throw new Meteor.Error('User is not in this area!');
    }

    var areaIds = relation.areaIds;
    var index = areaIds.indexOf(areaId);
    areaIds.splice(index, 1);
    if(areaIds.length == 0) {
      Relations.remove({_id: relation._id});
    } else {
      Relations.update({_id: relation._id}, {
        $set: {
          areaIds: areaIds
        }
      });
    }
  }
});