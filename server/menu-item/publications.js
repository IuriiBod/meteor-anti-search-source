Meteor.publishAuthorized('menuList', function (areaId, categoryId, status) {
  var query = {
    'relations.areaId': areaId
  };

  if (categoryId && categoryId != "all") {
    query.category = categoryId;
  }

  if (status) {
    query.status = (status && status != 'all') ? status : {$ne: 'archived'};
  }

  logger.info('Menu Items list published', categoryId, status);

  return MenuItems.find(query, {sort: {"name": 1}});
});

Meteor.publishComposite('menuItem', function (id) {
  return {
    find: function () {
      if (this.userId) {
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
        find: function (menuItem) {
          if (menuItem && menuItem.ingredients && menuItem.ingredients.length) {
            var ings = _.map(menuItem.ingredients, function (ingredient) {
              return ingredient._id;
            });
            return Ingredients.find({_id: {$in: ings}});
          } else {
            this.ready();
          }
        }
      },
      {
        find: function (menuItem) {
          if (menuItem && menuItem.jobItems && menuItem.jobItems.length) {
            var jobs = _.map(menuItem.jobItems, function (jobItem) {
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


Meteor.publishAuthorized("areaMenuItems", function (areaId, categoryId) {
  if (this.userId) {
    var query = {
      "relations.areaId": areaId,
      status: "active"
    };

    if (categoryId && categoryId != "all") {
      query.category = categoryId;
    }

    logger.info("Menu Items list published", categoryId);

    return MenuItems.find(query, {sort: {name: 1}});
  } else {
    this.ready();
  }
});


AntiSearchSource.queryTransform('menuItems', function (userId, query) {
  return _.extend(query, {
    'relations.areaId': HospoHero.getCurrentAreaId(userId)
  });
});

Meteor.publish('menuItemsSales', function (dailySalesDate, areaId, categoryId, status) {
  if (this.userId) {
    var observer;

    var query = {
      'relations.areaId': areaId
    };

    if (categoryId && categoryId != "all") {
      query.category = categoryId;
    }

    if (status) {
      query.status = (status && status != 'all') ? status : {$ne: 'archived'};
    }

    var round = function (value) {
      return HospoHero.misc.rounding(value);
    };

    var transform = function(menuItem) {
      var analizedMenuItem = HospoHero.analyze.menuItem(menuItem);
      var totalItemSalesQuantity = 0;
      menuItem.menuItemStats = {};
      DailySales.find({date: dailySalesDate, menuItemId: menuItem._id}).forEach(function (item) {
        totalItemSalesQuantity += item.actualQuantity || 0;
      });

      _.extend(analizedMenuItem, {soldQuantity: totalItemSalesQuantity});

      _.each(analizedMenuItem, function(item, key) {
        if (key !== 'tax' && key !== 'soldQuantity') {
          key = key.charAt(0).toUpperCase() + key.slice(1);
          return analizedMenuItem['total' + key] = HospoHero.misc.rounding(item * totalItemSalesQuantity);
        }
      });
      console.log(analizedMenuItem);
      _.extend(menuItem.menuItemStats, analizedMenuItem);
      //
      //console.log('analizedMenuItem -> ', analizedMenuItem);
      //
      //  _.extend(menuItem.menuItemStats, {
      //    contribution: analizedMenuItem.contribution,
      //    ingredientCost: analizedMenuItem.ingCost,
      //    prepCost: analizedMenuItem.prepCost,
      //    tax: analizedMenuItem.tax
      //  });
      //}
      return menuItem;
      };

    var self = this;

    observer = MenuItems.find({_id: '7D3k56oS6H9TdtK5h'}).observe({
      added: function (menuItem) {
        self.added('menuItems', menuItem._id, transform(menuItem));
      },
      changed: function (menuItem) {
        self.changed('menuItems', menuItem._id, transform(menuItem));
      },
      removed: function (oldDocument) {
        self.removed('menuItems', oldDocument._id);
      }
    });

    self.onStop(function () {
      observer.stop();
    });

    self.ready();
  } else {
    this.ready();
  }
});