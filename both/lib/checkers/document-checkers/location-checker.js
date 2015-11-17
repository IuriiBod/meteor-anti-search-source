var LocationDocument = Match.Where(function (location) {
  check(location, {
    name: String,
    timezone: String,
    openingTime: Date,
    closingTime: Date,
    organizationId: HospoHero.checkers.MongoId,
    createdAt: Number,
    country: String,
    city: String,
    shiftUpdateHour: Number,

    _id: HospoHero.checkers.OptionalMongoId,
    address: Match.Optional(String),
    pos: Match.OneOf(null, HospoHero.checkers.Pos)
  });


  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(location, Locations);

  checkerHelper.checkProperty('name', function () {
    if (!!Locations.findOne({organizationId: location.organizationId, name: location.name})) {
      logger.error('The location with the same name already exists!');
      throw new Meteor.Error("The location with the same name already exists!");
    }
  });

  checkerHelper.checkProperty('city', function () {
    var worldWeather = new WorldWeather(location.city);
    if (!worldWeather.checkLocation()) {
      throw new Meteor.Error("Make sure you inserted right country and city");
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  LocationDocument: LocationDocument
});