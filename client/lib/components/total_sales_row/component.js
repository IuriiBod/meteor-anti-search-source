var component = FlowComponents.define('totalSalesRow', function (props) {
  var year = Router.current().params.year ? Router.current().params.year : moment().year();
  var week = Router.current().params.week ? Router.current().params.week : moment().week();
  this.set('currentWeekDate', {year: year, week: week});
});


component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return HospoHero.dateUtils.getWeekDays(currentWeekDate);
};

component.state.getTotalSales = function (date) {
  var query = {date: TimeRangeQueryBuilder.forDay(date), 'relations.areaId': HospoHero.getCurrentAreaId()};
  var dailySales = DailySales.find(query).fetch();

  console.log('dailySales: ', dailySales);

  var actualTotal = getTotalPrice(dailySales, 'actual');
  var predictionTotal = getTotalPrice(dailySales, 'prediction');
  return {predicted: predictionTotal, actual: actualTotal};
};

var getTotalPrice = function (array, actualOrPrediction) {

  var total = 0;
  if (array && array.length > 0 && !!MenuItems.findOne()) {
    _.each(array, function (item) {

      var quantity = 0;
      switch (actualOrPrediction) {
        case 'actual': quantity = item.actualQuantity || 0; break;
        case 'prediction': quantity = item.predictionQuantity || 0; break;
      };

      var price = 0;
      var menuItem = MenuItems.findOne({_id: item.menuItemId});
      if(menuItem && menuItem.salesPrice) {
        price = menuItem.salesPrice;
      };

      console.log('actualOrPre', actualOrPrediction);
      console.log('quantity: ', quantity);
      console.log('menuItem: ', menuItem);

      total += quantity * price;
    });
  }
  return total;
};