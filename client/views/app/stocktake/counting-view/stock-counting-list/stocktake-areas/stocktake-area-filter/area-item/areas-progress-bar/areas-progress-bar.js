Template.areasProgressBar.helpers({
  widthOfBar: function () {
    let isGeneralArea = this.itemClass === 'garea-filter';

    var getSpecialArea = () => StockAreas.find({
      [isGeneralArea && 'generalAreaId' || '_id']: this.itemId
    });

    var getStocksCount = specialArea =>
      Ingredients.find({_id: {$in: specialArea.stocks}, status: 'active'}).count();

    let getOrderItemsCount = () =>
      Stocktakes.find({version: this.stockTakeData.stockTakeId, generalArea: this.itemId}).count();

    //todo: code below should be refactored
    var specialAreaProgressBar = () => {
      var progressBar = 0;
      var specialArea = getSpecialArea();
      if (specialArea && specialArea.stocks && specialArea.stocks.length) {
        var stocktakes = Stocktakes.find({
          stockId: {$in: specialArea.stocks},
          version: this.stockTakeData.stockTakeId,
          specialArea: this.itemId,
          generalArea: this.stockTakeData.activeGeneralArea
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