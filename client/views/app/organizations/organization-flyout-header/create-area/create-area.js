Template.createArea.onCreated(function () {
  this.set('locationId', this.data.locationId);
  this.set('color', null);

  this.closeFlyout = function (event) {
    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  };
});

Template.createArea.onRendered(function () {
  this.$("input[name='name']").focus();
});

Template.createArea.helpers({
  locations: function () {
    var locations = Locations.find({
      organizationId: this.organizationId,
      archived: {$ne: true}
    }).fetch();

    if (locations) {
      return _.map(locations, function (location) {
        return {value: location._id, text: location.name}
      });
    }
  },
  onColorChange: function () {
    var self = Template.instance();
    return function (color) {
      self.set('color', color);
    }
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
    areaInfo.color = tmpl.get('color');
    areaInfo.archived = false;

    Meteor.call("createArea", areaInfo, HospoHero.handleMethodResult(function () {
      tmpl.closeFlyout(event);
    }));
  }
});