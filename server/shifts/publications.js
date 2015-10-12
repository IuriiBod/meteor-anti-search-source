Meteor.publish("daily", function (date, worker) {
  if (this.userId) {
    var cursors = [];
    var query = {
      "shiftDate": new Date(date).getTime(),
      "type": null,
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    if (worker) {
      query.assignedTo = worker;
    }

    var shiftsCursor = Shifts.find(query, {sort: {createdOn: 1}});
    cursors.push(shiftsCursor);

    var shifts = shiftsCursor.fetch();
    var shiftsList = [];
    shifts.forEach(function (shift) {
      if (shiftsList.indexOf(shift._id) < 0) {
        shiftsList.push(shift._id);
      }
    });

    if (shiftsList.length > 0) {
      var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
      cursors.push(jobsCursor);
    }
    logger.info("Daily shift detailed publication");
    return cursors;
  } else {
    this.ready();
  }
});

Meteor.publish("weekly", function (dates, worker, type) {
  if (this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    if (dates && !type) {
      query.shiftDate = TimeRangeQueryBuilder.forWeek(dates.monday, true);
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
  } else {
    this.ready();
  }
});

Meteor.publish("shift", function (id) {
  if (this.userId) {
    if (!id) {
      logger.error("Shift id is empty");
    }
    var shift = Shifts.find({_id: id});
    logger.info("Shift published", id);
    return shift;
  } else {
    this.ready();
  }
});

// New publisher for shifts
Meteor.publish('shifts', function(type, userId) {
  if(this.userId) {
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
    var currentDate = Date.now();

    if(type == 'future' || type == 'opened') {
      query.shiftDate = { $gte: currentDate };

      if(type == 'opened') {
        query.assignedTo = null;
        query.published = true;
      }
    } else if(type == 'past') {
      query.shiftDate = { $lte: currentDate };
      query.endTime = { $lte: currentDate };
      options.sort.shiftDate = -1;
    } else {
      this.ready();
    }

    logger.info("Rostered ", type, " shifts for user ", userId, " have been published");
    return Shifts.find(query, options);
  } else {
    this.ready();
  }
});