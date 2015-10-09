var component = FlowComponents.define('areaSettings', function(props) {
  this.set('organizationId', props.organizationId);
  this.set('locationId', props.locationId);
  this.areaId = props.areaId;
  this.set('addUser', false);
});

component.state.area = function() {
  return Areas.findOne({_id: this.areaId});
};

component.state.areaUsers = function() {
  var areaId = this.areaId;
  return Meteor.users.find({
    $or: [
      { 'relations.areaIds': areaId },
      {
        $and: [
          { 'relations.organizationId': this.get('organizationId') },
          { 'relations.areaIds': null }
        ]
      }
    ]
  }, {
    sort: {
      username: 1
    }
  }).fetch();
};

component.state.getProfilePhoto = function(id) {
  var user = Meteor.users.findOne({_id: id});
  if(user && user.services && user.services.google && user.services.google.picture) {
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
      HospoHero.error(err);
    }
  });
};

component.action.toggleAddUser = function() {
  this.set('addUser', !this.get('addUser'));
};

component.action.removeUserFromArea = function (userId) {
  Meteor.call('removeUserFromArea', userId, this.areaId, function(err) {
    if(err) {
      HospoHero.error(err);
    }
  });
};