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

Meteor.publish('menuItemsSales', function (query) {
  if (this.userId) {
    var observer;
    var menuItemsIds = [];

    var round = function (value) {
      return HospoHero.misc.rounding(value);
    };

    var getSortedMenuItems = function () {
      var filteredMenuItems = menuItemsIds.map(function (id) {
        var filteredMenuItemStats = _.filter(menuItemsStats, function (item) {
          return item.menuItemId === id;
        });

        //console.log('----------------------');
        //console.log(filteredMenuItemStats.length);
        //console.log('----------------------');

        return filteredMenuItemStats.reduce(function (previousValue, currentValue) {
          return {
            menuItemId: currentValue.menuItemId,
            totalIngCost: round(previousValue.totalIngCost + currentValue.totalIngCost),
            totalPrepCost: round(previousValue.totalPrepCost + currentValue.totalPrepCost),
            totalTax: round(previousValue.tax + currentValue.tax),
            totalContribution: round(previousValue.totalContribution + currentValue.totalContribution)
          }
        });
      });

      //filteredMenuItems.sort(function (a, b) {
      //  if (a.totalContribution < b.totalContribution) {
      //    return 1;
      //  } else if (a.totalContribution > b.totalContribution) {
      //    return -1;
      //  } else {
      //    return 0;
      //  }
      //});

      //return filteredMenuItems;
    };

    var transform = function(doc) {
      var totalContribution = DailySales.find({date: query, menuItemId: doc._id}).map(function (dailySalesItem) {
        var result = HospoHero.analyze.menuItem(doc);
        result.menuItemId = dailySalesItem.menuItemId;
        result.totalContribution = round(result.contribution * (dailySalesItem.actualQuantity || 0));
        console.log(result.totalContribution);
        return result;
      });

      console.log('dailySales -> ', totalContribution);
      //console.log(dailySales.count());
      //if (menuItemsStats.length === dailySales.count()) {
      //  console.log('------------------');
      //  console.log(menuItemsStats[0]);
      //  var i = 0;
      //  var filteredMenuItems = menuItemsIds.map(function (id) {
      //    //console.log('id -> ', id + " " + ++i);
      //    var filteredMenuItemStats = _.filter(menuItemsStats, function (item) {
      //      return item.menuItemId === id;
      //    });
      //
      //    return filteredMenuItemStats.reduce(function (previousValue, currentValue) {
      //      return {
      //        menuItemId: currentValue.menuItemId,
      //        totalIngCost: round(previousValue.totalIngCost + currentValue.totalIngCost),
      //        totalPrepCost: round(previousValue.totalPrepCost + currentValue.totalPrepCost),
      //        totalTax: round(previousValue.tax + currentValue.tax),
      //        totalContribution: round(previousValue.totalContribution + currentValue.totalContribution)
      //      }
      //    });
      //  });
      //}

      return doc;
    };

    var self = this;

    observer = MenuItems.find({_id: '7D3k56oS6H9TdtK5h'}).observe({
      added: function (document) {
        self.added('menuItems', document._id, transform(document));
      },
      changed: function (newDocument, oldDocument) {
        self.changed('menuItems', newDocument._id, transform(newDocument));
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