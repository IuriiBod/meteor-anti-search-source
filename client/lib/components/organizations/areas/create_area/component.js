var component = FlowComponents.define("createArea", function (props) {
  this.organizationId = props.organizationId;
  this.set('locationId', props.locationId);
  this.set('enabled', true);
});

component.state.locations = function () {
  var locations = Locations.find({organizationId: this.organizationId, archived: {$ne: true}}).fetch();
  if (locations) {
    return _.map(locations, function (location) {
      return {value: location._id, text: location.name}
    });
  }
};

component.action.changeEnabled = function () {
  this.set('enabled', !this.get('enabled'));
};

component.action.createArea = function (areaInfo, domElement) {
  areaInfo.organizationId = this.organizationId;
  areaInfo.color = this.get('color');
  areaInfo.archived = false;
  Meteor.call("createArea", areaInfo, HospoHero.handleMethodResult(function () {
    var flyout = FlyoutManager.getInstanceByElement(domElement);
    flyout.close();
  }));
};

component.state.onColorChange = function () {
  var self = this;
  return function (color) {
    self.set('color', color);
  }
};