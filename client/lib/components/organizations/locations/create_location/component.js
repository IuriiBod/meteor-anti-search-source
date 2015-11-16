var component = FlowComponents.define("createLocation", function (props) {
});

component.state.onLocationSubmit = function () {
  var self = this;

  return function (newLocationDoc, event) {
    Meteor.call("createLocation", newLocationDoc, HospoHero.handleMethodResult(function () {
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

component.prototype.closeFlyoutByEvent = function (event) {
  var flyout = FlyoutManager.getInstanceByElement(event.target);
  flyout.close();
};