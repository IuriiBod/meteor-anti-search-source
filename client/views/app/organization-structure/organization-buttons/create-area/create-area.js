//context: organizationId (MongoID), locationId (MongoID)
Template.createArea.onCreated(function () {
  this.locationId = new ReactiveVar(this.data.locationId);
  this.color = new ReactiveVar(null);

  this.closeFlyout = function (event) {
    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  };
});


Template.createArea.onRendered(function () {
  this.$('input[name="name"]').focus();
});


Template.createArea.helpers({
  locations: function () {
    return Locations.find({
      organizationId: this.organizationId,
      archived: {$ne: true}
    }).map((location) => {
      return {value: location._id, text: location.name};
    });
  },
  onColorChange: function () {
    const self = Template.instance();
    return function (color) {
      self.color.set(color);
    };
  },
  color: function () {
    return Template.instance().color.get();
  },
  locationId: function () {
    return Template.instance().locationId.get();
  }
});

Template.createArea.events({
  'click .close-flyout': function (event, tmpl) {
    event.preventDefault();
    tmpl.closeFlyout(event);
  },
  'submit form': function (event, tmpl) {
    event.preventDefault();

    var areaInfo = HospoHero.misc.getValuesFromEvent(event, ['name', 'locationId'], true);

    areaInfo.organizationId = tmpl.data.organizationId;
    areaInfo.color = tmpl.color.get();
    areaInfo.archived = false;

    Meteor.call("createArea", areaInfo, HospoHero.handleMethodResult(function () {
      tmpl.closeFlyout(event);
    }));
  }
});