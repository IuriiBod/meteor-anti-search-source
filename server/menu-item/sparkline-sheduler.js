updateDataForSparkline = function(location) {
  var processedDailySalesItems = [];
  var menuItemsStats = [];
  var date = moment(new Date('Sun Jan 17 2016 15:00:00 GMT+0200 (EET)')).toDate();
  console.log('DailySales.findOne({date: date}) ->', DailySales.findOne({date: date}));
  DailySales.find({date: date}).forEach(function (dailySalesItem) {
    if (!(processedDailySalesItems.indexOf(dailySalesItem.menuItemId) > 0)) {
      processedDailySalesItems.push(dailySalesItem.menuItemId);

      var menuItem = MenuItems.findOne({_id: dailySalesItem.menuItemId});
      if (menuItem) {
        var round = function (value) {
          return HospoHero.misc.rounding(value);
        };

        var processMenuEntry = function (propertyName, predicate) {
          var entriesField = menuItem[propertyName];
          return _.isArray(entriesField) && round(_.reduce(entriesField, predicate, 0)) || 0;
        };

        var result = {
          totalIngCost: processMenuEntry('ingredients', function (total, ingredientEntry) {
            var ingredient = Ingredients.findOne({_id: ingredientEntry._id});
            var ingredientProps = HospoHero.analyze.ingredient(ingredient);
            total += ingredientProps.costPerPortionUsed * ingredientEntry.quantity;
            return total;
          }),

          totalPrepCost: processMenuEntry('jobItems', function (total, jobEntry) {
            var job = JobItems.findOne({_id: jobEntry._id});
            var jobItemProps = HospoHero.analyze.jobItem(job);
            total += jobItemProps.prepCostPerPortion * jobEntry.quantity;
            return total;
          }),

          tax: round(menuItem.salesPrice * 0.1)
        };

        result.contribution = round(menuItem.salesPrice - result.totalPrepCost - result.totalIngCost - result.tax);
        result.menuItemId = dailySalesItem.menuItemId;
        result.totalContribution = round(result.contribution * (dailySalesItem.predictionQuantity || 0));
        menuItemsStats.push(result);
      }
    }
  });
  console.log('before sort -> ', menuItemsStats[0]);
  menuItemsStats.sort(function (a, b) {
    if (a.totalContribution > b.totalContribution) {
      return -1;
    } else if (a.totalContribution < b.totalContribution) {
      return 1;
    } else { return 0; }
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