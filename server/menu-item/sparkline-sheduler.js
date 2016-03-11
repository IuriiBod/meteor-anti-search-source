let menuItemsStatsInCurrentArea = function (areaId) {
  var yesterdayDate = moment().subtract(1, 'days');
  var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days');
  var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);
  var menuItemsStats = [];

  MenuItems.find({status: {$ne: 'archived'}, 'relations.areaId': areaId}).forEach(function (menuItem) {
    var result = HospoHero.analyze.menuItem(menuItem);

    var itemDailySales = DailySales.find({
      date: dateInterval,
      menuItemId: menuItem._id,
      actualQuantity: {$exists: true}
    });

    if (itemDailySales.count()) {
      var totalItemSalesQuantity = 0;
      itemDailySales.forEach(function (item) {
        totalItemSalesQuantity += item.actualQuantity;
      });

      var totalContribution = _.extend({}, {
        menuItemId: menuItem._id,
        totalContribution: HospoHero.misc.rounding(result.contribution * totalItemSalesQuantity)
      });

      menuItemsStats.push(totalContribution);
    }
  });

  return menuItemsStats;
};

let updateMenuItemsRank = function (location) {
  Areas.find({locationId: location._id}).forEach(function (area) {
    var menuItemsStats = menuItemsStatsInCurrentArea(area._id);

    if (menuItemsStats.length) {
      menuItemsStats.sort(function (a, b) {
        return b.totalContribution - a.totalContribution;
      });

      menuItemsStats.forEach(function (item, index) {
        var menuItem = MenuItems.findOne({_id: item.menuItemId});

        var weeklyRanks = menuItem.weeklyRanks || [];
        weeklyRanks.push(index + 1);
        if (weeklyRanks.length > 7) {
          weeklyRanks.shift();
        }

        MenuItems.update({
          _id: item.menuItemId
        }, {
          $set: {
            weeklyRanks: weeklyRanks
          }
        });
      });
    }
  });
};

if (HospoHero.isDevelopmentMode()) {
  HospoHero.LocationScheduler.addDailyJob('Analyze Menu Items rank for sparkline', function () {
    return 4;
  }, function (location) {
    updateMenuItemsRank(location);
  });
}