Meteor.publish("orderingUnits", function() {
  if(this.userId) {
    logger.info("OrderingUnits published");
    return OrderingUnits.find();
  } else {
    this.ready();
  }
});

Meteor.publish("usingUnits", function() {
  if(this.userId) {
    logger.info("UsingUnits published");
    return UsingUnits.find();
  } else {
    this.ready();
  }
});
