SearchSource.defineSource('usersSearch', function (searchText, options) {
  var searchOptions = {sort: {username: 1}};
  var selector = {
    _id: {$ne: Meteor.userId()}
  };

  if (options) {
    if (options.isActive) {
      selector.isActive = options.isActive;
    }
    if (options.areaId) {
      var area = Areas.findOne({_id: options.areaId});
      selector['relations.organizationId'] = area.organizationId;
      selector['relations.areaIds'] = {$ne: area._id};
    }
  }
  if (searchText) {
    var regExp = buildRegExp(searchText);
    selector.$or = [
      {username: regExp},
      {'profile.firstname': regExp},
      {'profile.lastname': regExp},
      {'emails.0.address': regExp}
    ];
  }
  return Meteor.users.find(selector, searchOptions).fetch();
});

var buildRegExp = function (searchText) {
  return new RegExp(searchText, 'i');
};