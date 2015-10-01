Meteor.publish("allJobTypes", function() {
  logger.info("Job types published");
  return JobTypes.find();
});

Meteor.publish("allSections", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "relations.areaId": HospoHero.currentArea(this.userId)
  };

  logger.info("Sections published");
  return Sections.find(query);
});

Meteor.publish("section", function(id) {
  logger.info("Sections published");
  return Sections.find({"_id": id});
});

Meteor.publish("allCategories", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "relations.areaId": HospoHero.currentArea(this.userId)
  };

  logger.info("Categories published");
  return Categories.find(query);
});

Meteor.publish("allStatuses", function() {
  logger.info("Statuses published");
  return Statuses.find();
});