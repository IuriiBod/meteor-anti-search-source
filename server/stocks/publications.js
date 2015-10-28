Meteor.publish("ingredients", function(ids, status) {
  if(this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };
    var options = {
      sort: {'code': 1}
    };

    if (ids && ids.length > 0) {
      query._id = {$in: ids};
    }

    if(status) {
      query.status = status;
    }

    return Ingredients.find(query, options);
  } else {
    this.ready();
  }
});

Meteor.publish("ingredientsRelatedJobs", function(id) {
  if(this.userId) {
    logger.info("Related jobs published", {"id": id});
    return JobItems.find({ "ingredients._id": id, "relations.areaId": HospoHero.getCurrentAreaId(this.userId) });
  } else {
    this.ready();
  }
});
