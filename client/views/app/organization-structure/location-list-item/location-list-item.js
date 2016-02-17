Template.locationListItem.helpers({
  canEditLocation: function () {
    let locationAreasIds = Areas.find({locationId: this._id}).map(area => area._id);
    return HospoHero.isOrganizationOwner()
      || locationAreasIds.some(areaId => Roles.hasAction(user.roles[areaId], 'edit areas'));
  },

  areas: function () {
    return Areas.find({locationId: this._id, archived: {$ne: true}});
  }
});

Template.locationListItem.events({
  'click .location-settings-button': function (event, tmpl) {
    FlyoutManager.open('locationSettings', {locationId: tmpl.data._id});
  }
});
