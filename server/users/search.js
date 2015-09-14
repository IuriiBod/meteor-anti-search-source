SearchSource.defineSource('usersSearch', function(searchText, options) {
  var searchOptions = {sort: {username: 1}};
  var selector = {};

  if(options) {
    if(options.isActive) {
      selector.isActive = options.isActive;
    }
    if(options.areaId) {
      var relations = Relations.find({areaIds: options.areaId, collectionName: 'users'}).fetch();
      if(relations) {
        var users = [];
        relations.forEach(function(relation) {
          users.push(relation.entityId);
        });
        selector._id = {$nin: users};
      }
    }
  }
  if(searchText) {
    var regExp = buildRegExp(searchText);
    selector.$or = [];
    selector.$or.push({username: regExp});
    selector.$or.push({'emails.0.address': regExp});
    return Meteor.users.find(selector, searchOptions).fetch();
  } else {
    return Meteor.users.find({}, searchOptions).fetch();
  }
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}