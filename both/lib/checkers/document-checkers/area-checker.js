var InactivityTimeout = Match.Where(function (timeout) {
  check(timeout, Number);
  timeout /= 6000;
  return timeout >= 1 && timeout <= 65536;
});

var AreaDocument = Match.Where(function (area) {
  check(area, {
    _id: HospoHero.checkers.OptionalMongoId,
    name: String,
    locationId: HospoHero.checkers.MongoId,
    organizationId: HospoHero.checkers.MongoId,
    createdAt: Number,
    inactivityTimeout: InactivityTimeout,
    archived: Match.Optional(Boolean),
    color: HospoHero.checkers.RgbColor
  });

  var checkerHelper = new DocumentCheckerHelper(area, Areas);

  checkerHelper.checkProperty('name', function () {
    if (!!Areas.findOne({locationId: area.locationId, name: area.name})) {
      logger.error('The area with the same name already exists!');
      throw new Meteor.Error('The area with the same name already exists!');
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  AreaDocument: AreaDocument
});