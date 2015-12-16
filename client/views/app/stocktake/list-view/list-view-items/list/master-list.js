Template.stockTakeMasterList.helpers({
  listOfDates: function() {
    var stocktakeList = [];
    var stocktakes = Stocktakes.find({}, {
      fields: {
        date: 1,
        counting: 1,
        unitCost: 1,
        version: 1
      },
      sort: {date: -1}
    }).fetch();

    stocktakes = _.groupBy(stocktakes, 'version');


    Object.keys(stocktakes).forEach(function (stocktakeId) {
      var stocktakeCost = _.reduce(stocktakes[stocktakeId], function (memo, stocktake) {
        return memo + stocktake.counting * stocktake.unitCost;
      }, 0);

      stocktakeList.push({
        _id: stocktakeId,
        date: stocktakes[stocktakeId][0].date,
        totalStockValue: stocktakeCost
      });
    });
    return stocktakeList;
  }
});