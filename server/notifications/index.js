Meteor.methods({
  notifyRoster: function (to, info) {
    if (!HospoHero.canUser('edit roster', Meteor.userId())) {
      logger.error("User not permitted to notify about roster changes");
      throw new Meteor.Error(403, "User not permitted to notify about roster changes");
    }

    var user = Meteor.user();

    var emailText = "Hi " + to.name + ", <br>";
    emailText += "I've just published the roster for the week starting " + info.startDate + ".<br><br>";
    emailText += "Here's your shifts";
    emailText += info.text;
    if (info.openShifts) {
      emailText += "<br><br>And check open shifts. You can claim them from the dashboard.";
      emailText += info.openShifts;
    }
    emailText += "<br>If there are any problems with the shifts, please let me know.";
    emailText += "<br>Thanks.<br>";
    emailText += user.username;
    //email
    Meteor.defer(function() {
      Email.send({
        "to": to.email,
        "from": user.emails[0].address,
        "subject": "[Hero Chef] " + info.title,
        "html": emailText
      });
      logger.info("Email sent for weekly roster", to._id);
    });

    //notification
    var notifi = {
      "type": "roster",
      "title": info.title + ". Checkout your shifts",
      "read": false,
      "text": [info.text],
      "to": to._id,
      "createdOn": new Date().getTime(),
      "createdBy": user._id,
      "ref": info.week,
      "actionType": "publish"
    };
    Notifications.insert(notifi);
    logger.info("Notification sent for weekly roster", to._id);

    var notifiOpen = {
      "type": "roster",
      "title": info.title + ". Checkout open shifts",
      "read": false,
      "text": [info.openShifts],
      "to": to._id,
      "createdOn": new Date().getTime(),
      "createdBy": user._id,
      "ref": info.week,
      "actionType": "publish"
    };
    Notifications.insert(notifiOpen);
    logger.info("Notification sent for open shifts on weekly roster", to._id);
  },

  'readNotifications': function (id) {
    var userId = Meteor.userId();
    if (!userId) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if (!id) {
      logger.error('Notification id not found');
      throw new Meteor.Error(404, "Notification id not found");
    }
    var notification = Notifications.findOne({'_id': id, 'to': userId});
    if (!notification) {
      logger.error('Notification not found');
      throw new Meteor.Error(404, "Notification not found");
    }
    if ((notification.type == "roster") && (notification.actionType == "claim")) {
      var shift = Shifts.findOne(notification.ref);
      if (shift && (shift.assignedTo == null && shift.claimedBy.length > 0)) {
        logger.error("Shift has not been assigned to any worker yet. Can't mark read");
        throw new Meteor.Error(404, "Shift has not been assigned to any worker yet. Can't mark read");
      }
    }
    Notifications.update({'_id': id, 'to': userId}, {$set: {"read": true}});
    logger.info("Notification read", {"user": userId, "notification": id});
  }
});