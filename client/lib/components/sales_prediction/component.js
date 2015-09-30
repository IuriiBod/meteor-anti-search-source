var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
});

component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return HospoHero.dateUtils.getWeekDays(currentWeekDate);
};

component.state.menuItems = function () {
  return MenuItems.find().fetch();
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
  _.each(array, function (item) {
    var quantity = item.quantity;
    var price = MenuItems.findOne({_id: item.menuItemId}).salesPrice;
    total += quantity * price;
  });
  return total;
};