Template.areasProgressBar.helpers({
  widthOfBar: function () {
    let getfilledStockItemsCount = (specialAreaId) =>
      StockItems.find({specialAreaId: specialAreaId, count: {exists: true}}).count();

    let getTotalStockItemsCount = (specialAreaId) =>
      StockItems.find({specialAreaId: specialAreaId}).count();

    let stockArea = this.stockArea;
    let isGeneralArea = !stockArea.generalAreaId;

    let relatedSpecialAreaIds = StockAreas.find({
      [isGeneralArea && 'generalAreaId' || '_id']: this.itemId
    }).map(stockArea => stockArea._id);

    let filledStockItemsCount = _.reduce(relatedSpecialAreaIds, (result, stockAreaId) => result + getfilledStockItemsCount(stockAreaId), 0);
    let totalStockItemsCount = _.reduce(relatedSpecialAreaIds, (result, stockAreaId) => result + getTotalStockItemsCount(stockAreaId), 0);

    let progress = totalStockItemsCount > 0 ? (filledStockItemsCount / totalStockItemsCount) * 100 : 0;
    return `${progress}%`;
  }
});