Meteor.publishAuthorized('weekly', function (dates, worker, type) {
  var query = {
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
  };

  if (dates && !type) {
    query.shiftDate = TimeRangeQueryBuilder.forWeek(dates.monday, false);
  }
  if (worker) {
    query.assignedTo = worker;
  }

  if (type) {
    query.type = type;
  }

  logger.info("Weekly shifts detailed publication");

  //get shifts
  return Shifts.find(query, {sort: {"shiftDate": 1}});
});

Meteor.publishComposite('daily', function (date, worker) {
  return {
    find: function () {
      if (this.userId) {
        var query = {
          shiftDate: moment(date).startOf('day'),
          type: null,
          "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
        };

        if (worker) {
          query.assignedTo = worker;
        }

        return Shifts.find(query, {sort: {createdOn: 1}});
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
Meteor.publishAuthorized('shifts', function (type, userId) {
  var query = {
    assignedTo: userId,
    type: null,
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
  };

  var options = {
    sort: {
      shiftDate: 1
    },
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
    options.sort.shiftDate = -1;
  } else {
    this.ready();
  }

  logger.info("Rostered ", type, " shifts for user ", userId, " have been published");
  return Shifts.find(query, options);
});