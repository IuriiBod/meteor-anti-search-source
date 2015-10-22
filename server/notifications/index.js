Meteor.methods({
  sendNotification: function(itemId, notification) {
    if(itemId) {
      HospoHero.checkMongoId(itemId);
    }
    check(notification, Object);

    var sendNotificationToId = [];

    if(notification.to) {
      sendNotificationToId = sendNotificationToId.concat(notification.to);
    }

    if(notification.type == 'menu' || notification.type == 'job') {
      var type = notification.type + 'list';
      var subscription = Subscriptions.findOne({_id: type});
      sendNotificationToId = sendNotificationToId.concat(subscription.subscribers);
    }

    var userId = Meteor.userId() || null;

    // removing userId from notifications list
    //var userIdIndex = sendNotificationToId.indexOf(userId);
    //sendNotificationToId.splice(userIdIndex, 1);

    if(sendNotificationToId.length) {
      var notificationObj = {
        read: false,
        createdBy: userId,
        ref: itemId,
        createdOn: new Date()
      };

      notificationObj.type = notification.type;
      notificationObj.title = notification.title;
      notificationObj.text = notification.text || '';
      notificationObj.actionType = notification.actionType || 'update';

      sendNotificationToId.forEach(function(to) {
        notificationObj.to = to;

        console.log('NOTY', notificationObj);

        Notifications.insert(notificationObj);
      });
    }
  },

  'sendNotifications': function (itemId, type, options) {
    var userId = Meteor.userId();
    if (!userId) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }

    var item = null;
    var info = {};
    info.type = type;
    info.read = false;
    info.title = options.title;
    info.createdBy = userId;
    var allSubscribers = [];

    if (type == 'organization') {
      info.to = options.to;
      return Notifications.insert(info);
    }

    if(type != "comment" || type != "roster") {
      if(!itemId) {
        logger.error('ItemId should have a value');
        throw new Meteor.Error(404, "ItemId should have a value");
      }
      info.ref = itemId;
      info.text = options.text;
      info.actionType = options.type;
      var itemSubsbcribers = Subscriptions.findOne(itemId);
      if(itemSubsbcribers && itemSubsbcribers.subscribers.length > 0) {
        allSubscribers = itemSubsbcribers.subscribers;
      }
    }

    if (type == "menu") {
      var listSubscribers = Subscriptions.findOne("menulist");
      if (listSubscribers && listSubscribers.subscribers.length > 0) {
        if (allSubscribers > 0) {
          allSubscribers.concat(listSubscribers.subscribers);
        } else {
          allSubscribers = listSubscribers.subscribers;
        }
      }
      if (options.type == "delete") {
        if (!options.time) {
          logger.error('Items deleted time needed');
          throw new Meteor.Error(404, "Items deleted time needed");
        }
        time = options.time;
        info.createdOn = time;
      } else {
        item = MenuItems.findOne(itemId);
        if (options.type == "create") {
          info.createdOn = item.createdOn;
          info.text = [item.name];
        } else if (options.type == "edit") {
          info.createdOn = item.editedOn;
        }
      }

    } else if (type == "job") {
      var listSubscribers = Subscriptions.findOne("joblist");
      if (listSubscribers && listSubscribers.subscribers.length > 0) {
        if (allSubscribers > 0) {
          allSubscribers.concat(listSubscribers.subscribers);
        } else {
          allSubscribers = listSubscribers.subscribers;
        }
      }
      if (options.type == "delete") {
        if (!options.time) {
          logger.error('Items deleted time needed');
          throw new Meteor.Error(404, "Items deleted time needed");
        }
        time = options.time;
        info.createdOn = time;
      } else {
        item = JobItems.findOne(itemId);
        if (options.type == "create") {
          info.createdOn = item.createdOn;
          info.text = [item.name];
        } else if (options.type == "edit") {
          info.createdOn = item.editedOn;
        }
      }

    } else if (type == "comment") {
      if (!options.commentId) {
        logger.error('Comment Id needed');
        throw new Meteor.Error(404, "Comment Id needed");
      }
      info.refType = options.type;
      var comment = Comments.findOne(options.commentId);
      if (comment) {
        info.text = [comment.text];
        info.createdOn = comment.createdOn;
        info.ref = comment.reference;
      }
    } else if (type == "roster") {
      info.actionType = options.type;
      info.ref = itemId;
      info.createdOn = Date.now();
      var text = "";
      var shift = Shifts.findOne(itemId);

      if(shift) {
        if(options.type == "claim") {
          if(shift.claimedBy && shift.claimedBy.length > 0) {
            var claimedUsers = Meteor.users.find({"_id": {$in: shift.claimedBy}}).fetch();
            text += "<ol>";
            claimedUsers.forEach(function(user) {
              text += "<li>" + user.username + " <a href='#' class='confirmClaim' data-id='" + user._id + "' data-shift='" + itemId + "'><small class='text-success'>Confirm</small></a>";
              text += " <a href='#' class='rejectClaim' data-id='" + user._id + "' data-shift='" + itemId + "'><small class='text-danger'>Reject</small></a></li>";
            });
            text += "</ol>";
          }
          var users = Meteor.users.find({$or: [{"isManager": true}, {"isAdmin": true}]}).fetch();
          if (users && users.length > 0) {
            users.forEach(function (user) {
              allSubscribers.push(user._id);
            });
          }
        } else if (options.type == "confirm") {
          allSubscribers.push(shift.assignedTo);
        } else if (options.type == "reject") {
          var existInShift = Shifts.findOne({"shiftDate": shift.shiftDate, "assignedTo": options.rejected})
          if (shift.assignedTo) {
            text = "Shift assigned to another worker";
          } else if (existInShift) {
            text = "You already have an assigned shift for this date";
          } else {
            text = "Contact " + Meteor.user().username + " for more information";
          }
          allSubscribers.push(options.rejected);
        }

        if (options.type == "confirm" || options.type == "reject" || options.type == "claim") {
          info.text = text;
        } else if (options.type == "update") {
          info.text = options.text;
          allSubscribers.push(options.to);
        }
      }
    }

    if(type == "job" || type == "menu" || type == "roster") {
      allSubscribers.forEach(function(subscriber) {
        if(subscriber != userId) {
          var doc = info;
          doc.to = subscriber;

          var id = Notifications.insert(doc);
          logger.info("Notification send to userId", subscriber, id);
        }
      });
    } else if(type == "comment") {
      if(!options.users) {
        logger.error('User ids not found');
        throw new Meteor.Error(404, "User ids not found");
      }
      options.users.forEach(function(username) {
        var filter = new RegExp(username);
        var subscriber = Meteor.users.findOne({"username": filter});
        if(subscriber && (subscriber._id != userId)) {
          var doc = info;
          doc.to = subscriber._id;

          var id = Notifications.insert(doc);
          logger.info("Notification send to userId", subscriber._id, id);
        }
      });
    }
  },

  sendNewsfeedNotifications: function(itemId, type, options) {
    //tagging users
    //commenting on newsfeed items that as been created by someone
    //liking newsfeed items

    var userId = Meteor.userId();
    if(!HospoHero.isInOrganization(userId)) {
      logger.error(403, "User not permitted to send notifications");
      throw new Meteor.Error(403, "User not permitted to send notifications");
    }

    var info = {};
    info.type = type;
    info.read = false;
    info.title = options.title;
    info.createdBy = userId;
    if(!options.users) {
      logger.error('User ids not found');
      throw new Meteor.Error(404, "User ids not found");
    }
    var userIds = [];
    options.users.forEach(function(username) {
      var filter = new RegExp(username);
      var subscriber = Meteor.users.findOne({"username": filter});
      if(subscriber && (subscriber._id != userId)) {
        if(userIds.indexOf(subscriber._id) < 0) {
          var doc = info;
          doc.to = subscriber._id;
          userIds.push(subscriber._id);

          var id = Notifications.insert(doc);
          logger.info("Notification send to userId", subscriber._id, id);
        }
      }
    });
  },

  notifyRoster: function (to, info) {
    if (!HospoHero.perms.canUser('editRoster')()) {
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