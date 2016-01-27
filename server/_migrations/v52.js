Migrations.add({
  version: 52,
  name: 'built menu items rank for last 7 days',
  up: function () {
    var menuItemsStatsInCurrentArea = function (areaId, dateInterval) {
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

    Areas.find().forEach(function (area) {
      for (var day = 8; day > 1; day--) {
        var yesterdayDate = moment(new Date()).subtract(day, 'days').toDate();
        var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days').toDate();
        var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);

        var menuItemsStats = menuItemsStatsInCurrentArea(area._id, dateInterval);
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
      }
    });
  }
});