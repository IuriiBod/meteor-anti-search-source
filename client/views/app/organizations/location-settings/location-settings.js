Template.locationSettings.onCreated(function () {
  this.closeFlyoutByEvent = function (event) {
    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  };

  this.location = function () {
    if (this.data.locationId) {
      return Locations.findOne({_id: this.data.locationId});
    }
  }
});

Template.locationSettings.helpers({
  location: function () {
    return Template.instance().location();
  },
  onLocationSubmit: function () {
    var self = Template.instance();
    return function (newLocationDoc, event) {
      Meteor.call('editLocation', newLocationDoc, HospoHero.handleMethodResult(function () {
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


Template.locationSettings.events({
  'click .delete-location': function (event, tmpl) {
    if (confirm("Are you sure, you want to delete this location?")) {
      var locationId = tmpl.data.locationId;
      Meteor.call('deleteLocation', locationId, HospoHero.handleMethodResult(function () {
        tmpl.closeFlyoutByEvent(event);
      }));
    }
  },

  'click .create-area-flyout': function (event, tmpl) {
    var location = tmpl.location();
    if (location) {
      FlyoutManager.open('createArea', {organizationId: location.organizationId, locationId: location._id});
    }
  }
});