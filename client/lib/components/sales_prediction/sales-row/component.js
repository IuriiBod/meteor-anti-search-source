var component = FlowComponents.define('predictionSalesRow', function (props) {
  this.currentWeekDate = props.currentWeekDate;
  this.set('menuItem', props.menuItem);
});

component.state.weekPrediction = function () {
  var id = this.get('menuItem')._id;

  var monday = moment(HospoHero.dateUtils.getDateByWeekDate(this.currentWeekDate));

  var dates = _.map(HospoHero.dateUtils.getWeekDays(this.currentWeekDate), function (date) {
    return moment(date).format('YYYY-MM-DD');
  });

  var prediction = _.map(DailySales.find({ //SalesPrediction
    date: TimeRangeQueryBuilder.forWeek(monday),
    menuItemId: id
  }, {sort: {date: 1}}).fetch(), function (item) {
    return {date: moment(item.date).format('YYYY-MM-DD'), predictionQuantity: item.quantity};
  });
  var actual = _.map(DailySales.find({ // ImportedActualSales
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