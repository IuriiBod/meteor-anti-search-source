/**
 * Allows intelligent document's property checking.
 * For existing documents also provides check if it is located in collection
 *
 * @param documentToValidate
 * @param targetCollection
 * @constructor
 */
var DocumentCheckerHelper = function DocumentCheckerHelper(documentToValidate, targetCollection) {
  this._isCreating = !documentToValidate._id;
  this._documentToValidate = documentToValidate;

  if (!this._isCreating) {
    this._oldDocument = targetCollection.findOne({_id: documentToValidate._id});

    if (!this._oldDocument) {
      logger.error("Document not found", {id: documentToValidate._id, collection: targetCollection._name});
      throw new Meteor.Error(404, "Record not found");
    }
  }
};


DocumentCheckerHelper.prototype._needValidateProperty = function (propertyName) {
  return this._isCreating || this._documentToValidate[propertyName] !== this._oldDocument[propertyName];
};

/**
 * Calls validation function if property was changed
 *
 * @param {string} propertyName
 * @param {function} checkFn function that checks property (should throw exception if property isn't valid)
 * @returns {boolean} true if check was executed
 */
DocumentCheckerHelper.prototype.checkProperty = function (propertyName, checkFn) {
  if (this._needValidateProperty(propertyName)) {
    checkFn();
    return true;
  }
  return false;
};

/**
 * Makes check if any of specified properties was changed.
 * `checkFn` will be called only one time
 *
 * @param properties
 * @param checkFn
 */
DocumentCheckerHelper.prototype.checkPropertiesGroup = function (properties, checkFn) {
  if (_.isArray(properties)) {
    var self = this;

    properties.forEach(function (propertyName) {
      return !self.checkProperty(propertyName, checkFn);
    });
  }
};


var checkError = function (message) {
  throw new Meteor.Error(500, 'Check error: ' + message);
};

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


logger = Meteor.isServer ? logger : {
  error: function () {
    console.log('ERROR: ', arguments);
  }
};


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
    inactivityTimeout: InactivityTimeout
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

var LocationDocument = Match.Where(function (location) {
  check(location, {
    name: String,
    timezone: String,
    openingTime: Date,
    closingTime: Date,
    organizationId: MongoId,
    createdAt: Number,
    country: String,
    city: String,
    shiftUpdateHour: Number,

    _id: HospoHero.checkers.OptionalMongoId,
    address: Match.Optional(String),
    pos: Match.OneOf(null, HospoHero.checkers.Pos)
  });


  var checkerHelper = new DocumentCheckerHelper(location, Locations);

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

var ShiftDocument = Match.Where(function (shift) {
  check(shift, {
    startTime: Date,
    endTime: Date,
    shiftDate: Date,
    type: Match.OneOf(String, null),

    //optional properties
    _id: HospoHero.checkers.OptionalMongoId,
    section: HospoHero.checkers.OptionalNullableMongoId,
    createdBy: HospoHero.checkers.OptionalNullableMongoId,
    assignedTo: HospoHero.checkers.OptionalNullableMongoId,
    assignedBy: HospoHero.checkers.OptionalNullableMongoId,
    jobs: Match.Optional([HospoHero.checkers.MongoId]),
    status: Match.Optional(Match.OneOf('draft', 'started', 'finished')),
    published: Match.Optional(Boolean),
    publishedOn: Match.Optional(Number),
    startedAt: Match.Optional(Number),
    finishedAt: Match.Optional(Number),
    order: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });

  var checkerHelper = new DocumentCheckerHelper(shift, Shifts);

  checkerHelper.checkPropertiesGroup(['startTime', 'endTime'], function () {
    if (shift.startTime.getTime() > shift.endTime.getTime()) {
      throw new Meteor.Error("'Start time' should be less then 'end time'");
    }
  });

  checkerHelper.checkPropertiesGroup(['startedAt', 'finishedAt'], function () {
    if (shift.startedAt > shift.finishedAt) {
      throw new Meteor.Error("Started time should be less then finished");
    }
  });

  //check if worker already assigned
  if (shift.assignedTo) {
    checkerHelper.checkPropertiesGroup(['assignedTo', 'shiftDate'], function () {
      var assignedWorker = Meteor.users.findOne({_id: shift.assignedTo});
      if (!assignedWorker) {
        logger.error("Worker not found");
        throw new Meteor.Error(404, "Worker not found");
      }

      var occupiedTimeRange = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);
      var existInShift = !!Shifts.findOne({
        _id: {$ne: shift._id},
        $or: [
          { startTime: occupiedTimeRange },
          { endTime: occupiedTimeRange },
          { $and: [
            { startTime: {$lte: shift.startTime} },
            { endTime: {$gte: shift.endTime} }
          ]}
        ],
        assignedTo: shift.assignedTo
      });
      if (existInShift) {
        logger.error("User already exist in a shift", {"date": shift.shiftDate});
        throw new Meteor.Error(404, "Worker has already been assigned to a shift");
      }
    });
  }

  return true;
});

var ShiftId = Match.Where(function (id) {
  check(id, HospoHero.checkers.MongoId);
  if (!Shifts.findOne({_id: id})) {
    throw new Meteor.Error(404, "Shift not found");
  }
  return true
});

var SubscriptionDocument = Match.Where(function (subscription) {
  check(subscription, {
    type: Match.OneOf('menu', 'job'),
    itemIds: Match.OneOf(HospoHero.checkers.MongoId, 'all'),
    subscriber: HospoHero.checkers.MongoId,
    relations: HospoHero.checkers.Relations,

    _id: HospoHero.checkers.OptionalMongoId
  });

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

  Relations: Match.Where(function (relations) {
    try {
      check(relations, {
        organizationId: HospoHero.checkers.MongoId,
        locationId: HospoHero.checkers.OptionalNullableMongoId,
        areaId: HospoHero.checkers.OptionalNullableMongoId
      });
    } catch (err) {
      checkError('Incorrect relation');
    }
    return true;
  }),

  Pos: Match.Where(function (pos) {
    try {
      check(pos, {
        key: PosKey,
        secret: PosSecret,
        host: String
      });
    } catch (e) {
      checkError('Incorrect POS configuration');
    }
    return true;
  }),

  /**
   * Shift document checker
   */
  ShiftDocument: ShiftDocument,
  AreaDocument: AreaDocument,
  LocationDocument: LocationDocument,
  SubscriptionDocument: SubscriptionDocument,
  ShiftId: ShiftId
});