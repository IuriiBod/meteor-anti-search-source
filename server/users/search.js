SearchSource.defineSource('usersSearch', function(searchText, options) {
  var searchOptions = {sort: {username: 1}};
  var selector = {};

  if(options) {
    if(options.isActive) {
      selector.isActive = options.isActive;
    }
    if(options.areaId) {
      var area = Areas.findOne({_id: options.areaId});
      var relations = Relations.find({organizationId: area.organizationId, areaIds: {$ne: options.areaId}, collectionName: 'users'}).fetch();
      if(relations) {
        var users = [];
        relations.forEach(function(relation) {
          users.push(relation.entityId);
        });
        selector._id = {$in: users};
      }
    }
  }
  if(searchText) {
    var regExp = buildRegExp(searchText);
    return Meteor.users.find({
      $and: [
        { isAdmin: {$ne: true} },
        {
          $or: [
            { username: regExp },
            { 'emails.0.address': regExp }
          ]
        }
      ]
    }, searchOptions).fetch();
  } else {
    return Meteor.users.find({}, searchOptions).fetch();
  }
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}