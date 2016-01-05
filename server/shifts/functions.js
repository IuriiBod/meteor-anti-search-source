var canClockInOut = function (shiftId, user) {
  var assignedTo = Shifts.findOne({_id: shiftId}).assignedTo;
  return (assignedTo && (assignedTo === user._id || HospoHero.canUser('edit roster')))
};

Meteor.methods({
  clockIn: function (id) {
    var user = Meteor.user();
    if (!canClockInOut(id, user)) {
      throw new Meteor.Error("You have no permissions to Clock In/Clock Out");
    }
    check(id, HospoHero.checkers.ShiftId);
    Shifts.update({"_id": id}, {$set: {"status": "started", "startedAt": new Date()}});
    logger.info("Shift started", {"shiftId": id, "worker": user._id});
  },

  clockOut: function (id) {
    var user = Meteor.user();
    if (!canClockInOut(id, user)) {
      throw new Meteor.Error("You have no permissions to Clock In/Clock Out");
    }
    check(id, HospoHero.checkers.ShiftId);
    if (Shifts.findOne({"_id": id}).status === 'started') {
      Shifts.update({"_id": id}, {$set: {"status": "finished", "finishedAt": new Date()}});
      logger.info("Shift ended", {"shiftId": id, "worker": user._id});
    }

  },

  /**
   * Publishes the roster
   *
   * @param {Date} shiftDateQuery - Range of week
   */
  publishRoster: function (shiftDateQuery) {
    check(shiftDateQuery, HospoHero.checkers.WeekRange);
    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error("User not permitted to publish shifts");
      throw new Meteor.Error(403, "User not permitted to publish shifts ");
    }

    var shiftsToPublishQuery = {
      startTime: shiftDateQuery,
      published: false,
      type: null,
      'relations.areaId': HospoHero.getCurrentAreaId()
    };

    // IDs of user to notify
    var usersToNotify = {};
    var openShifts = [];

    var shiftsToPublish = Shifts.find(shiftsToPublishQuery, {
      fields: {
        assignedTo: 1,
        startTime: 1,
        endTime: 1,
        relations: 1
      }
    });

    if (shiftsToPublish.count() > 0) {
      var locationId = null;

      shiftsToPublish.forEach(function (shift) {
        locationId = shift.relations.locationId;

        if (shift.assignedTo) {
          if (usersToNotify[shift.assignedTo]) {
            usersToNotify[shift.assignedTo].push(shift);
          } else {
            usersToNotify[shift.assignedTo] = [shift];
          }
        } else {
          openShifts.push(shift);
        }
      });

      // Publishing shifts
      Shifts.update(shiftsToPublishQuery, {
        $set: {
          published: true,
          publishedOn: Date.now()
        }
      }, {
        multi: true
      });

      var shiftDate = shiftDateQuery.$gte;
      var routeParams = {
        week: moment(shiftDate).week(),
        year: moment(shiftDate).year()
      };

      Object.keys(usersToNotify).forEach(function (key) {
        new NotificationSender(
          'Weekly roster published',
          'roster-published',
          {
            date: HospoHero.dateUtils.formatDateWithTimezone(shiftDate, 'ddd, Do MMMM', locationId),
            shifts: usersToNotify[key],
            openShifts: openShifts,
            publishedByName: HospoHero.username(Meteor.userId()),
            linkToItem: Router.url('weeklyRoster', routeParams)
          },
          {
            helpers: {
              dateFormatter: function (shift) {
                return HospoHero.dateUtils.shiftDateInterval(shift)
              }
            }
          }
        ).sendBoth(key);
      });
    }
  },

  claimShift: function (shiftId) {
    var userId = Meteor.userId();
    if (!userId) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    check(shiftId, HospoHero.checkers.ShiftId);
    var shift = Shifts.findOne(shiftId);
    if (shift.assignedTo) {
      logger.error("Shift has already been assigned");
      throw new Meteor.Error(404, "Shift has already been assigned");
    }
    if (userId) {
      Shifts.update({'_id': shiftId}, {$addToSet: {"claimedBy": userId}});
    } else {
      Shifts.update({'_id': shiftId}, {$set: {"claimedBy": [userId]}});
    }
    logger.info("Shift has been claimed ", {"user": userId, "shiftId": shiftId});

    var userIds = HospoHero.roles.getUserIdsByAction('approves roster requests');

    if (userIds.length) {
      var notificationSender = new NotificationSender(
        'Shift claiming',
        'claim-shift',
        {
          date: HospoHero.dateUtils.formatDateWithTimezone(shift.startTime, 'ddd, Do MMMM', shift.relations.locationId),
          username: HospoHero.username(userId)
        },
        {
          interactive: true,
          helpers: {
            claimUrl: function (action) {
              return Router.url('claim', {id: this._notificationId, action: action});
            }
          },
          meta: {
            shiftId: shiftId,
            claimedBy: userId
          }
        }
      );

      userIds.forEach(function (userId) {
        notificationSender.sendNotification(userId);
      });
    }
  }
});