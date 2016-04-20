console.log('test');
Template.stockPrepItemsList.helpers({
  stockAreaPrepItemsIds() {
    let stockArea = StockAreas.findOne({_id: this.specialAreaId});
    return stockArea.prepItemIds || [];
  },

  stockPrepItemContext(){
    let prepJobItemId = this.toString();
    let prepJobItem = JobItems.findOne({_id: prepJobItemId});
    let templateData = Template.instance().data;
    return {
      prepJobItem: prepJobItem,
      specialAreaId: templateData.specialAreaId,
      stocktakeId: templateData.stocktakeId,
      isEditMode: templateData.isEditMode
    };
  }
});