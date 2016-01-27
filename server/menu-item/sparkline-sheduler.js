var menuItemsStatsInCurrentArea = function (areaId) {
  var yesterdayDate = moment().subtract(1, 'days');
  var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days');
  var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);
  var menuItemsStats = [];

  MenuItems.find({status: {$ne: 'archived'}, 'relations.areaId': areaId}).forEach(function (menuItem) {
    var result = HospoHero.analyze.menuItem(menuItem);
    var totalItemSalesQuantity = 0;

    var itemDailySales = DailySales.find({date: dateInterval, menuItemId: menuItem._id, actualQuantity: {$exists: true}});

    itemDailySales.forEach(function (item) {
      totalItemSalesQuantity += item.actualQuantity;
    });

    if (itemDailySales.count()) {
      var totalContribution = _.extend({}, {
        menuItemId: menuItem._id,
        totalContribution: HospoHero.misc.rounding(result.contribution * totalItemSalesQuantity)
      });

      menuItemsStats.push(totalContribution);
    }
  });

  return menuItemsStats;
};

updateMenuItemsRank = function() {

  Areas.find().forEach(function (area) {
    var menuItemsStats = menuItemsStatsInCurrentArea(area._id);

    if (menuItemsStats.length) {
      menuItemsStats.sort(function (a, b) {
        return a.totalContribution - b.totalContribution;
      });

      menuItemsStats.forEach(function (item, index) {
        var menuItem = MenuItems.findOne({_id: item.menuItemId});

        var weeklyRanks = menuItem.rank || [];
        weeklyRanks.push(index + 1);
        if (weeklyRanks.length > 6) {
          weeklyRanks.shift();
        }

        MenuItems.update({
          _id: item.menuItemId
        }, {
          $set: {
            rank: weeklyRanks
          }
        });
      });
    }
  });
};

if (HospoHero.isDevelopmentMode()) {
  updateMenuItemsRank();
  //HospoHero.LocationScheduler.addDailyJob('Analyze Menu Items rank for sparkline', function () {
  //  return 4;
  //}, function () {
  //  updateMenuItemsRank();
  //})
}