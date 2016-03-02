Meteor.publishAuthorized('locationDetails', function (locationId) {
  check(locationId, HospoHero.checkers.MongoId);

  let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);

  if (permissionChecker.hasPermissionInLocation(locationId, 'edit areas')) {
    return Locations.find({_id: locationId});
  } else {
    logger.error('Permission denied: publish [locationDetails] ', {locationId: locationId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});


