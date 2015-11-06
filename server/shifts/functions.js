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
    if (Shifts.findOne({"_id": id}).status === 'started'){
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
      shiftDate: shiftDateQuery,
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
        shiftDate: 1,
        endTime: 1
      }
    });

    if (shiftsToPublish.count() > 0) {
      shiftsToPublish.forEach(function (shift) {
        if (shift.assignedTo) {
          if (usersToNotify[shift.assignedTo]) {
            usersToNotify[shift.assignedTo].push(shift);
          } else {
            usersToNotify[shift.assignedTo] = [shift];
          }
        } else {
          openShifts.push(shift);
        }
      })
    }
    // Publishing shifts
    Shifts.update(shiftsToPublishQuery, {
      $set: {
        published: true,
        publishedOn: Date.now()
      }
    }, {
      multi: true
    });

    notifyUsersPublishRoster(shiftDateQuery.$gte, usersToNotify, openShifts);
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

    var text = [];
    text.push("Shift on ");
    text.push(moment(shift.shiftDate).format("ddd, Do MMMM"));
    text.push(" has been claimed by following workers");
    text.push('<ul>');

    shift = Shifts.findOne({_id: shiftId});
    shift.claimedBy.forEach(function (userId) {
      text.push('<li>');
      text.push(HospoHero.username(userId));
      text.push(' <a href="#" class="confirmClaim" data-id="');
      text.push(userId);
      text.push('" data-shift="');
      text.push(shiftId);
      text.push('"><small class="text-success">Confirm</small></a>');
      text.push(' <a href="#" class="rejectClaim" data-id="');
      text.push(userId);
      text.push('" data-shift="');
      text.push(shiftId);
      text.push('"><small class="text-danger">Reject</small></a></li>');
    });
    text.push('</ul>');

    var options = {
      title: text.join(''),
      type: "claim",
      to: userIds,
      ref: shiftId
    };

    HospoHero.sendNotification(options);
  },

  confirmClaim: function (shiftId, userId) {
    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error("User does not have permission to confirm a shift claim");
      throw new Meteor.Error(403, "User does not have permission to confirm a shift claim");
    }
    var claimedBy = Meteor.users.findOne(userId);
    if (!claimedBy) {
      logger.error("Claimed user not found");
      throw new Meteor.Error(404, "Claimed user not found");
    }
    check(shiftId, HospoHero.checkers.ShiftId);
    var shift = Shifts.findOne(shiftId);
    if (shift.assignedTo) {
      logger.error("Shift has already been assigned");
      throw new Meteor.Error(404, "Shift has already been assigned");
    }
    var hasBeenAssigned = Shifts.findOne({
      "shiftDate": TimeRangeQueryBuilder.forDay(shift.shiftDate),
      "assignedTo": userId
    });
    if (hasBeenAssigned) {
      logger.error("User already has a shift on this day");
      throw new Meteor.Error(404, "User already has a shift on this day");
    }
    Shifts.update({"_id": shiftId}, {$set: {"assignedTo": userId}, $unset: {claimedBy: 1}});
    logger.info("Shift claim confirmed ", {"shiftId": shiftId, "user": userId});

    var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been confirmed";
    var options = {
      title: text,
      actionType: 'confirm',
      type: 'roster',
      to: userId,
      ref: shiftId
    };
    HospoHero.sendNotification(options);
  },

  rejectClaim: function (shiftId, userId) {
    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error("User does not have permission to confirm a shift claim");
      throw new Meteor.Error(403, "User does not have permission to confirm a shift claim");
    }
    check(shiftId, HospoHero.checkers.ShiftId);
    var shift = Shifts.findOne(shiftId);
    if (shift.assignedTo == userId) {
      logger.error("User has been assigned to this shift");
      throw new Meteor.Error(404, "User has been assigned to this shift");
    }
    if (shift.claimedBy.indexOf(userId) < 0) {
      logger.error("User has not claimed the shift");
      throw new Meteor.Error(404, "User has not claimed the shift");
    }
    Shifts.update({"_id": shiftId}, {$pull: {"claimedBy": userId}, $push: {"rejectedFor": userId}});
    logger.info("Shift claim rejected ", {"shiftId": shiftId, "user": userId});

    var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been rejected";
    var options = {
      "title": text,
      "actionType": "reject",
      type: 'roster',
      to: userId,
      ref: shiftId
    };
    HospoHero.sendNotification(options);
  }
});

var formatNotificationText = function (notificationTextArray) {
  var text = _.reduce(notificationTextArray, function (memo, shift) {
    return memo + '<li>' + HospoHero.dateUtils.shiftDateInterval(shift) + '</li>';
  }, '');
  return '<ul>' + text + '</ul>';
};

var formatEmailText = function (date, userShiftsText, openShiftsText) {
  var text = [];
  text.push("I've just published the roster for the week starting " + date + ".<br><br>");
  text.push("Here's your shifts");
  text.push(userShiftsText);

  if (openShiftsText) {
    text.push("<br><br>And check open shifts. You can claim them from the dashboard.");
    text.push(openShiftsText);
  }
  return text.join('');
};

/**
 * Sends notifications and emails to rostered users after publishing new roster
 *
 * @param {Date} date - The date of published roster
 * @param {Object} usersToNotify - The object of users to notify
 * @param {Array} openShifts - The array of open shifts (if exists)
 */
var notifyUsersPublishRoster = function (date, usersToNotify, openShifts) {
  if (Object.keys(usersToNotify).length > 0) {
    var text;
    var stringDate = moment(date).startOf('isoweek').format("dddd, Do MMMM YYYY");
    var subject = 'Weekly roster for the week starting from ' + stringDate + ' published.';

    // Creating the instance of EmailSender object
    var emailSender = new EmailSender({
      from: Meteor.userId(),
      subject: subject
    });

    // If there are some opened shifts
    // create the notification object for it
    if (openShifts.length) {
      var notifyOpenShifts = {
        type: 'roster',
        title: subject + ' Checkout open shifts',
        text: formatNotificationText(openShifts)
      };
    }

    for (var userId in usersToNotify) {
      if (usersToNotify.hasOwnProperty(userId)) {
        // Sending open shifts at first
        if (notifyOpenShifts) {
          notifyOpenShifts.to = userId;
          HospoHero.sendNotification(notifyOpenShifts);
        }

        var options = {
          type: 'roster',
          to: userId,
          title: subject + ' Checkout your shifts',
          text: formatNotificationText(usersToNotify[userId])
        };

        // Sending users shifts
        HospoHero.sendNotification(options);

        // Adding receiver ID and email text to the EmailSender object
        emailSender.addOption('to', userId);
        var openShiftsText = notifyOpenShifts ? notifyOpenShifts.text : '';
        emailSender.addOption('text', formatEmailText(stringDate, options.text, openShiftsText));

        // Sending email to user
        emailSender.send();
      }
    }
  }
};