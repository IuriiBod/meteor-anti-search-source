Migrations.add({
  version: 53,
  name: 'built menu items rank for last 7 days',
  up: function () {
    var menuItemsStatsInCurrentArea = function (areaId, dateInterval) {
      var menuItemsStats = [];
      MenuItems.find({status: {$ne: 'archived'}, 'relations.areaId': areaId}).forEach(function (menuItem) {
        var result = HospoHero.analyze.menuItem(menuItem);

        var itemDailySales = DailySales.find({date: dateInterval, menuItemId: menuItem._id, actualQuantity: {$exists: true}});

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

    Areas.find().forEach(function (area) {
      for (var day = 8; day > 1; day--) {
        var yesterdayDate = moment().subtract(day, 'days');
        var twoWeeksAgoDate = moment(yesterdayDate).subtract(14, 'days');
        var dateInterval = TimeRangeQueryBuilder.forInterval(twoWeeksAgoDate, yesterdayDate);

        var menuItemsStats = menuItemsStatsInCurrentArea(area._id, dateInterval);
        if (menuItemsStats.length) {
          menuItemsStats.sort(function (a, b) {
            return a.totalContribution - b.totalContribution;
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
      }
    });
  }
});