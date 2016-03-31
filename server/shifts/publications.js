let checkViewRosterPermission = function (userId, areaId) {
  let permissionChecker = userId && new HospoHero.security.PermissionChecker(userId);
  return permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'view roster');
};

Meteor.publishAuthorized('weeklyRoster', function (weekRange, areaId) {
  check(weekRange, HospoHero.checkers.WeekRange);
  check(areaId, HospoHero.checkers.MongoId);

  if (!checkViewRosterPermission(this.userId, areaId)) {
    this.ready();
    return;
  }

  logger.info("Shift date range in publisher", weekRange);

  return Shifts.find({
    startTime: weekRange,
    type: null,
    'relations.areaId': areaId
  });
});

Meteor.publishAuthorized('weeklyRosterTemplate', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (!checkViewRosterPermission(this.userId, areaId)) {
    this.ready();
    return;
  }

  logger.info("Weekly shifts template");

  return Shifts.find({
    type: 'template',
    'relations.areaId': areaId
  });
});

//todo:roster subs below should be refactored

Meteor.publishComposite('daily', function (date, areaId, worker) {
  return {
    find: function () {
      if (!this.userId) {
        this.ready();
        return;
      }

      var area = Areas.findOne({_id: areaId});

      if (!area) {
        this.ready();
        return;
      }

      var query = {
        startTime: TimeRangeQueryBuilder.forDay(date, area.locationId),
        type: null,
        'relations.areaId': areaId
      };

      if (worker) {
        query.assignedTo = worker;
      }

      return Shifts.find(query);
    }
  };
});

Meteor.publishAuthorized('shift', function (id) {
  check(id, HospoHero.checkers.MongoId);
  logger.info("Shift published", id);
  return Shifts.find({_id: id});
});

// New publisher for shifts
Meteor.publishAuthorized('shifts', function (type, userId, areaId, date) {
  var query = {
    assignedTo: userId,
    type: null,
    'relations.areaId': areaId
  };

  var todayDate = date || new Date();
  if (type === 'future' || type === 'opened') {
    query.startTime = {$gte: todayDate};

    if (type === 'opened') {
      _.extend(query, {
        assignedTo: {$in: [null, undefined]},
        published: true
      });
    }
  } else if (type === 'past') {
    _.extend(query, {
      startTime: {$lte: todayDate},
      endTime: {$lte: todayDate}
    });
  } else if (type === 'today') {
    var currentArea = Areas.findOne({_id: areaId});

    if (currentArea) {
      var locationId = currentArea.locationId;
      query.startTime = TimeRangeQueryBuilder.forDay(todayDate, locationId);
    }
  } else {
    this.ready();
  }

  logger.info('Rostered ', type, ' shifts for user ', userId, ' have been published');
  return Shifts.find(query);
});