var calculateMenuItemsStatsForPreviousTwoWeeks = function (dateInterval) {
  var menuItemsStats = [];
  MenuItems.find({status: {$ne: 'archived'}}).forEach(function (menuItem) {
    var result = HospoHero.analyze.menuItem(menuItem);
    var menuItemSales = DailySales.find({
      date: dateInterval,
      menuItemId: menuItem._id
    });

    var itemTotalContribution = menuItemSales.map(function (dailySalesItem) {
      return HospoHero.misc.rounding(result.contribution * (dailySalesItem.actualQuantity || 0));
    });

    if (itemTotalContribution.length && itemTotalContribution.length === menuItemSales.count()) {
      var reducedItemStats = {};

      var getSumOfItemTotalContribution = itemTotalContribution.reduce(function (previousValue, currentValue) {
        return HospoHero.misc.rounding(previousValue + currentValue);
      });

      _.extend(reducedItemStats, {
        menuItemId: menuItem._id,
        totalContribution: getSumOfItemTotalContribution
      });

      menuItemsStats.push(reducedItemStats);
    }
  });

  return menuItemsStats.length && menuItemsStats;
};

var sortMenuItemsByTotalContribution = function (menuItemsStats) {
  menuItemsStats.sort(function (a, b) {
    if (a.totalContribution < b.totalContribution) {
      return -1;
    } else if (a.totalContribution > b.totalContribution) {
      return 1;
    } else {
      return 0;
    }
  });

  return menuItemsStats;
};

updateMenuItemsRank = function(location) {
  var yesterdayDate = moment(new Date()).subtract(1, 'days').toDate();
  var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days').toDate();
  var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);

  var menuItemsStats = calculateMenuItemsStatsForPreviousTwoWeeks(dateInterval);

  var sortedMenuItemsStats = sortMenuItemsByTotalContribution(menuItemsStats);

  sortedMenuItemsStats.forEach(function (item, index) {
    var menuItem = MenuItems.findOne({_id: item.menuItemId});
    if (menuItem.rank && menuItem.rank.length > 6) {
      menuItem.rank.shift();
      menuItem.rank.push(++index);

      MenuItems.update({
        _id: item.menuItemId
      }, {
        $set: {
          rank: menuItem.rank
        }
      });
    } else if (menuItem.rank) {
      menuItem.rank.push(++index);

      MenuItems.update({
        _id: item.menuItemId
      }, {
        $set: {
          rank: menuItem.rank
        }
      });
    } else {
      MenuItems.update({
        _id: item.menuItemId
      }, {
        $set: {
          rank: [++index]
        }
      });
    }
  });
};

if (!HospoHero.isDevelopmentMode()) {
  HospoHero.LocationScheduler.addDailyJob('Analyze Menu Items rank for sparkline', function (location) {
    return 4;
  }, function (location) {
    updateMenuItemsRank(location);
  })
}