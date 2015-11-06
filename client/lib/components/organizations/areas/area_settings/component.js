var component = FlowComponents.define('areaSettings', function(props) {
  this.set('organizationId', props.organizationId);
  this.set('areaId', props.areaId);
  this.set('addUser', false);
});

component.state.area = function() {
  return Areas.findOne({_id: this.get('areaId')});
};

component.state.areaUsers = function() {
  return Meteor.users.find({
    $or: [
      { 'relations.areaIds': this.get('areaId') },
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

component.state.areaColor = function () {
  var area = this.get('area');
  if(area) {
    return this.get('area').color;
  }
};

component.state.onColorChange = function () {
  var area = this.get('area');
  return function(color) {
    if(area) {
      area.color = color;
      Meteor.call('editArea', area, HospoHero.handleMethodResult());
    }
  }
};

component.action.deleteArea = function(id) {
  Meteor.call('deleteArea', id, HospoHero.handleMethodResult());
};

component.action.toggleAddUser = function() {
  this.set('addUser', !this.get('addUser'));
};

component.action.removeUserFromArea = function (userId) {
  Meteor.call('removeUserFromArea', userId, get('areaId'), HospoHero.handleMethodResult());
};