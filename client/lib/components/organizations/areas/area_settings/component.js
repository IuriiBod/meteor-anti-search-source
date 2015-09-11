var component = FlowComponents.define('areaSettings', function(props) {});

component.state.area = function() {
  var areaId = Session.get('areaId');
  return Areas.findOne(areaId);
};

component.state.getAreaUsers = function() {
  var areaId = Session.get('areaId');
  var areaUsers;
  Meteor.call('areaUsers', areaId, function(err, users) {
    if(err) {
      return alert(err.reason);
    }
    Session.set('areaUser', users);
  });
};

component.state.areaUsers = function() {
  this.get('getAreaUsers');
  return Session.get('areaUser');
};

component.state.getProfilePhoto = function(id) {
  var user = Meteor.users.findOne({_id: id});
  if(user.services && user.services.google && user.services.google.picture) {
    return user.services.google.picture;
  } else {
    return '/images/user-image.jpeg';
  }
};