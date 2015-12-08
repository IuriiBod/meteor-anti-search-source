Template.predictionSalesRow.helpers({
  weekPrediction: function () {
    var menuItemId = this.menuItem._id;

    var monday = moment(HospoHero.dateUtils.getDateByWeekDate(this.currentWeekDate));

    var dates = HospoHero.dateUtils.getWeekDays(this.currentWeekDate);

    var dailySales = DailySales.find({
      date: TimeRangeQueryBuilder.forWeek(monday),
      menuItemId: menuItemId
    }, {sort: {date: 1}}).fetch();

    return importMissingData(dates, dailySales, menuItemId);
  }
});


var importMissingData = function (dates, importArray, menuItemId) {

  var executedArray = importArray.slice(0);

  dates.forEach(function (dateItem) {
    var toPushMissingItem = true;

    importArray.forEach(function (item, index) {
      if (moment(item.date).isSame(dateItem, 'day')) {
        item.actualQuantity = item.actualQuantity || 0;
        item.predictionQuantity = item.predictionQuantity || 0;

        executedArray[index] = item;
        toPushMissingItem = false;
      }
    });

    if (toPushMissingItem) {
      executedArray.push({
        menuItemId: menuItemId,
        date: moment(dateItem).endOf('day').toDate(),
        actualQuantity: 0,
        predictionQuantity: 0
      });
    }
  });

  return _.sortBy(executedArray, 'date');
};