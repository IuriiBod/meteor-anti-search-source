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
  var predictions = SalesPrediction.find({date: TimeRangeQueryBuilder.forDay(date)}).fetch();
  var actual = ImportedActualSales.find({date: TimeRangeQueryBuilder.forDay(date)}).fetch();
  var actualTotal = getTotalPrice(actual);
  var predictionTotal = getTotalPrice(predictions);
  return {predicted: predictionTotal, actual: actualTotal};
};

var getTotalPrice = function (array) {

  var total = 0;
  if (array && array.length > 0 && !!MenuItems.findOne()) {
    _.each(array, function (item) {
      var quantity = item.quantity;
      var price = MenuItems.findOne({_id: item.menuItemId}).salesPrice;
      total += quantity * price;
    });
  }
  return total;
};