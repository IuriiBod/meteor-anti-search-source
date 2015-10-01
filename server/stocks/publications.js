Meteor.publish("allIngredients", function() {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "status": "active",
    "relations.areaId": HospoHero.currentArea()
  };

  logger.info("All ingredients published");

  return  Ingredients.find(query, {sort: {'code': 1}, limit: 10});
});

Meteor.publish("ingredients", function(ids) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }

  var query = {
    "relations.areaId": HospoHero.currentArea()
  };
  var options = {
    sort: {'code': 1},
  };

  if(ids.length > 0) {
    query._id = {$in: ids};
  } else {
    options.limit = 10;
  }

  logger.info("Ingredients published", {"ids": ids});

  return Ingredients.find(query, options);
});

Meteor.publish("ingredientsRelatedJobs", function(id) {
  if(!this.userId) {
    logger.error('User not found');
    this.error(new Meteor.Error(404, "User not found"));
  }
  logger.info("Related jobs published", {"id": id});
  return JobItems.find({"ingredients._id": id});
});
