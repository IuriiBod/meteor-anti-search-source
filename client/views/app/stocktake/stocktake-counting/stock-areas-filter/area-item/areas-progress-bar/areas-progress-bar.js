Template.areasProgressBar.helpers({
  widthOfBar: function () {
    let getFilledStockItemsCount = (specialAreaId) =>
      StockItems.find({specialAreaId: specialAreaId, count: {$exists: true}}).count();

    let getTotalStockItemsCount = (specialAreaId) => {
      let stockArea = StockAreas.findOne({_id: specialAreaId});
      return HospoHero.utils.getNestedProperty(stockArea, 'ingredientsIds.length', 0);

    };

    let stockArea = this.stockArea;
    let isGeneralArea = !stockArea.generalAreaId;

    let relatedSpecialAreaIds = StockAreas.find({
      [isGeneralArea && 'generalAreaId' || '_id']: this.stockArea._id
    }).map(stockArea => stockArea._id);

    let sumFilledStockItems = (result, stockAreaId) => result + getFilledStockItemsCount(stockAreaId);
    let filledStockItemsCount = _.reduce(relatedSpecialAreaIds, sumFilledStockItems, 0);

    let sumAllStockItems = (result, stockAreaId) => result + getTotalStockItemsCount(stockAreaId);
    let totalStockItemsCount = _.reduce(relatedSpecialAreaIds, sumAllStockItems, 0);

    let progress = totalStockItemsCount > 0 ? (filledStockItemsCount / totalStockItemsCount) * 100 : 0;
    return `${progress}%`;
  }
});