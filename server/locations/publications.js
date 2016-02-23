Meteor.publishAuthorized('locationDetails', function (locationId) {
  check(locationId, HospoHero.checkers.MongoId);

  //todo: replace it after security checks improvements
  let hasPermission = HospoHero.isOrganizationOwner();

  if (hasPermission) {
    return Locations.find({_id: locationId});
  } else {
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});


