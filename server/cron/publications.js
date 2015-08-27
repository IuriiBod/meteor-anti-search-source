Meteor.publish("cronConfig", function() {
  var userId = this.userId;
  if(!userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var cronConfig = CronConfig.find();
  cursors.push(cronConfig);
  logger.info("Cron Config published");
  return cursors;
});
