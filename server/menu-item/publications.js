Meteor.publishAuthorized('menuList', function (areaId, categoryId, status) {
  var query = {
    'relations.areaId': areaId
  };

  if (categoryId && categoryId !== "all") {
    query.category = categoryId;
  }

  if (status) {
    query.status = (status && status !== 'all') ? status : {$ne: 'archived'};
  }

  logger.info('Menu Items list published', categoryId, status);

  return MenuItems.find(query, {sort: {"name": 1}});
});

Meteor.publishComposite('menuItem', function (id, currentAreaId) {
  return {
    find: function () {
      if (this.userId) {
        return MenuItems.find({
          _id: id,
          "relations.areaId": currentAreaId
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
      },
      {
        find: function (menuItem) {
          if (menuItem) {
            let yesterdayDate = moment().subtract(1, 'days');
            let weekAgoDate = moment(yesterdayDate).subtract(14, 'days');
            let dateInterval = TimeRangeQueryBuilder.forInterval(weekAgoDate, yesterdayDate);
            return DailySales.find({
              date: dateInterval,
              menuItemId: menuItem._id,
              actualQuantity: {$exists: true}
            });
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

    if (categoryId && categoryId !== "all") {
      query.category = categoryId;
    }

    logger.info("Menu Items list published", categoryId);

    return MenuItems.find(query, {sort: {name: 1}});
  } else {
    this.ready();
  }
});


AntiSearchSource.allow('menuItems', {
  queryTransform: function (userId, query) {
    return _.extend(query, {
      'relations.areaId': HospoHero.getCurrentAreaId(userId)
    });
  }
});


Meteor.publish('menuItemsSales', function (dailySalesDate, areaId, categoryId, status) {
  if (this.userId) {
    var query = {
      'relations.areaId': areaId,
      weeklyRanks: {
        $exists: true
      }
    };

    if (categoryId && categoryId !== "all") {
      query.category = categoryId;
    }

    query.status = status && status !== 'all' ? status : {$ne: 'archived'};

    var transform = function (menuItem) {
      var analyzedMenuItem = HospoHero.analyze.menuItem(menuItem);
      var itemDailySales = DailySales.find({
        date: dailySalesDate,
        menuItemId: menuItem._id,
        actualQuantity: {$exists: true}
      });

      if (itemDailySales.count()) {
        var totalItemSalesQuantity = 0;
        itemDailySales.forEach(function (item) {
          totalItemSalesQuantity += item.actualQuantity;
        });

        menuItem.stats = _.extend({}, analyzedMenuItem, {
          soldQuantity: totalItemSalesQuantity,
          totalContribution: HospoHero.misc.rounding(analyzedMenuItem.contribution * totalItemSalesQuantity)
        });
      }

      return menuItem;
    };

    var self = this;

    var observer = MenuItems.find(query).observe({
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