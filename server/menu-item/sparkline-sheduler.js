updateDataForSparkline = function(location) {
  var processedDailySalesItems = [];
  var menuItemsStats = [];
  var date = moment(new Date('Wed Jan 6 2016 15:00:00 GMT+0200 (EET)')).toDate();
  //var date2 = moment(new Date()).toDate();
  console.log('DailySales.findOne({date: date}) ->', DailySales.find({date: date}).count());
  DailySales.find({date: date}).forEach(function (dailySalesItem) {
    if (!(processedDailySalesItems.indexOf(dailySalesItem.menuItemId) > 0)) {
      processedDailySalesItems.push(dailySalesItem.menuItemId);

      var menuItem = MenuItems.findOne({_id: dailySalesItem.menuItemId});
      if (menuItem) {
        var round = function (value) {
          return HospoHero.misc.rounding(value);
        };

        var result = HospoHero.analyze.menuItem(menuItem);

        result.menuItemId = dailySalesItem.menuItemId;
        result.totalContribution = round(result.contribution * (dailySalesItem.actualQuantity || dailySalesItem.predictionQuantity || 0));
        menuItemsStats.push(result);
      }
    }
  });
  console.log('before sort -> ', menuItemsStats[0]);
  menuItemsStats.sort(function (a, b) {
    if (a.totalContribution < b.totalContribution) {
      return 1;
    } else if (a.totalContribution > b.totalContribution) {
      return -1;
    } else {
      return 0;
    }
  });
  console.log('after sort -> ', menuItemsStats[0]);
  menuItemsStats.forEach(function (item, index) {
    MenuItems.update({
      _id: item.menuItemId
    }, {
      $set: {
        rank: ++index
      }
    })
  })
};

if (HospoHero.isDevelopmentMode()) {
  updateDataForSparkline();
  //HospoHero.LocationScheduler.addDailyJob('Sparkline Sheduler', function (location) {
  //  return 1;
  //}, function (location) {
  //  updateDataForSparkline(location);
  //})
}