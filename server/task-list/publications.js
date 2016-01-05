Meteor.publishAuthorized('taskList', function (userId) {
  var user = Meteor.users.findOne({_id: userId});
  var relations = user && user.relations;
  var query = {};

  if (relations.organizationId) {
    var sharingOptions = {
      user: {
        sharingIds: userId
      },
      organization: {
        sharingType: 'organization',
        sharingIds: relations.organizationId
      },
      location: {
        sharingType: 'location'
      },
      area: {
        sharingType: 'area'
      }
    };

    if (relations.locationIds) {
      sharingOptions.location.sharingIds = {$in: relations.locationIds};
    }
    if (relations.areaIds) {
      sharingOptions.area.sharingIds = {$in: relations.areaIds};
    }
    query.$or = _.values(sharingOptions);
  }

  console.log('QUERY', query.$or);


  return TaskList.find(query);
});