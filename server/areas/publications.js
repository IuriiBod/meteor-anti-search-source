Meteor.publishAuthorized('areaDetails', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);

  if (permissionChecker.hasPermissionInArea(areaId, 'edit areas')) {
    return Areas.find({_id: areaId});
  } else {
    logger.error('Permission denied: publish [areaDetails] ', {areaId: areaId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
});