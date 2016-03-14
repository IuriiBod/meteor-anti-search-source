Meteor.publish('allIngredientsInArea', function (areaId, status) {
  if (this.userId) {
    let checkPermission = new HospoHero.security.PermissionChecker(this.userId);

    if (checkPermission.hasPermissionInArea(areaId, "edit stocks")) {
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
  if (this.userId) {
    let ingredientCursor = Ingredients.find({_id: id});
    let ingredientAreaId = ingredientCursor.fetch()[0].relations.areaId;
    let checkPermission = new HospoHero.security.PermissionChecker(this.userId);

    if (checkPermission.hasPermissionInArea(ingredientAreaId, "edit stocks")) {
      return ingredientCursor;
    } else {
      this.ready();
    }
  } else {
    this.ready();
  }
});