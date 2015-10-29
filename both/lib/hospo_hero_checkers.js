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


if (Meteor.isClient) {
  //mock object for logger on client side
  var logger = {
    error: function () {
    }
  }
}

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
    status: Match.Optional(String),
    published: Match.Optional(Boolean),
    publishedOn: Match.Optional(Number),
    startedAt: Match.Optional(Number),
    finishedAt: Match.Optional(Number),
    order: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations)
  });

  var checkStartEndTime = function () {
    if (shift.startTime.getTime() > shift.endTime.getTime()) {
      logger.error("Start and end times invalid");
      throw new Meteor.Error("Start and end times invalid");
    }
  };


  var checkAssignedTo = function () {
    var assignedWorker = Meteor.users.findOne({_id: shift.assignedTo});
    if (!assignedWorker) {
      logger.error("Worker not found");
      throw new Meteor.Error(404, "Worker not found");
    }

    var existInShift = !!Shifts.findOne({
      _id: {$ne: shift._id},
      shiftDate: TimeRangeQueryBuilder.forDay(shift.shiftDate),
      assignedTo: shift.assignedTo
    });
    if (existInShift) {
      logger.error("User already exist in a shift", {"date": shift.shiftDate});
      throw new Meteor.Error(404, "Worker has already been assigned to a shift");
    }
  };

  var checkerHelper = new DocumentCheckerHelper(shift, Shifts);


  if (!checkerHelper.checkProperty('startTime', checkStartEndTime)) {
    //if start time wasn't checked try to check end time
    checkerHelper.checkProperty('endTime', checkStartEndTime);
  }


  //check if worker already assigned
  if (shift.assignedTo) {
    if (!checkerHelper.checkProperty('assignedTo', checkAssignedTo)) {
      //if wasn't checked make the same check if shiftDate changed
      checkerHelper.checkProperty('shiftDate', checkAssignedTo);
    }
  }

  return true;
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

  WeekDate: Match.Where(function (weekDate) {
    try {
      check(weekDate, {
        week: Number,
        year: Number
      });
    } catch (err) {
      checkError('Incorrect week date');
    }
    return true;
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
  SubscriptionDocument: SubscriptionDocument
});