Template.stockTakeMasterList.helpers({
  stocktakes: function() {
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

    var stocktakesGroupedByVersionId = _.groupBy(stocktakes, 'version');

    _.keys(stocktakesGroupedByVersionId).forEach(function (versionId) {
      var stocktakeCost = _.reduce(stocktakesGroupedByVersionId[versionId], function (memo, stocktake) {
        return memo + stocktake.counting * stocktake.unitCost;
      }, 0);

      stocktakeList.push({
        _id: versionId,
        date: stocktakesGroupedByVersionId[versionId][0].date,
        totalStockValue: stocktakeCost
      });
    });
    return stocktakeList;
  }
});