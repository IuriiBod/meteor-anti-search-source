Template.areasProgressBar.helpers({
  widthOfBar: function () {
    let isGeneralArea = this.itemClass === 'garea-filter';

    var getSpecialArea = () => StockAreas.find({
      [isGeneralArea && 'generalAreaId' || '_id']: this.itemId
    });

    var getStocksCount = specialArea =>
      Ingredients.find({_id: {$in: specialArea.stocks}, status: 'active'}).count();

    let getOrderItemsCount = () => {
      let generalAreaId = this.itemId;
      let specialAreaIds = StockAreas.find({generalAreaId: generalAreaId}).map(stockArea => stockArea._id);
      return StockItems.find({
        stocktakeId: this.stockTakeData.stockTakeId,
        specialAreaId: {$in: specialAreaIds}
      }).count();
    };

    //todo:stocktake code below should be refactored
    var specialAreaProgressBar = () => {
      var progressBar = 0;
      var specialArea = getSpecialArea();
      if (specialArea && specialArea.ingredients && specialArea.ingredients.length) {
        var stocktakes = StockItems.find({
          'ingredient._id': {$in: specialArea.ingredients},
          stocktakeId: this.stockTakeData.stockTakeId,
          specialAreaId: this.itemId
        }).count();
        var stocks = getStocksCount(specialArea);
        if (stocks > 0) {
          progressBar = (stocktakes / stocks) * 100;
        }
      }
      return progressBar;
    };

    var generalAreaProgressBar = () => {

      var getStockItemsCount = function () {
        var specialAreas = getSpecialArea();
        let totalCount = 0;
        if (specialAreas.count() > 0) {
          specialAreas.forEach(function (doc) {
            if (doc.stocks && doc.stocks.length) {
              var stocks = getStocksCount(doc);
              if (stocks > 0) {
                totalCount += stocks;
              }
            }
          });
        }
        return totalCount;
      };

      let totalCount = getStockItemsCount();
      let orderItemsCount = getOrderItemsCount();
      return orderItemsCount > 0 ? (orderItemsCount / totalCount) * 100 : 0;
    };

    let progress = isGeneralArea ? generalAreaProgressBar() : specialAreaProgressBar();
    return `${progress} %`;
  }
});