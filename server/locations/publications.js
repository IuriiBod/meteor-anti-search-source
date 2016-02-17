Meteor.publishAuthorized('locationDetails', function (locationId) {
  check(locationId, HospoHero.checkers.MongoId);

  //code is copied from client side because we don't have right check method for this right now
  //todo: replace it after security checks improvements
  let hasPermission = HospoHero.isOrganizationOwner()
    || Roles.hasAction(user.roles[this._id], 'edit areas');

  if (hasPermission) {
    return Locations.find({_id: locationId});
  } else {
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});


