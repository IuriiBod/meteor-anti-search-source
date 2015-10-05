Meteor.startup(function () {
  //start all cron jobs
  SyncedCron.start();
});
