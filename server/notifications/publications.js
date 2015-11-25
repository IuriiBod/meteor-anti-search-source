Meteor.publish("newNotifications", function () {
  var userId = this.userId;
  if (userId) {
    var notifi = Notifications.find(
      {
        "to": userId,
        "read": false,
        "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
      },
      {fileds: {'_id': 1, "read": 1, "to": 1, "createdOn": -1}},
      {sort: {"createdOn": -1}}
    );
    logger.info("New notifications for " + userId + " published");
    return notifi;
  } else {
    this.ready();
  }
});

Meteor.publish("readNotifications", function () {
  var userId = this.userId;
  if (userId) {
    var notifi = Notifications.find({
        "to": userId,
        "read": true,
        "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
      }, {
        fileds: {
          '_id': 1,
          "read": 1,
          "to": 1,
          "createdOn": -1
        }
      }, {
        sort: {
          "createdOn": -1
        },
        limit: 10
      }
    );
    logger.info("Read notifications for " + userId + " published");
    return notifi;
  } else {
    this.ready();
  }
});