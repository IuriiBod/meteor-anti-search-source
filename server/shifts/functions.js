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
    Shifts.update({_id: id}, {$set: {status: 'started', startedAt: new Date()}});
    logger.info("Shift started", {shiftId: id, worker: user._id});
  },

  clockOut: function (id) {
    var user = Meteor.user();
    if (!canClockInOut(id, user)) {
      throw new Meteor.Error("You have no permissions to Clock In/Clock Out");
    }
    check(id, HospoHero.checkers.ShiftId);
    if (Shifts.findOne({"_id": id}).status === 'started') {
      Shifts.update({_id: id}, {$set: {status: 'finished', finishedAt: new Date()}});
      logger.info("Shift ended", {shiftId: id, worker: user._id});
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
        section: 1,
        relations: 1
      }
    });

    if (shiftsToPublish.count() > 0) {
      var locationId = null;

      shiftsToPublish.forEach(function (shift) {
        locationId = locationId || shift.relations.locationId;

        if (shift.assignedTo) {
          if (usersToNotify[shift.assignedTo]) {
            usersToNotify[shift.assignedTo].push(shift);
          } else {
            usersToNotify[shift.assignedTo] = [shift];
          }

          // Create events in user's calendar
          Meteor.call('addJobsToCalendar', shift);
        } else {
          openShifts.push(shift);
        }
      });

      //// Publishing shifts
      //Shifts.update(shiftsToPublishQuery, {
      //  $set: {
      //    published: true,
      //    publishedOn: Date.now()
      //  }
      //}, {
      //  multi: true
      //});
      //
      //var shiftDate = shiftDateQuery.$gte;
      //shiftDate = HospoHero.dateUtils.getDateStringForRoute(shiftDate, locationId);
      //
      //Object.keys(usersToNotify).forEach(function (key) {
      //  new NotificationSender(
      //    'Weekly roster published',
      //    'roster-published',
      //    {
      //      date: HospoHero.dateUtils.formatDateWithTimezone(shiftDate, 'ddd, Do MMMM', locationId),
      //      shifts: usersToNotify[key],
      //      openShifts: openShifts,
      //      publishedByName: HospoHero.username(Meteor.userId()),
      //      linkToItem: Router.url('weeklyRoster', {date: shiftDate}),
      //      areaName: HospoHero.getCurrentArea().name
      //    },
      //    {
      //      helpers: {
      //        sectionNameFormatter: function (shift) {
      //          var section = Sections.findOne({_id: shift.section});
      //          return section && section.name || 'open';
      //        },
      //        dateFormatter: function (shift) {
      //          return HospoHero.dateUtils.shiftDateInterval(shift)
      //        }
      //      }
      //    }
      //  ).sendBoth(key);
      //});
    }
  },

  claimShift: function (shiftId) {
    var userId = Meteor.userId();
    if (!HospoHero.canUser('be rosted', userId)) {
      logger.error('User can\'t be rosted onto shifts');
      throw new Meteor.Error(404, 'User can\'t be rosted onto shifts');
    }

    check(shiftId, HospoHero.checkers.ShiftId);

    var shift = Shifts.findOne(shiftId);
    if (shift.assignedTo) {
      logger.error('Shift has been already assigned');
      throw new Meteor.Error(404, 'Shift has been already assigned');
    }

    if (shift.claimedBy && _.isArray(shift.claimedBy)) {
      Shifts.update({'_id': shiftId}, {$addToSet: {claimedBy: userId}});
    } else {
      Shifts.update({'_id': shiftId}, {$set: {claimedBy: [userId]}});
    }
    logger.info('Shift has been claimed', {user: userId, shiftId: shiftId});

    var userIds = HospoHero.roles.getUserIdsByAction('approves roster requests');

    if (userIds.length) {
      sendNotification(shift, userIds);
    }
  },

  approveClaimShift: function (notificationId, action) {
    var notification = Notifications.findOne({_id: notificationId});
    var meta = notification.meta;
    var shiftId = meta.shiftId;
    var claimedBy = meta.claimedBy;

    if (action === 'confirm') {
      Shifts.update({_id: shiftId}, {
        $set: {
          assignedTo: claimedBy
        },
        $unset: {
          claimedBy: 1,
          rejectedFor: 1
        }
      });
      Notifications.remove({'meta.shiftId': shiftId});
    } else {
      Shifts.update({_id: shiftId}, {
        $pull: {
          claimedBy: claimedBy
        },
        $addToSet: {
          rejectedFor: claimedBy
        }
      });
      Notifications.remove({_id: notificationId});
    }
  }
});

var sendNotification = function (shift, userIds) {
  var userId = Meteor.userId();
  var notificationTitle = 'Shift claiming';

  var area = Areas.findOne({_id: shift.relations.areaId});
  var section = Sections.findOne({_id: shift.section});

  var rosterDate = HospoHero.dateUtils.getDateStringForRoute(shift.startTime, shift.relations.locationId);
  var rosterUrl = Router.url('weeklyRoster', {date: rosterDate});

  var params = {
    date: HospoHero.dateUtils.formatDateWithTimezone(shift.startTime, 'ddd, Do MMMM', shift.relations.locationId),
    username: HospoHero.username(userId),
    areaName: area.name,
    sectionName: section && section.name || 'open',
    rosterUrl: rosterUrl
  };

  var options = {
    interactive: true,
    helpers: {
      confirmClaimUrl: function () {
        return NotificationSender.actionUrlFor('approveClaimShift', this._notificationId, 'confirm');
      },
      rejectClaimUrl: function () {
        return NotificationSender.actionUrlFor('approveClaimShift', this._notificationId, 'reject');
      }
    },
    meta: {
      shiftId: shift._id,
      claimedBy: userId
    }
  };

  var notificationSender = new NotificationSender(notificationTitle, 'claim-shift', params, options);
  userIds.forEach(function (userId) {
    notificationSender.sendNotification(userId);
  });
};