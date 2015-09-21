var component = FlowComponents.define('areaSettings', function(props) {
  this.set('organizationId', props.organizationId);
  this.set('isOrganizationOwner', props.isOrganizationOwner);
  this.set('locationId', props.locationId);
  this.areaId = props.areaId;
  this.set('addUser', false);
});

component.state.area = function() {
  var areaId = this.areaId;
  return Areas.findOne({_id: areaId});
};

component.state.areaUsers = function() {
  var areaId = this.areaId;
  var userIds = Relations.find({
    $or: [
      { areaIds: areaId },
      {
        organizationId: this.get('organizationId'),
        locationIds: this.get('locationId'),
        areaIds: null
      },
      {
        organizationId: this.get('organizationId'),
        locationIds: null,
        areaIds: null
      }
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

component.state.isMe = function(id) {
  var userId = Meteor.userId();
  if(userId) {
    return (Meteor.userId == id);
  }
};


component.action.deleteArea = function(id) {
  Meteor.call('deleteArea', id, function(err) {
    if(err) {
      console.log(err);
      alert(err.reason);
    }
  });
};

component.action.toggleAddUser = function() {
  this.set('addUser', !this.get('addUser'));
};