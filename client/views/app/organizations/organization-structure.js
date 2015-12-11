Template.organizationStructure.onCreated(function () {
  this.set('organization', HospoHero.getOrganization());

  var self = this;

  this.locations = function () {
    if (self.get('organization')) {
      var selector = {
        organizationId: self.get('organization')._id,
        archived: {$ne: true}
      };

      if (!HospoHero.isOrganizationOwner()) {
        var user = Meteor.user();
        if (user && user.relations && user.relations.locationIds) {
          selector._id = {$in: user.relations.locationIds};
        }
      }

      return Locations.find(selector);
    }
  };
});

Template.organizationStructure.helpers({
  locations: function () {
    return Template.instance().locations();
  },

  hasLocations: function () {
    var locations = Template.instance().locations();
    return locations && locations.count() > 0;
  },

  areas: function (locationId) {
    var selector = {
      organizationId: Template.instance().get('organization')._id,
      locationId: locationId,
      archived: {$ne: true}
    };

    if (!HospoHero.isOrganizationOwner()) {
      var user = Meteor.user();
      if (user && user.relations && user.relations.areaIds) {
        selector._id = {$in: user.relations.areaIds};
      }
    }
    return Areas.find(selector);
  },

  isCurrentArea: function (id) {
    return HospoHero.getCurrentAreaId() == id;
  },

  areaColor: function (areaId) {
    var area = Areas.findOne({_id: areaId});
    if (area) {
      return area.color;
    }
  }
});

Template.organizationStructure.events({
  'click .location-settings': function () {
    FlyoutManager.open('locationSettings', {locationId: this._id});
  },

  'click .area-settings': function () {
    FlyoutManager.open('areaSettings', {areaId: this._id});
  },

  'click .change-current-area': function (e) {
    e.preventDefault();

    Meteor.call('changeDefaultArea', this._id, HospoHero.handleMethodResult());
    var routerParams = Router.current().params;

    var paramsToRedirect = ['_id', 'id'];

    paramsToRedirect.forEach(function (param) {
      if (routerParams[param]) {
        Router.go('dashboard');
      }
    });
  }
});