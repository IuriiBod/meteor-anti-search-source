Template.createLocation.onCreated(function () {
  this.closeFlyoutByEvent = function (event) {
    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  };
});

Template.createLocation.helpers({
  onLocationSubmit: function () {
    var self = Template.instance();
    return function (newLocationDoc, event) {
      Meteor.call("createLocation", newLocationDoc, HospoHero.handleMethodResult(function () {
        self.closeFlyoutByEvent(event);
      }));
    };
  },
  onCancel: function () {
    var self = Template.instance();
    return function (event) {
      self.closeFlyoutByEvent(event);
    };
  }
});