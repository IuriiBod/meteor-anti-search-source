Template.stockReport.helpers({
  stocktakes: function () {
    let getTotalStockValue = (stocktakesGroup) => {
      return _.reduce(stocktakesGroup, (memo, stocktake) => {
        return memo + (stocktake.counting * stocktake.unitCost);
      }, 0);
    };

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

    _.keys(stocktakesGroupedByVersionId).forEach((versionId) => {
      let stocktakesGroup = stocktakesGroupedByVersionId[versionId];

      stocktakeList.push({
        _id: versionId,
        date: stocktakesGroup[0].date,
        totalStockValue: getTotalStockValue(stocktakesGroup),
        expectedCostOfGoods: Math.random() * 50
      });
    });

    return stocktakeList;
  }
});