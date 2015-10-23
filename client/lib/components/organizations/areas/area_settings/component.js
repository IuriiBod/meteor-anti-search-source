var component = FlowComponents.define('areaSettings', function(props) {
  this.set('organizationId', props.organizationId);
  this.areaId = props.areaId;
  this.set('addUser', false);
});

component.state.area = function() {
  return Areas.findOne({_id: this.areaId});
};

component.state.areaUsers = function() {
  return Meteor.users.find({
    $or: [
      { 'relations.areaIds': this.areaId },
      {
        'relations.organizationId': this.get('organizationId'),
        'relations.locationIds': null,
        'relations.areaIds': null
      }
    ]
  }, {
    sort: {
      username: 1
    }
  });
};

component.action.deleteArea = function(id) {
  Meteor.call('deleteArea', id, HospoHero.handleMethodResult());
};

component.action.toggleAddUser = function() {
  this.set('addUser', !this.get('addUser'));
};

component.action.removeUserFromArea = function (userId) {
  Meteor.call('removeUserFromArea', userId, this.areaId, HospoHero.handleMethodResult());
};