Meteor.publishAuthorized('weeklyRoster', function (weekDate) {
  check(weekDate, HospoHero.checkers.WeekDate);

  var date = HospoHero.dateUtils.getDateByWeekDate(weekDate);

  logger.info("Weekly shifts detailed publication");

  //get shifts
  return Shifts.find({
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId),
    shiftDate: TimeRangeQueryBuilder.forWeek(date, false)
  });
});

Meteor.publishAuthorized('weeklyRosterTemplate', function () {
  logger.info("Weekly shifts template");

  //get shifts
  return Shifts.find({
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId),
    type: 'template'
  });
});


Meteor.publishComposite('daily', function (date, areaId, worker) {
  return {
    find: function () {
      if (this.userId) {
        var query = {
          shiftDate: moment(date).startOf('day'),
          type: null,
          'relations.areaId': areaId
        };

        if (worker) {
          query.assignedTo = worker;
        }

        return Shifts.find(query);
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function (shift) {
          if (shift) {
            return Jobs.find({onshift: shift});
          } else {
            this.ready();
          }
        }
      }
    ]
  }
});

Meteor.publishAuthorized("shift", function (id) {
  check(id, HospoHero.checkers.MongoId);
  logger.info("Shift published", id);
  return Shifts.find({_id: id});
});

// New publisher for shifts
Meteor.publishAuthorized('shifts', function (type, userId, areaId) {
  var query = {
    assignedTo: userId,
    type: null,
    'relations.areaId': areaId
  };

  var options = {
    limit: 10
  };

  if (type == 'future' || type == 'opened') {
    query.shiftDate = {$gte: HospoHero.dateUtils.shiftDate()};

    if (type == 'opened') {
      query.assignedTo = null;
      query.published = true;
    }
  } else if (type == 'past') {
    query.shiftDate = {$lte: new Date()};
    query.endTime = {$lte: new Date()};
  } else {
    this.ready();
  }

  logger.info('Rostered ', type, ' shifts for user ', userId, ' have been published');
  return Shifts.find(query, options);
});