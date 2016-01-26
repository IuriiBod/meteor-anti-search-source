Migrations.add({
  version: 51,
  name: 'added menu rank report sparkline for 7 days',
  up: function () {
    for (var day = 1; day < 8; day++) {
      var yesterdayDate = moment(new Date()).subtract(1, 'days').toDate();
      var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days').toDate();
      var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);

      var menuItemsStats = [];

      MenuItems.find({status: {$ne: 'archived'}}).forEach(function (menuItem) {
        var result = HospoHero.analyze.menuItem(menuItem);
        var menuItemsSales = DailySales.find({
          date: dateInterval,
          menuItemId: menuItem._id
        });
        var itemStats = menuItemsSales.map(function (dailySalesItem) {
          return HospoHero.misc.rounding(result.contribution * (dailySalesItem.actualQuantity || 0));
        });

        if (itemStats.length && itemStats.length === menuItemsSales.count()) {
          var reducedItemStats = {};

          var calculateItemStats = itemStats.reduce(function (previousValue, currentValue) {
            return HospoHero.misc.rounding(previousValue + currentValue);
          });

          _.extend(reducedItemStats, {
            menuItemId: menuItem._id,
            totalContribution: calculateItemStats
          });

          menuItemsStats.push(reducedItemStats);
        }
      });

      if (menuItemsStats.length) {
        menuItemsStats.sort(function (a, b) {
          if (a.totalContribution < b.totalContribution) {
            return -1;
          } else if (a.totalContribution > b.totalContribution) {
            return 1;
          } else {
            return 0;
          }
        });

        menuItemsStats.forEach(function (item, index) {
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
  }
});