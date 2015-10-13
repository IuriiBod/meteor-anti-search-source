Meteor.publish("ingredients", function(ids) {
  if(this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };
    var options = {
      sort: {'code': 1},
    };

    if (ids.length > 0) {
      query._id = {$in: ids};
    } else {
      options.limit = 10;
    }

    logger.info("Ingredients published", {"ids": ids});

    return Ingredients.find(query, options);
  } else {
    this.ready();
  }
});

Meteor.publish("ingredientsRelatedJobs", function(id) {
  if(this.userId) {
    logger.info("Related jobs published", {"id": id});
    return JobItems.find({"ingredients._id": id});
  } else {
    this.ready();
  }
});
