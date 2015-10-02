Meteor.publish("newNotifications", function() {
  var userId = this.userId;
  if(!userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
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
});

Meteor.publish("readNotifications", function() {
  var userId = this.userId;
  if(!userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
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
});