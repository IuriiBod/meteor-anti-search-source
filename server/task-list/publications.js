Meteor.publishAuthorized('taskList', function (userId) {
  var user = Meteor.users.findOne({_id: userId});
  var relations = user && user.relations;

  var query = {
    $or: []
  };

  query.$or.push({sharingIds: userId});

  if (relations.organizationId) {
    query.$or.push({
      sharingType: 'organization',
      sharingIds: relations.organizationId
    });

    if (relations.locationIds) {
      query.$or.push({
        sharingType: 'location',
        sharingIds: relations.locationIds
      });
    } else {
      query.$or.push({
        sharingType: 'location'
      });
    }

    if (relations.areaIds) {
      query.$or.push({
        sharingType: 'area',
        sharingIds: relations.areaIds
      });
    } else {
      query.$or.push({
        sharingType: 'area'
      });
    }
  }

  return TaskList.find(query);
});