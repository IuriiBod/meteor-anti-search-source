Meteor.publishAuthorized('userSubscriptions', function() {
  if(this.userId) {
    logger.info('Subscriptions for user ' + this.userId + ' published');
    return Subscriptions.find({
      subscriber: this.userId,
      'relations.areaId': HospoHero.getCurrentAreaId(this.userId)
    });
  } else {
    this.ready();
  }
});