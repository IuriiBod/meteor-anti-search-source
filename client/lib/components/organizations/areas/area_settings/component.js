var subs = new SubsManager();
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
  subs.subscribe('usersPhoto');
  var areaId = Session.get('areaId');
  var area = Areas.find({_id: areaId});
  var userIds = Relations.find({
    $or: [
      { areaIds: areaId },
      { $and: [
        { locationIds: area.locationId },
        { areaIds: null }
      ]},
      { $and: [
        { organizationId: area.organizationId },
        { locationIds: null },
        { areaIds: null }
      ]}
    ]
  }, {fields: { entityId: 1 } }).fetch();

  if(userIds.length) {
    var ids = [];
    _.map(userIds, function(user) {
      ids.push(user.entityId);
    });
    var users = Meteor.users.find({_id: {$in: ids}}, {fields: { username: 1 }}).fetch();
    return users;
  }
};

component.state.getProfilePhoto = function(id) {
  var user = Meteor.users.findOne({_id: id});
  if(user.services && user.services.google && user.services.google.picture) {
    return user.services.google.picture;
  } else {
    return '/images/user-image.jpeg';
  }
};

component.state.isOwner = function() {
  var orgId = Session.get('organizationId');
  var userId = Meteor.userId();
  var count = Organizations.find({
    _id: orgId,
    owner: userId
  }).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
};

component.state.isMe = function (id) {
  var userId = Meteor.userId();
  if(id == userId) {
    return true;
  } else {
    return false;
  }
};