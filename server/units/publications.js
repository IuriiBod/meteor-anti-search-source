Meteor.publish("orderingUnits", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error("User not found"));
  }
  logger.info("OrderingUnits published");
  return OrderingUnits.find();
});

Meteor.publish("usingUnits", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error("User not found"));
  }
  logger.info("UsingUnits published");
  return UsingUnits.find();
});
