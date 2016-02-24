Template.locationListItem.helpers({
  canEditLocation: function () {
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return permissionChecker.hasPermissionInLocation(this._id, 'edit areas');
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
