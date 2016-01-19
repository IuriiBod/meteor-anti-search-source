Migrations.add({
  version: 48,
  name: 'added menu rank report sparkline for 7 days',
  up: function () {
    var yesterday = moment(new Date()).subtract(1, 'days').toDate();
    var fifteenDaysAgo = moment(new Date()).subtract(7, 'days').toDate();
    var processedDailySalesItems = [];
    var menuItemsStats = [];
    var menuItemsByNames = [];

    DailySales.find({
      date: {
        $gte: fifteenDaysAgo,
        $lte: yesterday
      }
    }).forEach(function (item) {
      var menuItem = MenuItems.findOne({_id: item.menuItemId});
      var round = function (value) {
        return HospoHero.misc.rounding(value);
      };

      var result = HospoHero.analyze.menuItem(menuItem);

      result.menuItemId = item.menuItemId;
      result.totalContribution = round(result.contribution * (item.actualQuantity || item.predictionQuantity || 0));
      menuItemsStats.push(result);
    });

    menuItemsStats.forEach(function (item) {
      if (!(processedDailySalesItems.indexOf(item.menuItemId) > 0)) {
        processedDailySalesItems.push(item.menuItemId);

      }
    });

    menuItemsStats.sort(function (a, b) {
      if (a.totalContribution < b.totalContribution) {
        return 1;
      } else if (a.totalContribution > b.totalContribution) {
        return -1;
      } else {
        return 0;
      }
    });

    menuItemsStats.forEach(function (item, index) {
      if (!(processedDailySalesItems.indexOf(item.menuItemId) > 0)) {
        processedDailySalesItems.push(item.menuItemId);

        MenuItems.update({
          _id: item.menuItemId
        }, {
          $set: {
            rank: [++index]
          }
        })
      } else {
        MenuItems.update({
          _id: item.menuItemId
        }, {
          $push: {
            rank: ++index
          }
        });
      }
    })
  }
});