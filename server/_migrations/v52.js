Migrations.add({
  version: 52,
  name: 'built menu items rank for last 7 days',
  up: function () {
    var menuItemsStatsForLastTwoWeeks = function (dateInterval) {
      var menuItemsStats = [];
      MenuItems.find({status: {$ne: 'archived'}}).forEach(function (menuItem) {
        var result = HospoHero.analyze.menuItem(menuItem);
        var totalItemSalesQuantity = 0;

        var itemDailySales = DailySales.find({date: dateInterval, menuItemId: menuItem._id});

        itemDailySales.forEach(function (item) {
          totalItemSalesQuantity += item.actualQuantity || 0;
        });
        if (itemDailySales.count()) {
          var totalContribution = _.extend({}, {
            menuItemId: menuItem._id,
            totalContribution: HospoHero.misc.rounding(result.contribution * totalItemSalesQuantity)
          });

          menuItemsStats.push(totalContribution);
        }
      });

      return menuItemsStats.length && menuItemsStats;
    };

    var sortMenuItemsByTotalContribution = function (menuItemsStats) {
      return menuItemsStats.sort(function (a, b) {
        if (a.totalContribution < b.totalContribution) {
          return -1;
        } else if (a.totalContribution > b.totalContribution) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    for (var day = 8; day > 1; day--) {
      var yesterdayDate = moment(new Date()).subtract(day, 'days').toDate();
      var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days').toDate();
      var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);

      var menuItemsStats = menuItemsStatsForLastTwoWeeks(dateInterval);

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
    }
  }
});