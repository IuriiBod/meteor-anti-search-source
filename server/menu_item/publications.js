Meteor.publish("menuList", function (categoryId, status) {
  if (this.userId) {
    var query = {};

    var user = Meteor.users.findOne({_id: this.userId});
    if (user.currentAreaId) {
      query["relations.areaId"] = user.currentAreaId;
    }

    if (categoryId && categoryId != "all") {
      query.category = categoryId;
    }

    if (status) {
      query.status = (status && status != 'all') ? status : {$ne: 'archived'};
    }

    logger.info("Menu Items list published", categoryId, status);

    return MenuItems.find(query, {sort: {"name": 1}, limit: 30});
  } else {
    this.ready();
  }
});

Meteor.publish("menuItem", function (id) {
  if (this.userId) {
    var cursor = [];
    var query = {
      _id: id,
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

    var menu = MenuItems.find(query);
    cursor.push(menu);

    if (menu.length) {
      var menuFetched = menu.fetch()[0];
      var ingIds = [];
      if (menuFetched.ingredients && menuFetched.ingredients.length > 0) {
        menuFetched.ingredients.forEach(function (ing) {
          ingIds.push(ing._id);
        });
        cursor.push(Ingredients.find({"_id": {$in: ingIds}}));
      }

      var prepIds = [];
      if (menuFetched.jobItems && menuFetched.jobItems.length > 0) {
        menuFetched.jobItems.forEach(function (prep) {
          prepIds.push(prep._id);
        });
        cursor.push(JobItems.find({"_id": {$in: prepIds}}));
      }
      return cursor;
    }
  } else {
    this.ready();
  }
});

Meteor.publish("menuItems", function (ids) {
  if (this.userId) {
    if (Array.isArray(ids)) {
      var query = {
        _id: {$in: ids},
        "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
      };

      logger.info("Menu items published", ids);
      return MenuItems.find(query, {limit: 10});
    }
  } else {
    this.ready();
  }
});


Meteor.publish("locationMenuItems", function () {
  if (this.userId) {
    var currentLocationId = HospoHero.getCurrentArea(this.userId).locationId;
    return MenuItems.find({'relations.locationId': currentLocationId});
  } else {
    this.ready();
  }
});