var MongoId = Match.Where(function (id) {
  check(id, String);
  return /[0-9a-zA-Z]{17}/.test(id);
});

var NullableMongoId = Match.OneOf(MongoId, null);

var PosKey = Match.Where(function (key) {
  check(key, String);
  return /[0-9a-zA-Z]{32}/.test(key);
});

var PosSecret = Match.Where(function (key) {
  check(key, String);
  return /[0-9a-zA-Z]{64}/.test(key);
});

var RgbColor = Match.Where(function (color) {
  check(color, String);
  return /rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)/.test(color);
});

var forNonEmptyString = function (propertyName) {
  return Match.Where(function (value) {
    if (_.isString(value) && value.trim().length > 0) {
      return true;
    } else {
      throw new Meteor.Error(propertyName + ' is required!');
    }
  });
};


var ShiftId = Match.Where(function (id) {
  check(id, HospoHero.checkers.MongoId);
  if (!Shifts.findOne({_id: id})) {
    throw new Meteor.Error(404, "Shift not found");
  }
  return true;
});

Namespace('HospoHero.checkers', {
  /**
   * Mongo ID checker
   */
  MongoId: MongoId,

  OptionalMongoId: Match.Optional(MongoId),

  NullableMongoId: NullableMongoId,

  OptionalNullableMongoId: Match.Optional(NullableMongoId),

  WeekRange: Match.Where(function (weekRange) {
    check(weekRange, {
      $gte: Date,
      $lte: Date
    });
    //ensure week range have one week duration
    var differenceInMs = moment(weekRange.$lte).diff(weekRange.$gte);
    var weeksCount = moment.duration(differenceInMs).asWeeks();

    return weeksCount <= 1.5; //should be less or equal 1.5 of week to prevent large ranges
  }),

  /**
   * Relations object checker
   */
  Relations: Match.Where(function (relations) {
    try {
      check(relations, {
        organizationId: HospoHero.checkers.MongoId,
        locationId: HospoHero.checkers.OptionalNullableMongoId,
        areaId: HospoHero.checkers.OptionalNullableMongoId
      });
    } catch (err) {
      HospoHero.checkerUtils.checkError('Incorrect relation');
    }
    return true;
  }),

  /**
   * POS keys and host checker
   */
  Pos: Match.Where(function (pos) {
    try {
      check(pos, {
        key: PosKey,
        secret: PosSecret,
        host: String
      });
    } catch (e) {
      HospoHero.checkerUtils.checkError('Incorrect POS configuration');
    }
    return true;
  }),

  /**
   * RGB color checker: rgb(255, 255, 255)
   */
  RgbColor: RgbColor,

  /**
   * Shift exist checker
   */
  ShiftId: ShiftId,

  Email: Match.Where(function (email) {
    if (_.isString(email) && /.+@(.+){2,}\.(.+){2,}/.test(email)) {

      return true;
    } else {
      throw new Meteor.Error('Incorrect email');
    }
  }),

  /**
   * Parametrized checker for non empty string
   *
   * @param {string} propertyName
   */
  forNonEmptyString: forNonEmptyString
});