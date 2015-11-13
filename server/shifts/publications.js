Meteor.publishAuthorized('weeklyRoster', function (weekRange) {
  check(weekRange, HospoHero.checkers.WeekRange);

  logger.info("Shift date range in publisher", weekRange);

  //get shifts
  return Shifts.find({
    "relations.areaId": HospoHero.getCurrentAreaId(this.userId),
    shiftDate: weekRange
  });
});

Meteor.publishAuthorized('weeklyRosterTemplate', function (areaId) {
  logger.info("Weekly shifts template");

  //get shifts
  return Shifts.find({
    'relations.areaId': areaId,
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

  if (type == 'future' || type == 'opened') {
    query.shiftDate = {$gte: new Date()};
    if (type == 'opened') {
      query.assignedTo = {$in: [null, undefined]};
      query.published = true;
    }
  } else if (type == 'past') {
    query.shiftDate = {$lte: new Date()};
    query.endTime = {$lte: new Date()};
  } else if (type == 'today') {
    query.shiftDate = {$gte:moment().startOf('d').toDate(), $lte:moment().endOf('d').toDate()}
  } else {

  }

  logger.info('Rostered ', type, ' shifts for user ', userId, ' have been published');
  return Shifts.find(query);
});