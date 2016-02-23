//context: organization (Organization)
Template.createLocation.onCreated(function () {
  this.closeFlyoutByEvent = function (event) {
    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  };
});

Template.createLocation.helpers({
  onLocationSubmit: function () {
    const self = Template.instance();
    return function (newLocationDoc, event) {
      newLocationDoc.organizationId = self.data.organization._id;

      Meteor.call("createLocation", newLocationDoc, HospoHero.handleMethodResult(function () {
        self.closeFlyoutByEvent(event);
      }));
    };
  },
  onCancel: function () {
    const self = Template.instance();
    return function (event) {
      self.closeFlyoutByEvent(event);
    };
  }
});