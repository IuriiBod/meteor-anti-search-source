var component = FlowComponents.define("salesPrediction", function (props) {
  this.set('currentWeekDate', props.date);
});

component.state.week = function () {
  var currentWeekDate = this.get('currentWeekDate');
  return HospoHero.dateUtils.getWeekDays(currentWeekDate);
};

component.state.weekPrediction = function (id) {
  var currentWeekDate = this.get('currentWeekDate');
  var monday = moment(HospoHero.dateUtils.getDateByWeekDate(currentWeekDate));

  var dates = _.map(HospoHero.dateUtils.getWeekDays(currentWeekDate), function (date) {
    return moment(date).format('YYYY-MM-DD');
  });
  
  var prediction = _.map(SalesPrediction.find({
    date: TimeRangeQueryBuilder.forWeek(monday),
    menuItemId: id
  }, {sort: {date: 1}}).fetch(), function (item) {
    return {date: moment(item.date).format('YYYY-MM-DD'), predictionQuantity: item.quantity};
  });
  var actual = _.map(ImportedActualSales.find({
    date: TimeRangeQueryBuilder.forWeek(monday),
    menuItemId: id
  }, {sort: {date: 1}}).fetch(), function (item) {
    return {date: moment(item.date).format('YYYY-MM-DD'), actualQuantity: item.quantity};
  });

  prediction = _.sortBy(importMissingData(dates, prediction, "predictionQuantity"), "date");
  actual = _.sortBy(importMissingData(dates, actual, "actualQuantity"), "date");
  var result = mergeArrays(prediction, actual);
  return result;
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

var importMissingData = function (dates, importArray, keyName) {
  _.each(dates, function (dateItem) {
    var push = true;
    _.each(importArray, function (item) {
      if (dateItem === item.date) {
        push = false;
      }
    });

    if (push) {
      var toPush = {
        date: dateItem
      };
      toPush[keyName] = 0;
      importArray.push(toPush);
    }
  });
  return importArray
};

var mergeArrays = function (array1, array2) {
  for (var i = 0; i < array1.length; i++) {
    _.extend(array1[i], array2[i])
  }
  return array1
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