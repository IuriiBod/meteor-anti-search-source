Meteor.publish("userSubs", function(ids) {
  if(this.userId) {
    if (ids.length > 0) {
      logger.info("Subscriptions published ", {"id": ids});
      return Subscriptions.find({"_id": {$in: ids}});
    }
  } else {
    this.ready();
  }
});