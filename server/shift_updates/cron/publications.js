Meteor.publish("cronConfig", function() {
  if(this.userId) {
    logger.info("Cron Config published");
    return CronConfig.find();
  }
});
