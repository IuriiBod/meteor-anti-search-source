Meteor.publish("allJobTypes", function() {
  logger.info("Job types published");
  return JobTypes.find();
});

Meteor.publish("allSections", function() {
  if(this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    logger.info("Sections published");
    return Sections.find(query);
  } else {
    this.ready();
  }
});

Meteor.publish("section", function(id) {
  logger.info("Sections published");
  return Sections.find({"_id": id});
});

Meteor.publish("allCategories", function() {
  if(this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    logger.info("Categories published");
    return Categories.find(query);
  } else {
    this.ready();
  }
});

Meteor.publish("allStatuses", function() {
  logger.info("Statuses published");
  return Statuses.find();
});