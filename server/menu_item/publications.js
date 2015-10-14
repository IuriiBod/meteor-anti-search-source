Meteor.publish("menuList", function (categoryId, status) {
  if (this.userId) {
    var query = {
      "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
    };

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

Meteor.publishComposite('menuItem', function(id) {
  return {
    find: function() {
      if(this.userId) {
        return MenuItems.find({
          _id: id,
          "relations.areaId": HospoHero.getCurrentAreaId(this.userId)
        });
      } else {
        this.ready();
      }
    },
    children: [
      {
        find: function(menuItem) {
          if(menuItem && menuItem.ingredients && menuItem.ingredients.length) {
            var ings = _.map(menuItem.ingredients, function(ingredient) {
              return ingredient._id;
            });
            return Ingredients.find({_id: {$in: ings}});
          } else {
            this.ready();
          }
        }
      },
      {
        find: function(menuItem) {
          if(menuItem && menuItem.jobItems && menuItem.jobItems.length) {
            var jobs = _.map(menuItem.jobItems, function(jobItem) {
              return jobItem._id;
            });
            return JobItems.find({_id: {$in: jobs}});
          } else {
            this.ready();
          }
        }
      }
    ]
  };
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


Meteor.publish("areaMenuItems", function () {
  if (this.userId) {
    var currentAreaId = HospoHero.getCurrentAreaId(this.userId);
    return MenuItems.find({'relations.areaId': currentAreaId});
  } else {
    this.ready();
  }
});