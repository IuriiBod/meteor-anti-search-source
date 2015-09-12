Meteor.publish("orderingUnits", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("OrderingUnits published");
  return OrderingUnits.find();
});

Meteor.publish("usingUnits", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("UsingUnits published");
  return UsingUnits.find();
});
