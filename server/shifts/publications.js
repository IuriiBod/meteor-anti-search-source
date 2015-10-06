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
      var firstDate = dates.monday;
      var lastDate = dates.sunday;
      query.shiftDate = {$gte: new Date(firstDate).getTime(), $lte: new Date(lastDate).getTime()};
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

Meteor.publish("rosteredFutureShifts", function (id) {
  if (this.userId && id) {
    var query = {
      "shiftDate": {$gte: new Date().getTime()},
      "assignedTo": id,
      "type": null,
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    logger.info("Rostered future shifts for user ", id);

    return Shifts.find(query, {
      sort: {"shiftDate": 1},
      limit: 10
    });
  } else {
    this.ready();
  }
});

Meteor.publish("rosteredPastShifts", function (id) {
  if (this.userId && id) {
    var query = {
      "shiftDate": {$lte: new Date().getTime()},
      "assignedTo": id,
      "type": null,
      "endTime": {$lte: new Date().getTime()},
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    logger.info("Rostered past shifts for user ", id);
    return Shifts.find(query, {
      sort: {"shiftDate": -1},
      limit: 10
    });
  } else {
    this.ready();
  }
});

Meteor.publish("openedShifts", function () {
  if (this.userId) {
    var query = {
      "shiftDate": {$gte: new Date().getTime()},
      "assignedTo": null,
      "published": true,
      "type": null,
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    logger.info("Opened shifts published");
    return Shifts.find(query,
      {sort: {"shiftDate": 1}, limit: 10});
  } else {
    this.ready();
  }
});
