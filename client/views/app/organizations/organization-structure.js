Template.organizationStructure.onCreated(function () {
  this.organization = new ReactiveVar(HospoHero.getOrganization());

  var self = this;

  this.locations = function () {
    var organization = self.organization.get();
    if (organization && organization._id) {
      var selector = {
        organizationId: organization._id,
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

  this.isManagerInArea = function (areaId) {
    if (HospoHero.isOrganizationOwner()) {
      return true;
    } else {
      var user = Meteor.user();
      if (user && user.relations && user.relations.areaIds) {
        return HospoHero.isOrganizationOwner() ||
          Roles.hasAction(user.roles[areaId], 'edit areas');
      }
    }
  }
});

Template.organizationStructure.helpers({
  organization: function () {
    return Template.instance().organization.get();
  },

  locations: function () {
    return Template.instance().locations();
  },

  hasLocations: function () {
    var locations = Template.instance().locations();
    return locations && locations.count() > 0;
  },

  areas: function (locationId) {
    var selector = {
      organizationId: Template.instance().organization.get()._id,
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
    return HospoHero.getCurrentAreaId() === id;
  },

  isManagerInLocation: function (locationId) {
    var user = Meteor.user();
    if (user && user.relations && user.relations.areaIds) {
      return Areas.find({
        _id: {$in: user.relations.areaIds},
        locationId: locationId
      }).fetch().reduce(function (isManager, area) {
        return isManager || Template.instance().isManagerInArea(area._id);
      }, false);
    }
  },

  isManagerInArea: function (areaId) {
    return Template.instance().isManagerInArea(areaId);
  },

  areaColor: function (areaId) {
    var area = Areas.findOne({_id: areaId});
    return area && area.color || false;
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