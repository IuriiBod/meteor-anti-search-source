var checkForecastPermission = function (userId, areaId) {
  var checker = new HospoHero.security.PermissionChecker(userId);
  var haveAccess = checker.hasPermissionInArea(areaId, 'view forecast');
  if (!haveAccess) {
    subscribtion.error(new Meteor.Error(403, 'Access Denied'));
  }
  return haveAccess;
};


Meteor.publishAuthorized('posMenuItems', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (checkForecastPermission(this.userId, areaId)) {
    var relationsObj = HospoHero.getRelationsObject(areaId);
    return PosMenuItems.find({
      'relations.locationId': relationsObj.locationId
    });
  }
});


Meteor.publish('menuItemsForPosLinking', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (checkForecastPermission(this.userId, areaId)) {
    logger.info('Menu items for POS menu linking', {areaId: areaId});

    var query = HospoHero.prediction.getMenuItemsForPredictionQuery({
      'relations.areaId': areaId,
      status: {
        $ne: 'archived'
      }
    });

    return MenuItems.find(query);
  }
});