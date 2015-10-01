Meteor.publish('jobTypes', function() {
  logger.info("JobTypes publication");
  return JobTypes.find();
});

Meteor.publish("unAssignedJobs", function() {
  if(!this.userId) {
    return false;
  }

  var query = {
    status: "draft",
    onshift: null,
    "relations.areaId": HospoHero.currentArea(this.userId)
  };

  logger.info("Un-assigned jobs publication");
  return Jobs.find(query, {limit: 10});
});


Meteor.publish("jobs", function(ids) {
  logger.info("Jobs publication");
  return Jobs.find({"_id": {$in: ids}}, {limit: 10});
});