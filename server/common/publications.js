Meteor.publish('jobTypes', function() {
  logger.info("JobTypes publication");
  return JobTypes.find();
});

Meteor.publish('sections', function(areaId) {
  if(this.userId) {
    var query = {
      "relations.areaId": areaId
    };
    return Sections.find(query);
  }
});

Meteor.publish('allCategories', function() {
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

Meteor.publish('allStatuses', function() {
  logger.info("Statuses published");
  return Statuses.find();
});