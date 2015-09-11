Meteor.methods({
  'addUserToRelation': function (userId, areaId) {
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
  }
});