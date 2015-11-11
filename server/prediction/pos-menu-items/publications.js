var checkForecastPermission = function (subscribtion) {
  var haveAccess = HospoHero.canUser('view forecast', subscribtion.userId);
  if (!haveAccess) {
    subscribtion.error(new Meteor.Error(403, 'Access Denied'));
  }
  return haveAccess;
};


Meteor.publishAuthorized('posMenuItems', function () {
  if (checkForecastPermission(this)) {
    var currentAreaId = HospoHero.getCurrentAreaId(this.userId);
    var relationsObj = HospoHero.getRelationsObject(currentAreaId);
    return PosMenuItems.find({
      'relations.locationId': relationsObj.locationId
    });
  }
});