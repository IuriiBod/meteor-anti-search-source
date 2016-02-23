Meteor.publishAuthorized('locationDetails', function (locationId) {
  check(locationId, HospoHero.checkers.MongoId);

  let locationCursor = Locations.find({_id: locationId});
  let location = locationCursor.count() > 0 && locationCursor.fetch()[0];

  //todo: security checks improvements
  // right now it is impossible to check: there is no clear way to check
  // if manager is able to edit location in case if there is no areas in location
  const hasPermission = location && HospoHero.security.isOrganizationOwner(location.organizationId, this.userId);

  if (hasPermission) {
    return locationCursor;
  } else {
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});


