Template.organizationStructure.onCreated(function () {
  this.set('organization', HospoHero.getOrganization());
});

Template.organizationStructure.helpers({
  locations: function () {
    if (Template.instance().get('organization')) {
      var selector = {
        organizationId: Template.instance().get('organization')._id,
        archived: {$ne: true}
      };

      if (!HospoHero.isOrganizationOwner()) {
        var user = Meteor.user();
        if (user.relations && user.relations.locationIds) {
          selector._id = {$in: user.relations.locationIds};
        }
      }

      return Locations.find(selector);
    }
  },

  hasLocations: function () {
    var locations = Template.instance().get('locations');
    return locations ? locations.count() : false;
  },

  areas: function (locationId) {
    var selector = {
      organizationId: Template.instance().get('organization')._id,
      locationId: locationId,
      archived: {$ne: true}
    };

    if (!HospoHero.isOrganizationOwner()) {
      var user = Meteor.user();
      if (user.relations && user.relations.areaIds) {
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
    FlyoutManager.open('locationSettings', {locationId: this._id}, true);
  },

  'click .area-settings': function () {
    FlyoutManager.open('areaSettings', {areaId: this._id}, true);
  },

  'click .change-current-area': function (e) {
    e.preventDefault();

    Meteor.call('changeDefaultArea', this._id, HospoHero.handleMethodResult());
    var routerParams = Router.current().params;

    var paramsToRedirect = ['_id', 'id'];

    paramsToRedirect.forEach(function (param) {
      if (routerParams[param]) {
        Router.go('home');
      }
    });
  }
});