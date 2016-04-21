Template.totalSalesRow.helpers({
  week: function () {
    return HospoHero.dateUtils.getWeekDays(this.weekDate);
  },

  getTotalSales: function (date) {
    var query = {date: TimeRangeQueryBuilder.forDay(date), 'relations.areaId': HospoHero.getCurrentAreaId()};
    var dailySales = DailySales.find(query).fetch();

    var actualTotal = getTotalPrice(dailySales, 'actualQuantity');
    var predictionTotal = getTotalPrice(dailySales, 'predictionQuantity');

    return {
      predicted: predictionTotal,
      actual: actualTotal,
      accuracy: HospoHero.analyze.accuracy(actualTotal, predictionTotal)
    };
  }
});


var getTotalPrice = function (array, propertyName) {
  var total = 0;

  if (array && array.length > 0 && !!MenuItems.findOne()) {

    _.each(array, function (item) {
      var quantity = item[propertyName] || 0;
      var price = 0;

      var menuItem = MenuItems.findOne({_id: item.menuItemId});
      if (menuItem && menuItem.salesPrice) {
        price = menuItem.salesPrice;
      }

      total += quantity * price;
    });
  }
  return total;
};