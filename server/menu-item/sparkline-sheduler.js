updateDataForSparkline = function(location) {
  var menuItemsStats = [];
  var menuItemsIds = [];
  var yesterday = moment(new Date()).subtract(1, 'days').toDate();
  var fifteenDaysAgo = moment(yesterday).subtract(14, 'days').toDate();

  var round = function (value) {
    return HospoHero.misc.rounding(value);
  };

  var getMenuItems = function (menuItemId) {
    return MenuItems.findOne({_id: menuItemId});
  };
  //var date2 = moment(new Date()).toDate();
  //console.log('DailySales.findOne({date: date}) ->', DailySales.find({date: date}).count());
  DailySales.find({
    date: {
      $gte: fifteenDaysAgo,
      $lte: yesterday
    }
  }).forEach(function (dailySalesItem) {
    var menuItem = getMenuItems(dailySalesItem.menuItemId);

    var result = HospoHero.analyze.menuItem(menuItem);

    result.menuItemId = dailySalesItem.menuItemId;
    result.totalContribution = round(result.contribution * (dailySalesItem.actualQuantity || dailySalesItem.predictionQuantity || 0));

    menuItemsStats.push(result);

    if (menuItemsIds.indexOf(dailySalesItem.menuItemId) === -1) {
      menuItemsIds.push(dailySalesItem.menuItemId);
    }
  });

  var filteredMenuItems = menuItemsIds.map(function (id) {
    var filteredMenuItemStats = _.filter(menuItemsStats, function (item) {
      return item.menuItemId === id;
    });

    return filteredMenuItemStats.reduce(function (previousValue, currentValue) {
      return {
        menuItemId: currentValue.menuItemId,
        totalContribution: round(previousValue.totalContribution + currentValue.totalContribution)
      }
    });
  });

  console.log('before sort -> ', filteredMenuItems[0]);
  filteredMenuItems.sort(function (a, b) {
    if (a.totalContribution < b.totalContribution) {
      return 1;
    } else if (a.totalContribution > b.totalContribution) {
      return -1;
    } else {
      return 0;
    }
  });
  console.log('after sort -> ', filteredMenuItems[0]);
  filteredMenuItems.forEach(function (item, index) {
    var menuItem = getMenuItems(item.menuItemId);
    //if (!menuItem.rank) {
    //  MenuItems.update({_id: item.menuItemId}, {$set: {rank: []}});
    //}
    if (menuItem.rank.length > 7) {
      menuItem.rank.shift();
      menuItem.rank.push(++index);
    } else {
      menuItem.rank.push(++index);
    }

    MenuItems.update({
      _id: item.menuItemId
    }, {
      $set: {
        rank: menuItem.rank
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