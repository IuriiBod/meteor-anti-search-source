SearchSource.defineSource('usersSearch', function(searchText, options) {
  var searchOptions = {};
  if(options) {
    if(options.isActive) {
      searchOptions.isActive = options.isActive;
    }
    if(options.areaId) {
      //var relation = Relations.find({area})
    }
  }

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {username: regExp};
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}