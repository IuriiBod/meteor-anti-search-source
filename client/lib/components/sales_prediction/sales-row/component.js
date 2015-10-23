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

  var dailySales = _.map(DailySales.find({
    date: TimeRangeQueryBuilder.forWeek(monday),
    menuItemId: id
  }, {sort: {date: 1}}).fetch(), function (item) {
    return {date: moment(item.date).format('YYYY-MM-DD'), actualQuantity: item.actualQuantity, predictionQuantity: item.predictionQuantity};
  });
  dailySales = _.sortBy(importMissingData(dates, dailySales), 'date');
  return dailySales;

};

var importMissingData = function (dates, importArray) {

  var executedArray = importArray.slice(0);

  _.each(dates, function (dateItem) {
    var toPushMissingItem = true;
    _.each(importArray, function (item, index) {
      if (item.date === dateItem) {
        item.actualQuantity = item.actualQuantity || 0;
        item.predictionQuantity = item.predictionQuantity || 0;
        executedArray[index] = item;
        toPushMissingItem = false;
      }
    });

    if (toPushMissingItem) {
      executedArray.push({
        date: dateItem,
        actualQuantity: 0,
        predictionQuantity: 0
      });
    };
  });

  return executedArray;
};