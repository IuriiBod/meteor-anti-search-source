Meteor.publish('allIngredientsInArea', function (areaId, status) {
  check(areaId, HospoHero.checkers.MongoId);
  check(status, Match.OneOf('active', 'archived', null));

  let checkPermission = this.userId && new HospoHero.security.PermissionChecker(this.userId);

  if (checkPermission && checkPermission.hasPermissionInArea(areaId, "edit stocks")) {
    var query = {
      'relations.areaId': areaId
    };

    if (status) {
      query.status = status;
    }

    return Ingredients.find(query);
  } else {
    this.ready();
  }
});

Meteor.publish('ingredientsRelatedJobs', function (id) {
  if (this.userId) {
    logger.info('Related jobs published', {_id: id});
    return JobItems.find({"ingredients._id": id, "relations.areaId": HospoHero.getCurrentAreaId(this.userId)});
  } else {
    this.ready();
  }
});

Meteor.publish('ingredient', function (id) {
  check(id, HospoHero.checkers.MongoId);

  let checkPermission = this.userId && new HospoHero.security.PermissionChecker(this.userId);
  let ingredientCursor = Ingredients.find({_id: id});
  let ingredientAreaId = ingredientCursor.count() && ingredientCursor.fetch()[0].relations.areaId;

  if (checkPermission && ingredientAreaId && checkPermission.hasPermissionInArea(ingredientAreaId, "edit stocks")) {
    return ingredientCursor;
  } else {
    this.ready();
  }
});