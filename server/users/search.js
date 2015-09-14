SearchSource.defineSource('usersSearch', function(searchText, options) {
  var searchOptions = {};
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
    selector.username = regExp;
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}