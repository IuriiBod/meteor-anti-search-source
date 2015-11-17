var component = FlowComponents.define('locationSettings', function (props) {
  this.set('locationId', props.locationId);
});

component.state.location = function () {
  if (this.get('locationId')) {
    return Locations.findOne({_id: this.get('locationId')});
  }
};

component.state.onLocationSubmit = function () {
  var self = this;
  return function (newLocationDoc, event) {
    Meteor.call('editLocation', newLocationDoc, HospoHero.handleMethodResult(function () {
      self.closeFlyoutByEvent(event);
    }));
  };
};

component.state.onCancel = function () {
  var self = this;
  return function (event) {
    self.closeFlyoutByEvent(event);
  };
};

component.action.deleteLocation = function (event) {
  var locationId = this.get('locationId');
  var self = this;
  Meteor.call('deleteLocation', locationId, HospoHero.handleMethodResult(function () {
    self.closeFlyoutByEvent(event);
  }));
};

component.action.openCreateAreaFlyout = function () {
  var location = this.get('location');
  if (location) {
    FlyoutManager.open('createArea', {organizationId: location.organizationId, locationId: location._id}, true);
  }
};


component.prototype.closeFlyoutByEvent = function (event) {
  var flyout = FlyoutManager.getInstanceByElement(event.target);
  flyout.close();
};