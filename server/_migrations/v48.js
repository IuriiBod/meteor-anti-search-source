Migrations.add({
  version: 48,
  name: 'added menu rank report sparkline for 7 days',
  up: function () {

    var round = function (value) {
      return HospoHero.misc.rounding(value);
    };

    for (var day = 1; day < 8; day++) {
      var yesterday = moment(new Date()).subtract(day, 'days').toDate();
      var fifteenDaysAgo = moment(yesterday).subtract(14, 'days').toDate();
      var dateInterval = TimeRangeQueryBuilder.forInterval(fifteenDaysAgo, yesterday);

      var menuItemsStats = [];

      MenuItems.find({status: {$ne: 'archived'}}).forEach(function (menuItem) {
        var result = HospoHero.analyze.menuItem(menuItem);
        var menuItemsSales = DailySales.find({
          date: dateInterval,
          menuItemId: menuItem._id
        });
        var itemStats = menuItemsSales.map(function (dailySalesItem) {
          var itemContribution = result.contribution;
          var menuItemId = dailySalesItem.menuItemId;
          var totalContribution = round(itemContribution * (dailySalesItem.actualQuantity || 0));

          return {
            menuItemId: menuItemId,
            totalContribution: totalContribution
          };
        });

        if (itemStats.length && itemStats.length === menuItemsSales.count()) {
          var reducedItemStats = itemStats.reduce(function (previousValue, currentValue) {
            return {
              menuItemId: currentValue.menuItemId,
              totalContribution: round(previousValue.totalContribution + currentValue.totalContribution)
            }
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