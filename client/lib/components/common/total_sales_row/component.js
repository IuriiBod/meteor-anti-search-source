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

  var actualTotal = getTotalPrice(dailySales, 'actualQuantity');
  var predictionTotal = getTotalPrice(dailySales, 'predictionQuantity');
  return {predicted: predictionTotal, actual: actualTotal};
};

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