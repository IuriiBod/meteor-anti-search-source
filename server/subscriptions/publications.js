Meteor.publishAuthorized('userSubscriptions', function(areaId) {
  if(this.userId) {
    logger.info('Subscriptions for user ' + this.userId + ' published');
    return Subscriptions.find({
      subscriber: this.userId,
      'relations.areaId': areaId
    });
  } else {
    this.ready();
  }
});