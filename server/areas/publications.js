Meteor.publishAuthorized('areaDetails', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  //code is copied from client side because we don't have right check method for this right now
  //todo: replace it after security checks improvements
  let locationAreasIds = Areas.find({locationId: this._id}).map(area => area._id);
  let hasPermission = HospoHero.isOrganizationOwner(this.userId)
    || locationAreasIds.some(areaId => Roles.hasAction(user.roles[areaId], 'edit areas'));

  if (hasPermission) {
    return Areas.find({_id: areaId});
  } else {
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});